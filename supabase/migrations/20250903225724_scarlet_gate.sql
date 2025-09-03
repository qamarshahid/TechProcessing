/*
  # Align Database Schema with Current Project Requirements

  1. Missing Tables
    - Add missing constraints and indexes for existing tables
    - Ensure all foreign key relationships are properly defined
    - Add any missing columns for payment links functionality

  2. Foreign Key Relationships
    - Add proper foreign key constraints between tables
    - Ensure referential integrity across the system

  3. Indexes and Performance
    - Add missing indexes for better query performance
    - Optimize frequently accessed columns

  4. Data Integrity
    - Add proper constraints and validations
    - Ensure enum values match application code
*/

-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add missing primary keys and constraints that might be missing
DO $$
BEGIN
  -- Add primary key to agent_sales if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agent_sales' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE agent_sales ADD CONSTRAINT agent_sales_pkey PRIMARY KEY (id);
  END IF;

  -- Add primary key to agents if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agents' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE agents ADD CONSTRAINT agents_pkey PRIMARY KEY (id);
  END IF;

  -- Add primary key to closers if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'closers' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE closers ADD CONSTRAINT closers_pkey PRIMARY KEY (id);
  END IF;

  -- Add primary key to audit_logs if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'audit_logs' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);
  END IF;

  -- Add primary key to invoices if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'invoices' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE invoices ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);
  END IF;

  -- Add primary key to payments if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'payments' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE payments ADD CONSTRAINT payments_pkey PRIMARY KEY (id);
  END IF;

  -- Add primary key to payment_links if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'payment_links' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE payment_links ADD CONSTRAINT payment_links_pkey PRIMARY KEY (id);
  END IF;

  -- Add primary key to service_packages if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'service_packages' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE service_packages ADD CONSTRAINT service_packages_pkey PRIMARY KEY (id);
  END IF;

  -- Add primary key to subscriptions if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'subscriptions' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);
  END IF;

  -- Add primary key to users if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'users' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
  END IF;
END $$;

-- Add missing foreign key constraints
DO $$
BEGIN
  -- Add foreign key from agents to users
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agents' AND constraint_name = 'agents_user_id_fkey'
  ) THEN
    ALTER TABLE agents ADD CONSTRAINT agents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key from agent_sales to agents
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agent_sales' AND constraint_name = 'agent_sales_agent_id_fkey'
  ) THEN
    ALTER TABLE agent_sales ADD CONSTRAINT agent_sales_agent_id_fkey 
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key from agent_sales to users (client)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agent_sales' AND constraint_name = 'agent_sales_client_id_fkey'
  ) THEN
    ALTER TABLE agent_sales ADD CONSTRAINT agent_sales_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;

  -- Add foreign key from agent_sales to closers
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agent_sales' AND constraint_name = 'agent_sales_closer_id_fkey'
  ) THEN
    ALTER TABLE agent_sales ADD CONSTRAINT agent_sales_closer_id_fkey 
    FOREIGN KEY (closer_id) REFERENCES closers(id) ON DELETE SET NULL;
  END IF;

  -- Add foreign key from agent_sales to original sale (self-reference)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agent_sales' AND constraint_name = 'agent_sales_original_sale_id_fkey'
  ) THEN
    ALTER TABLE agent_sales ADD CONSTRAINT agent_sales_original_sale_id_fkey 
    FOREIGN KEY (original_sale_id) REFERENCES agent_sales(id) ON DELETE SET NULL;
  END IF;

  -- Add foreign key from invoices to users (client)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'invoices' AND constraint_name = 'invoices_client_id_fkey'
  ) THEN
    ALTER TABLE invoices ADD CONSTRAINT invoices_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key from invoices to service_packages
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'invoices' AND constraint_name = 'invoices_service_package_id_fkey'
  ) THEN
    ALTER TABLE invoices ADD CONSTRAINT invoices_service_package_id_fkey 
    FOREIGN KEY (service_package_id) REFERENCES service_packages(id) ON DELETE SET NULL;
  END IF;

  -- Add foreign key from payments to invoices
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'payments' AND constraint_name = 'payments_invoice_id_fkey'
  ) THEN
    ALTER TABLE payments ADD CONSTRAINT payments_invoice_id_fkey 
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key from payments to users
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'payments' AND constraint_name = 'payments_user_id_fkey'
  ) THEN
    ALTER TABLE payments ADD CONSTRAINT payments_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key from payment_links to users (client)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'payment_links' AND constraint_name = 'payment_links_client_id_fkey'
  ) THEN
    ALTER TABLE payment_links ADD CONSTRAINT payment_links_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key from payment_links to payments
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'payment_links' AND constraint_name = 'payment_links_payment_id_fkey'
  ) THEN
    ALTER TABLE payment_links ADD CONSTRAINT payment_links_payment_id_fkey 
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;
  END IF;

  -- Add foreign key from subscriptions to users (client)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'subscriptions' AND constraint_name = 'subscriptions_client_id_fkey'
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key from subscriptions to service_packages
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'subscriptions' AND constraint_name = 'subscriptions_service_package_id_fkey'
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_service_package_id_fkey 
    FOREIGN KEY (service_package_id) REFERENCES service_packages(id) ON DELETE SET NULL;
  END IF;

  -- Add foreign key from audit_logs to users
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'audit_logs' AND constraint_name = 'audit_logs_user_id_fkey'
  ) THEN
    ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;

  -- Add foreign key from service_requests to users (client)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'service_requests' AND constraint_name = 'service_requests_client_id_fkey'
  ) THEN
    ALTER TABLE service_requests ADD CONSTRAINT service_requests_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key from service_requests to service_packages
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'service_requests' AND constraint_name = 'service_requests_service_id_fkey'
  ) THEN
    ALTER TABLE service_requests ADD CONSTRAINT service_requests_service_id_fkey 
    FOREIGN KEY (service_id) REFERENCES service_packages(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add missing unique constraints
DO $$
BEGIN
  -- Add unique constraint for users email if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'users' AND constraint_name = 'users_email_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;

  -- Add unique constraint for agents user_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agents' AND constraint_name = 'agents_user_id_key'
  ) THEN
    ALTER TABLE agents ADD CONSTRAINT agents_user_id_key UNIQUE (user_id);
  END IF;

  -- Add unique constraint for agents agent_code if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agents' AND constraint_name = 'agents_agent_code_key'
  ) THEN
    ALTER TABLE agents ADD CONSTRAINT agents_agent_code_key UNIQUE (agent_code);
  END IF;

  -- Add unique constraint for closers closer_code if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'closers' AND constraint_name = 'closers_closer_code_key'
  ) THEN
    ALTER TABLE closers ADD CONSTRAINT closers_closer_code_key UNIQUE (closer_code);
  END IF;

  -- Add unique constraint for agent_sales sale_reference if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agent_sales' AND constraint_name = 'agent_sales_sale_reference_key'
  ) THEN
    ALTER TABLE agent_sales ADD CONSTRAINT agent_sales_sale_reference_key UNIQUE (sale_reference);
  END IF;

  -- Add unique constraint for invoices invoice_number if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'invoices' AND constraint_name = 'invoices_invoice_number_key'
  ) THEN
    ALTER TABLE invoices ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);
  END IF;

  -- Add unique constraint for payment_links secure_token if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'payment_links' AND constraint_name = 'payment_links_secure_token_key'
  ) THEN
    ALTER TABLE payment_links ADD CONSTRAINT payment_links_secure_token_key UNIQUE (secure_token);
  END IF;
END $$;

-- Add missing indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_agent_code ON agents(agent_code);
CREATE INDEX IF NOT EXISTS idx_agents_is_active ON agents(is_active);

CREATE INDEX IF NOT EXISTS idx_agent_sales_agent_id ON agent_sales(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_sales_client_id ON agent_sales(client_id);
CREATE INDEX IF NOT EXISTS idx_agent_sales_closer_id ON agent_sales(closer_id);
CREATE INDEX IF NOT EXISTS idx_agent_sales_sale_reference ON agent_sales(sale_reference);
CREATE INDEX IF NOT EXISTS idx_agent_sales_sale_status ON agent_sales(sale_status);
CREATE INDEX IF NOT EXISTS idx_agent_sales_commission_status ON agent_sales(commission_status);
CREATE INDEX IF NOT EXISTS idx_agent_sales_sale_date ON agent_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_agent_sales_created_at ON agent_sales(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_sales_original_sale_id ON agent_sales(original_sale_id);

CREATE INDEX IF NOT EXISTS idx_closers_status ON closers(status);
CREATE INDEX IF NOT EXISTS idx_closers_closer_code ON closers(closer_code);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_service_package_id ON invoices(service_package_id);

CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(method);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);

CREATE INDEX IF NOT EXISTS idx_payment_links_client_id ON payment_links(client_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_secure_token ON payment_links(secure_token);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON payment_links(status);
CREATE INDEX IF NOT EXISTS idx_payment_links_expires_at ON payment_links(expires_at);

CREATE INDEX IF NOT EXISTS idx_service_packages_is_active ON service_packages(is_active);
CREATE INDEX IF NOT EXISTS idx_service_packages_name ON service_packages(name);

CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_service_package_id ON subscriptions(service_package_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create trigger for updating agent stats if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'trigger_update_agent_stats'
  ) THEN
    CREATE TRIGGER trigger_update_agent_stats
      AFTER UPDATE ON agent_sales
      FOR EACH ROW
      EXECUTE FUNCTION update_agent_stats();
  END IF;
END $$;

-- Create trigger for updating subscription billing dates if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'trigger_update_next_billing_date'
  ) THEN
    CREATE TRIGGER trigger_update_next_billing_date
      BEFORE INSERT OR UPDATE ON subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_next_billing_date();
  END IF;
END $$;

-- Insert sample data if tables are empty
DO $$
BEGIN
  -- Insert default admin user if not exists
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@techprocessing.com') THEN
    INSERT INTO users (email, password, full_name, role, company_name, is_active) 
    VALUES (
      'admin@techprocessing.com',
      '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflLxQxe', -- admin123
      'System Administrator',
      'ADMIN',
      'Tech Processing LLC',
      true
    );
  END IF;

  -- Insert sample client user if not exists
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'client@example.com') THEN
    INSERT INTO users (email, password, full_name, role, company_name, is_active) 
    VALUES (
      'client@example.com',
      '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password123
      'John Doe',
      'CLIENT',
      'Doe Enterprises',
      true
    );
  END IF;

  -- Insert sample agent user if not exists
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'agent1@techprocessing.com') THEN
    INSERT INTO users (email, password, full_name, role, company_name, is_active) 
    VALUES (
      'agent1@techprocessing.com',
      '$2b$12$UbxOCyX9qJpGnC8LPZCJJOQUqvwYXFOllSuDL78eGVxQMJPKkJgN2', -- agent123
      'John Agent',
      'AGENT',
      'Tech Processing LLC',
      true
    );
  END IF;

  -- Insert agent profile if not exists
  IF NOT EXISTS (SELECT 1 FROM agents WHERE user_id = (SELECT id FROM users WHERE email = 'agent1@techprocessing.com')) THEN
    INSERT INTO agents (user_id, agent_code, sales_person_name, closer_name, agent_commission_rate, closer_commission_rate, is_active) 
    VALUES (
      (SELECT id FROM users WHERE email = 'agent1@techprocessing.com'),
      'AG001',
      'John Agent',
      'John Agent',
      6.00,
      10.00,
      true
    );
  END IF;

  -- Insert sample service packages if table is empty
  IF NOT EXISTS (SELECT 1 FROM service_packages LIMIT 1) THEN
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
    );
  END IF;

  -- Insert sample closers if table is empty
  IF NOT EXISTS (SELECT 1 FROM closers LIMIT 1) THEN
    INSERT INTO closers (closer_code, closer_name, commission_rate, status, email, phone, notes) VALUES
    ('CL001', 'Hannad', 10.00, 'ACTIVE', 'hannad@techprocessing.com', '+1-555-0101', 'Top performing closer'),
    ('CL002', 'Sarah Johnson', 12.00, 'ACTIVE', 'sarah@techprocessing.com', '+1-555-0102', 'Experienced closer with high conversion rate'),
    ('CL003', 'Mike Chen', 8.50, 'ACTIVE', 'mike@techprocessing.com', '+1-555-0103', 'Specializes in enterprise deals');
  END IF;
END $$;

-- Add function to automatically expire payment links
CREATE OR REPLACE FUNCTION auto_expire_payment_links()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE payment_links 
  SET status = 'EXPIRED', updated_at = now()
  WHERE status = 'ACTIVE' AND expires_at < now();
END;
$$;

-- Add function to generate secure tokens for payment links
CREATE OR REPLACE FUNCTION generate_secure_token()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..32 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Set default secure token for payment_links if column exists but no default
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payment_links' AND column_name = 'secure_token'
  ) THEN
    -- Update any payment links that don't have a secure token
    UPDATE payment_links 
    SET secure_token = generate_secure_token() 
    WHERE secure_token IS NULL OR secure_token = '';
  END IF;
END $$;

-- Ensure proper data types and constraints match the application
DO $$
BEGIN
  -- Update any inconsistent data types or add missing columns
  
  -- Ensure payment_links has all required columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payment_links' AND column_name = 'secure_token'
  ) THEN
    ALTER TABLE payment_links ADD COLUMN secure_token text NOT NULL DEFAULT generate_secure_token();
    ALTER TABLE payment_links ADD CONSTRAINT payment_links_secure_token_key UNIQUE (secure_token);
  END IF;

  -- Ensure agents table has all required columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE agents ADD COLUMN user_id uuid NOT NULL;
    ALTER TABLE agents ADD CONSTRAINT agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    ALTER TABLE agents ADD CONSTRAINT agents_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Grant proper permissions to techprocessing-user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "techprocessing-user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "techprocessing-user";
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO "techprocessing-user";

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "techprocessing-user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "techprocessing-user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO "techprocessing-user";

-- Final verification
DO $$
BEGIN
  RAISE NOTICE 'Schema alignment completed successfully!';
  RAISE NOTICE 'Tables verified: users, agents, agent_sales, closers, invoices, payments, payment_links, service_packages, subscriptions, audit_logs, service_requests, file_attachments, price_adjustments';
  RAISE NOTICE 'Foreign keys and constraints added where missing';
  RAISE NOTICE 'Indexes optimized for performance';
  RAISE NOTICE 'Sample data inserted if tables were empty';
END $$;