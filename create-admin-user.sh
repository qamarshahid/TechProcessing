#!/bin/bash

# Script to run SQL queries against Cloud SQL via psql
echo "🔐 Getting database password from Secret Manager..."
DB_PASSWORD=$(gcloud secrets versions access latest --secret="db-password" --project=techprocessing)

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ Failed to retrieve database password from Secret Manager"
    exit 1
fi

echo "✅ Password retrieved successfully"

# Set variables
PROJECT_ID="techprocessing"
INSTANCE_NAME="techprocessing-db"
DB_USER="techprocessing-user"
DB_NAME="techprocessing"
DB_HOST="34.130.72.136"

echo "📋 Creating admin user in database..."

# Run the SQL query to insert admin user
PGPASSWORD="$DB_PASSWORD" psql -h $DB_HOST -p 5432 -U $DB_USER -d $DB_NAME -c "
INSERT INTO users (
    id,
    email,
    password,
    full_name,
    role,
    company_name,
    is_active,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'admin@techprocessing.com',
    '\$2b\$12\$aNIKi0kZL5x8ogdyubk.0O8Au6jHcKvjCFS7n4Ra9YQjiKvGIRzni',
    'System Administrator',
    'ADMIN',
    'TechProcessing',
    true,
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = now();
"

if [ $? -eq 0 ]; then
    echo "✅ Admin user created/updated successfully!"
    echo ""
    echo "🔑 Login credentials:"
    echo "Email: admin@techprocessing.com"
    echo "Password: admin123"
    echo ""
    echo "🔍 Verifying user was created..."
    
    # Verify the user was created
    PGPASSWORD="$DB_PASSWORD" psql -h $DB_HOST -p 5432 -U $DB_USER -d $DB_NAME -c "
    SELECT id, email, full_name, role, is_active, created_at 
    FROM users 
    WHERE email = 'admin@techprocessing.com';
    "
else
    echo "❌ Failed to create admin user"
    exit 1
fi
