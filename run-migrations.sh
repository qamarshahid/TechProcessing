#!/bin/bash

# Script to run database migrations on Cloud SQL
echo "📊 Running database migrations on Cloud SQL..."

# Set variables
PROJECT_ID="techprocessing"
INSTANCE_NAME="techprocessing-db"
DB_USER="techprocessing-user"
DB_NAME="techprocessing"

# Get the database password from Secret Manager
echo "🔐 Getting database password from Secret Manager..."
DB_PASSWORD=$(gcloud secrets versions access latest --secret="db-password" --project=$PROJECT_ID)

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ Failed to retrieve database password from Secret Manager"
    exit 1
fi

echo "✅ Password retrieved successfully"

# Run each migration file
echo "🚀 Running migrations..."

# Main schema migration
echo "📋 Running main schema migration..."
PGPASSWORD="$DB_PASSWORD" psql -h 34.130.72.136 -p 5432 -U $DB_USER -d $DB_NAME -f /Users/qamarshahid/TechProcessing/supabase/migrations/20250802190149_royal_frog.sql

if [ $? -eq 0 ]; then
    echo "✅ Main schema migration completed"
else
    echo "❌ Main schema migration failed"
    exit 1
fi

# Run additional migrations
for migration_file in /Users/qamarshahid/TechProcessing/supabase/migrations/2025082*.sql; do
    if [ -f "$migration_file" ]; then
        echo "📋 Running migration: $(basename $migration_file)"
        PGPASSWORD="$DB_PASSWORD" psql -h 34.130.72.136 -p 5432 -U $DB_USER -d $DB_NAME -f "$migration_file"
        
        if [ $? -eq 0 ]; then
            echo "✅ Migration $(basename $migration_file) completed"
        else
            echo "❌ Migration $(basename $migration_file) failed"
            exit 1
        fi
    fi
done

echo "🎉 All migrations completed successfully!"
