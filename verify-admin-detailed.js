import bcrypt from 'bcryptjs';

async function verifyAdminUser() {
    const plainPassword = 'admin123';
    
    console.log('=== DETAILED ADMIN USER VERIFICATION ===');
    console.log('Expected password:', plainPassword);
    console.log('');
    
    console.log('=== STEP 1: Check database connection ===');
    console.log('SELECT current_database(), current_user;');
    console.log('');
    
    console.log('=== STEP 2: Check if users table exists ===');
    console.log("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name = 'users';");
    console.log('');
    
    console.log('=== STEP 3: Check all users in the database ===');
    console.log('SELECT id, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC;');
    console.log('');
    
    console.log('=== STEP 4: Check admin user specifically ===');
    console.log("SELECT id, email, password, full_name, role, company_name, is_active, created_at FROM users WHERE email = 'admin@techprocessing.com';");
    console.log('');
    
    console.log('=== STEP 5: Check password hash format ===');
    console.log("SELECT email, LENGTH(password) as password_length, SUBSTR(password, 1, 10) as password_prefix FROM users WHERE email = 'admin@techprocessing.com';");
    console.log('');
    
    // Generate a fresh hash for comparison
    const newHash = await bcrypt.hash(plainPassword, 12);
    console.log('=== STEP 6: Fresh bcrypt hash for comparison ===');
    console.log('New hash:', newHash);
    console.log('Hash length:', newHash.length);
    console.log('Hash starts with $2b$12$:', newHash.startsWith('$2b$12$'));
    console.log('');
    
    console.log('=== STEP 7: If user exists but login fails, try updating password ===');
    console.log(`UPDATE users SET password = '${newHash}', updated_at = now() WHERE email = 'admin@techprocessing.com';`);
    console.log('');
    
    console.log('=== STEP 8: If user does not exist, create it ===');
    console.log(`-- First, check if uuid_generate_v4() function exists:`);
    console.log('SELECT uuid_generate_v4();');
    console.log('');
    console.log('-- If it fails, create the extension:');
    console.log('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('');
    console.log('-- Then insert the user:');
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
    '${newHash}',
    'System Administrator',
    'ADMIN',
    'TechProcessing',
    true,
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    updated_at = now();`);
    console.log('');
    
    console.log('=== STEP 9: Verify the user after changes ===');
    console.log("SELECT id, email, role, is_active, LENGTH(password) as pwd_len FROM users WHERE email = 'admin@techprocessing.com';");
    console.log('');
    
    console.log('=== STEP 10: Test login credentials ===');
    console.log('Use these credentials to test login:');
    console.log('Email: admin@techprocessing.com');
    console.log('Password: admin123');
    console.log('');
    
    console.log('=== STEP 11: Check auth service logs ===');
    console.log('If login still fails, check the backend logs for more details:');
    console.log('gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=techprocessing-backend" --limit=50 --format="table(timestamp,textPayload)" --freshness=1h');
    
    // Test hash verification
    const testHashes = [
        '$2b$12$abcdefghijklmnopqrstuvwxyz1234567890',  // Example hash
        newHash
    ];
    
    console.log('');
    console.log('=== HASH VERIFICATION TESTS ===');
    for (const hash of testHashes) {
        try {
            const isValid = await bcrypt.compare(plainPassword, hash);
            console.log(`Hash: ${hash.substring(0, 20)}... Valid: ${isValid}`);
        } catch (error) {
            console.log(`Hash: ${hash.substring(0, 20)}... Error: ${error.message}`);
        }
    }
}

verifyAdminUser().catch(console.error);
