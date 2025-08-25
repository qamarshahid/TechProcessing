-- Add resubmission tracking fields to agent_sales table
ALTER TABLE agent_sales ADD COLUMN original_sale_id UUID REFERENCES agent_sales(id);
ALTER TABLE agent_sales ADD COLUMN changes_made JSONB;
ALTER TABLE agent_sales ADD COLUMN resubmission_count INTEGER DEFAULT 0;

-- Add index for original_sale_id for better performance
CREATE INDEX idx_agent_sales_original_sale_id ON agent_sales(original_sale_id);

-- Update the sale_status check constraint to include RESUBMITTED
ALTER TABLE agent_sales DROP CONSTRAINT agent_sales_sale_status_check;
ALTER TABLE agent_sales ADD CONSTRAINT agent_sales_sale_status_check 
CHECK (sale_status::text = ANY (ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying, 'RESUBMITTED'::character varying, 'PAID'::character varying, 'CANCELLED'::character varying]::text[]));
