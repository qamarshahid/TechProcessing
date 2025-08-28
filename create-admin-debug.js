import bcrypt from 'bcryptjs';

async function createAdminUser() {
    // Generate bcrypt hash for a secure admin password
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    
    console.log('=== ADMIN USER CREATION ===');
    console.log('Plain password:', plainPassword);
    console.log('Bcrypt hash:', hashedPassword);
    console.log('');
    
    console.log('=== DIAGNOSTIC QUERIES (Run these first) ===');
    console.log('1. Check which database you are connected to:');
    console.log('SELECT current_database();');
    console.log('');
    
    console.log('2. Check which user you are connected as:');
    console.log('SELECT current_user;');
    console.log('');
    
    console.log('3. List all tables and their schemas:');
    console.log("SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'users';");
    console.log('');
    
    console.log('4. Check if users table exists and its structure:');
    console.log("\\d users");
    console.log('');
    
    console.log('5. Check existing users in the table:');
    console.log('SELECT id, email, role, is_active FROM users LIMIT 5;');
    console.log('');
    
    console.log('=== SQL Query for POSTGRES user ===');
    console.log(`INSERT INTO users (
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
    '${hashedPassword}',
    'System Administrator',
    'ADMIN',
    'TechProcessing',
    true,
    now(),
    now()
);`);
    
    console.log('');
    console.log('=== SQL Query for TECHPROCESSING-USER ===');
    console.log('-- Make sure you are connected as techprocessing-user to database techprocessing');
    console.log(`INSERT INTO users (
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
    '${hashedPassword}',
    'System Administrator',
    'ADMIN',
    'TechProcessing',
    true,
    now(),
    now()
);`);
    
    console.log('');
    console.log('=== ALTERNATIVE: Grant permissions to postgres user ===');
    console.log('-- If you want to use postgres user, run these first:');
    console.log('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;');
    console.log('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;');
    console.log('');
    
    console.log('=== VERIFICATION ===');
    console.log('After running the SQL query, you can login with:');
    console.log('Email: admin@techprocessing.com');
    console.log('Password: admin123');
    
    // Test the hash verification
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Hash verification test:', isValid ? 'PASSED' : 'FAILED');
}

createAdminUser().catch(console.error);
