import { execSync } from 'child_process';

console.log('=== CHECKING ADMIN USER VIA BACKEND API ===');

// Test the current backend health
console.log('1. Testing backend health...');
try {
    const healthResponse = execSync('curl -s https://techprocessing-backend-320817886283.northamerica-northeast2.run.app/api/health', { encoding: 'utf8' });
    console.log('Health check:', healthResponse);
} catch (error) {
    console.log('Health check failed:', error.message);
}

// Test auth endpoint with invalid credentials first
console.log('\n2. Testing auth endpoint with invalid credentials...');
try {
    const authTestResponse = execSync(`curl -s -X POST https://techprocessing-backend-320817886283.northamerica-northeast2.run.app/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"wrongpassword"}'`, { encoding: 'utf8' });
    console.log('Auth test (should be 401):', authTestResponse);
} catch (error) {
    console.log('Auth test failed:', error.message);
}

// Test with admin credentials
console.log('\n3. Testing with admin credentials...');
try {
    const adminLoginResponse = execSync(`curl -s -X POST https://techprocessing-backend-320817886283.northamerica-northeast2.run.app/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@techprocessing.com","password":"admin123"}'`, { encoding: 'utf8' });
    console.log('Admin login attempt:', adminLoginResponse);
} catch (error) {
    console.log('Admin login failed:', error.message);
}

// Check if there's a users endpoint we can query
console.log('\n4. Testing users endpoint (if exists)...');
try {
    const usersResponse = execSync('curl -s https://techprocessing-backend-320817886283.northamerica-northeast2.run.app/api/users', { encoding: 'utf8' });
    console.log('Users endpoint:', usersResponse);
} catch (error) {
    console.log('Users endpoint failed:', error.message);
}

console.log('\n=== CHECKING BACKEND LOGS ===');
try {
    console.log('Fetching recent logs...');
    const logs = execSync('gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=techprocessing-backend" --limit=20 --format="table(timestamp,textPayload)" --freshness=30m', { encoding: 'utf8' });
    console.log('Recent logs:');
    console.log(logs);
} catch (error) {
    console.log('Failed to fetch logs:', error.message);
}
