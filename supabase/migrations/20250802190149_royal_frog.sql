/*
  # Create Initial Database Schema

  1. New Tables
    - `users` - User accounts with roles and profile information
    - `service_packages` - Predefined service offerings
    - `invoices` - Client invoices and billing
    - `payments` - Payment transactions and history
    - `audit_logs` - System activity and security logging

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure password storage with proper constraints

  3. Indexes
    - Performance indexes on frequently queried columns
    - Unique constraints for data integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'CLIENT' CHECK (role IN ('ADMIN', 'CLIENT')),
  company_name text,
  address jsonb,
  communication_details jsonb,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service packages table
CREATE TABLE IF NOT EXISTS service_packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  features jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number text UNIQUE NOT NULL,
  client_id uuid NOT NULL REFERENCES users(id),
  service_package_id uuid REFERENCES service_packages(id),
  amount decimal(10,2) NOT NULL,
  tax decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED')),
  description text NOT NULL,
  line_items jsonb,
  due_date timestamptz NOT NULL,
  sent_date timestamptz,
  paid_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id uuid NOT NULL REFERENCES invoices(id),
  user_id uuid NOT NULL REFERENCES users(id),
  amount decimal(10,2) NOT NULL,
  method text NOT NULL CHECK (method IN ('CARD', 'ZELLE', 'CASHAPP', 'BANK_TRANSFER')),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED')),
  transaction_id text,
  gateway_response jsonb,
  processed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  details jsonb,
  ip_address inet,
  user_agent text,
  user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (id = current_setting('app.current_user_id')::uuid OR current_setting('app.current_user_role') = 'ADMIN');

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (id = current_setting('app.current_user_id')::uuid OR current_setting('app.current_user_role') = 'ADMIN');

CREATE POLICY "Only admins can create users"
  ON users
  FOR INSERT
  WITH CHECK (current_setting('app.current_user_role') = 'ADMIN');

CREATE POLICY "Only admins can delete users"
  ON users
  FOR DELETE
  USING (current_setting('app.current_user_role') = 'ADMIN');

-- RLS Policies for service_packages table
CREATE POLICY "Everyone can read active service packages"
  ON service_packages
  FOR SELECT
  USING (is_active = true OR current_setting('app.current_user_role') = 'ADMIN');

CREATE POLICY "Only admins can manage service packages"
  ON service_packages
  FOR ALL
  USING (current_setting('app.current_user_role') = 'ADMIN');

-- RLS Policies for invoices table
CREATE POLICY "Users can read own invoices"
  ON invoices
  FOR SELECT
  USING (client_id = current_setting('app.current_user_id')::uuid OR current_setting('app.current_user_role') = 'ADMIN');

CREATE POLICY "Only admins can manage invoices"
  ON invoices
  FOR INSERT, UPDATE, DELETE
  USING (current_setting('app.current_user_role') = 'ADMIN');

-- RLS Policies for payments table
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id')::uuid OR current_setting('app.current_user_role') = 'ADMIN');

CREATE POLICY "Users can create payments for own invoices"
  ON payments
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id')::uuid OR current_setting('app.current_user_role') = 'ADMIN');

CREATE POLICY "Only admins can update payments"
  ON payments
  FOR UPDATE
  USING (current_setting('app.current_user_role') = 'ADMIN');

-- RLS Policies for audit_logs table
CREATE POLICY "Only admins can read audit logs"
  ON audit_logs
  FOR SELECT
  USING (current_setting('app.current_user_role') = 'ADMIN');

CREATE POLICY "System can insert audit logs"
  ON audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Insert default admin user
INSERT INTO users (email, password, full_name, role) 
VALUES (
  'admin@techprocessing.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflLxQxe', -- admin123
  'System Administrator',
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample client user
INSERT INTO users (email, password, full_name, role, company_name) 
VALUES (
  'client@example.com',
  '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password123
  'John Doe',
  'CLIENT',
  'Doe Enterprises'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample service packages
INSERT INTO service_packages (name, description, price, features) VALUES
(
  'Starter Website Package',
  'Perfect for small businesses and personal websites',
  799.00,
  '["Responsive Design", "Up to 5 Pages", "Contact Form", "Basic SEO", "1 Month Support"]'
),
(
  'Business Website Package',
  'Professional website with advanced features',
  1999.00,
  '["Custom Design", "Up to 15 Pages", "E-commerce Ready", "Advanced SEO", "Analytics Setup", "3 Months Support"]'
),
(
  'Enterprise Application',
  'Full-stack web application with custom functionality',
  4999.00,
  '["Custom Development", "Database Integration", "User Authentication", "Admin Dashboard", "API Development", "6 Months Support"]'
) ON CONFLICT DO NOTHING;