-- Grant permissions to techprocessing-user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "techprocessing-user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "techprocessing-user";
GRANT USAGE ON SCHEMA public TO "techprocessing-user";

-- Also grant future permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "techprocessing-user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "techprocessing-user";

-- Specifically grant on the users table
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO "techprocessing-user";

-- Show current permissions
\dp users;
