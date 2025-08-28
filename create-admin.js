import bcrypt from 'bcryptjs';

async function createAdminUser() {
    // Generate bcrypt hash for a secure admin password
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    
    console.log('=== ADMIN USER CREATION ===');
    console.log('Plain password:', plainPassword);
    console.log('Bcrypt hash:', hashedPassword);
    console.log('');
    console.log('SQL Query to insert admin user:');
    console.log('');
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
    console.log('=== VERIFICATION ===');
    console.log('After running the SQL query, you can login with:');
    console.log('Email: admin@techprocessing.com');
    console.log('Password: admin123');
    
    // Test the hash verification
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Hash verification test:', isValid ? 'PASSED' : 'FAILED');
}

createAdminUser().catch(console.error);
