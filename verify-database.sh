#!/bin/bash

echo "=== CONNECTING TO CLOUD SQL DATABASE ==="
echo "Host: 34.82.95.104"
echo "Database: techprocessing"
echo "User: postgres"
echo ""

# Set connection parameters
export PGHOST=34.82.95.104
export PGDATABASE=techprocessing
export PGUSER=postgres
export PGPASSWORD=$(gcloud secrets versions access latest --secret="db-password")

echo "Password retrieved from Google Secret Manager"
echo ""

echo "=== RUNNING VERIFICATION QUERIES ==="

# Create a temp SQL file with all our queries
cat > /tmp/verify_queries.sql << 'EOF'
-- Step 1: Check database connection
SELECT 'DATABASE CONNECTION:' as step, current_database() as database, current_user as user;

-- Step 2: Check if users table exists
SELECT 'USERS TABLE EXISTS:' as step, table_schema, table_name 
FROM information_schema.tables 
WHERE table_name = 'users';

-- Step 3: Check all users in the database
SELECT 'ALL USERS:' as step, id, email, full_name, role, is_active, created_at 
FROM users 
ORDER BY created_at DESC;

-- Step 4: Check admin user specifically
SELECT 'ADMIN USER DETAILS:' as step, id, email, password, full_name, role, company_name, is_active, created_at 
FROM users 
WHERE email = 'admin@techprocessing.com';

-- Step 5: Check password hash format
SELECT 'PASSWORD HASH FORMAT:' as step, email, LENGTH(password) as password_length, SUBSTR(password, 1, 20) as password_prefix 
FROM users 
WHERE email = 'admin@techprocessing.com';

-- Step 6: Check if UUID extension exists
SELECT 'UUID EXTENSION:' as step, extname 
FROM pg_extension 
WHERE extname = 'uuid-ossp';
EOF

# Run the queries
echo "Running verification queries..."
psql -f /tmp/verify_queries.sql

# Clean up
rm /tmp/verify_queries.sql

echo ""
echo "=== VERIFICATION COMPLETE ==="
