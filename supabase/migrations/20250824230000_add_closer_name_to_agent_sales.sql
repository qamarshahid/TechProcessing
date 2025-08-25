-- Add closer_name column to agent_sales table
ALTER TABLE agent_sales ADD COLUMN closer_name VARCHAR(200) NOT NULL DEFAULT '';

-- Update existing records to use agent's closer name if closer_name is empty
UPDATE agent_sales 
SET closer_name = agents.closer_name 
FROM agents 
WHERE agent_sales.agent_id = agents.id 
AND (agent_sales.closer_name = '' OR agent_sales.closer_name IS NULL);

-- Remove the default constraint after updating existing data
ALTER TABLE agent_sales ALTER COLUMN closer_name DROP DEFAULT;
