-- Temporarily disable RLS to see data and debug the issue

-- 1. First, let's see the current data
SELECT 'Current service requests:' as info;
SELECT id, client_id, description, status, request_number, created_at 
FROM service_requests 
ORDER BY created_at DESC;

-- 2. Check what users exist
SELECT 'Current users:' as info;
SELECT id, email, role, full_name 
FROM users 
WHERE role IN ('CLIENT', 'ADMIN')
ORDER BY role, email;

-- 3. Temporarily disable RLS to allow data to show
ALTER TABLE service_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE price_adjustments DISABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments DISABLE ROW LEVEL SECURITY;

SELECT 'RLS disabled - data should now be visible in the frontend' as status;
