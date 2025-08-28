import bcrypt from 'bcryptjs';

async function verifyAdminUser() {
    const testPassword = 'admin123';
    
    console.log('=== ADMIN USER VERIFICATION ===');
    console.log('Testing password:', testPassword);
    console.log('');
    
    console.log('=== SQL Queries to Debug Login Issue ===');
    console.log('');
    
    console.log('1. Check if admin user exists (exact case):');
    console.log("SELECT id, email, full_name, role, is_active, created_at FROM users WHERE email = 'admin@techprocessing.com';");
    console.log('');
    
    console.log('2. Check if admin user exists (case insensitive):');
    console.log("SELECT id, email, full_name, role, is_active, created_at FROM users WHERE LOWER(email) = 'admin@techprocessing.com';");
    console.log('');
    
    console.log('3. Check the password hash in database:');
    console.log("SELECT email, password, length(password) as password_length FROM users WHERE email = 'admin@techprocessing.com';");
    console.log('');
    
    console.log('4. Check all users in the system:');
    console.log("SELECT id, email, role, is_active FROM users ORDER BY created_at DESC;");
    console.log('');
    
    console.log('5. Check if there are any users with similar emails:');
    console.log("SELECT email FROM users WHERE email ILIKE '%admin%';");
    console.log('');
    
    // Generate multiple test hashes to compare
    console.log('=== TEST PASSWORD HASHES ===');
    for (let i = 0; i < 3; i++) {
        const hash = await bcrypt.hash(testPassword, 12);
        console.log(`Hash ${i + 1}: ${hash}`);
    }
    console.log('');
    
    console.log('=== MANUAL PASSWORD VERIFICATION ===');
    console.log('Copy the password hash from the database query above, then test it with:');
    console.log('');
    console.log('const bcrypt = require("bcryptjs");');
    console.log('const dbHash = "PASTE_HASH_FROM_DATABASE_HERE";');
    console.log('const password = "admin123";');
    console.log('bcrypt.compare(password, dbHash).then(result => console.log("Password match:", result));');
    console.log('');
    
    console.log('=== IF USER DOESNT EXIST, CREATE WITH NEW HASH ===');
    const newHash = await bcrypt.hash(testPassword, 12);
    console.log(`-- Delete existing admin user if any:`);
    console.log("DELETE FROM users WHERE email = 'admin@techprocessing.com';");
    console.log('');
    console.log(`-- Insert fresh admin user:`);
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
);`);
    
    console.log('');
    console.log('=== LOGIN TEST PAYLOAD ===');
    console.log('Use this exact JSON payload to test login:');
    console.log(JSON.stringify({
        email: "admin@techprocessing.com",
        password: "admin123"
    }, null, 2));
}

verifyAdminUser().catch(console.error);
