-- Create closers table
CREATE TABLE IF NOT EXISTS closers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    closer_code VARCHAR(50) UNIQUE NOT NULL,
    closer_name VARCHAR(200) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    email VARCHAR(255),
    phone VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add closer_id column to agent_sales table
ALTER TABLE agent_sales ADD COLUMN IF NOT EXISTS closer_id UUID REFERENCES closers(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_closers_status ON closers(status);
CREATE INDEX IF NOT EXISTS idx_closers_code ON closers(closer_code);
CREATE INDEX IF NOT EXISTS idx_agent_sales_closer_id ON agent_sales(closer_id);

-- Add some sample closers
INSERT INTO closers (closer_code, closer_name, commission_rate, status, email, phone, notes) VALUES
('CL001', 'John Smith', 10.00, 'ACTIVE', 'john.smith@example.com', '+1-555-0101', 'Senior closer with 5+ years experience'),
('CL002', 'Sarah Johnson', 12.00, 'ACTIVE', 'sarah.johnson@example.com', '+1-555-0102', 'Specializes in enterprise sales'),
('CL003', 'Mike Davis', 8.50, 'ACTIVE', 'mike.davis@example.com', '+1-555-0103', 'New closer, training in progress'),
('CL004', 'Lisa Wilson', 11.00, 'INACTIVE', 'lisa.wilson@example.com', '+1-555-0104', 'On leave until further notice')
ON CONFLICT (closer_code) DO NOTHING;
