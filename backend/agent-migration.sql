-- Add Agent System Tables
-- Simplified migration for local development

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_code VARCHAR(100) UNIQUE NOT NULL,
    sales_person_name VARCHAR(100) NOT NULL,
    closer_name VARCHAR(100) NOT NULL,
    agent_commission_rate DECIMAL(5,2) DEFAULT 6.00,
    closer_commission_rate DECIMAL(5,2) DEFAULT 10.00,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    total_paid_out DECIMAL(10,2) DEFAULT 0.00,
    pending_commission DECIMAL(10,2) DEFAULT 0.00,
    total_sales INTEGER DEFAULT 0,
    total_sales_value DECIMAL(12,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_sales table
CREATE TABLE IF NOT EXISTS agent_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sale_reference VARCHAR(100) UNIQUE NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    client_email VARCHAR(200) NOT NULL,
    client_phone VARCHAR(20),
    service_name VARCHAR(200) NOT NULL,
    service_description TEXT,
    sale_amount DECIMAL(10,2) NOT NULL,
    agent_commission_rate DECIMAL(5,2) NOT NULL,
    closer_commission_rate DECIMAL(5,2) NOT NULL,
    agent_commission DECIMAL(10,2) NOT NULL,
    closer_commission DECIMAL(10,2) NOT NULL,
    total_commission DECIMAL(10,2) NOT NULL,
    sale_status VARCHAR(20) DEFAULT 'PENDING' CHECK (sale_status IN ('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED')),
    commission_status VARCHAR(20) DEFAULT 'PENDING' CHECK (commission_status IN ('PENDING', 'APPROVED', 'PAID', 'CANCELLED')),
    sale_date DATE,
    payment_date DATE,
    commission_paid_date DATE,
    notes TEXT,
    client_details JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_agent_code ON agents(agent_code);
CREATE INDEX IF NOT EXISTS idx_agents_is_active ON agents(is_active);

CREATE INDEX IF NOT EXISTS idx_agent_sales_agent_id ON agent_sales(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_sales_client_id ON agent_sales(client_id);
CREATE INDEX IF NOT EXISTS idx_agent_sales_sale_reference ON agent_sales(sale_reference);
CREATE INDEX IF NOT EXISTS idx_agent_sales_sale_status ON agent_sales(sale_status);
CREATE INDEX IF NOT EXISTS idx_agent_sales_commission_status ON agent_sales(commission_status);
CREATE INDEX IF NOT EXISTS idx_agent_sales_sale_date ON agent_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_agent_sales_created_at ON agent_sales(created_at);

-- Create function to update agent statistics
CREATE OR REPLACE FUNCTION update_agent_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update agent statistics when sale status changes
    IF TG_OP = 'UPDATE' AND OLD.sale_status != NEW.sale_status THEN
        UPDATE agents 
        SET 
            total_sales = (
                SELECT COUNT(*) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND sale_status = 'APPROVED'
            ),
            total_sales_value = (
                SELECT COALESCE(SUM(sale_amount), 0) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND sale_status = 'APPROVED'
            ),
            total_earnings = (
                SELECT COALESCE(SUM(total_commission), 0) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND sale_status = 'APPROVED'
            ),
            total_paid_out = (
                SELECT COALESCE(SUM(total_commission), 0) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND commission_status = 'PAID'
            ),
            pending_commission = (
                SELECT COALESCE(SUM(total_commission), 0) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND sale_status = 'APPROVED'
            ) - (
                SELECT COALESCE(SUM(total_commission), 0) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND commission_status = 'PAID'
            ),
            updated_at = NOW()
        WHERE id = NEW.agent_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update agent stats
CREATE TRIGGER trigger_update_agent_stats
    AFTER UPDATE ON agent_sales
    FOR EACH ROW
    EXECUTE FUNCTION update_agent_stats();

-- Insert sample agent data
INSERT INTO users (id, email, password, full_name, role, is_active, created_at, updated_at) 
VALUES (
    gen_random_uuid(),
    'agent1@techprocessing.com',
    '$2a$12$UbxOCyX9qJpGnC8LPZCJJOQUqvwYXFOllSuDL78eGVxQMJPKkJgN2',
    'John Agent',
    'AGENT',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO agents (user_id, agent_code, sales_person_name, closer_name, agent_commission_rate, closer_commission_rate, is_active, created_at, updated_at) 
VALUES (
    (SELECT id FROM users WHERE email = 'agent1@techprocessing.com'),
    'AG001',
    'John Agent',
    'John Agent',
    6.00,
    10.00,
    true,
    NOW(),
    NOW()
) ON CONFLICT (agent_code) DO NOTHING;

-- Print success message
DO $$
BEGIN
    RAISE NOTICE 'Agent system tables created successfully!';
    RAISE NOTICE 'Sample agent created: agent1@techprocessing.com / agent123';
END $$;
