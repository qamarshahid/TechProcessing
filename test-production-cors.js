import https from 'https';

// Test production CORS configuration
const testProductionCORS = async () => {
  const baseURL = 'https://techprocessing-backend-xg75robkba-pd.a.run.app';
  const endpoints = ['/api/health', '/api/auth/login'];

  console.log('🧪 Testing Production CORS Configuration');
  console.log('='.repeat(50));

  for (const endpoint of endpoints) {
    const url = baseURL + endpoint;
    console.log(`\n📡 Testing endpoint: ${endpoint}`);

    try {
      // Test OPTIONS request (preflight)
      console.log('🔄 Testing preflight request...');
      const preflightResponse = await testPreflight(url);
      console.log(`   Status: ${preflightResponse.status}`);
      console.log(`   CORS Origin: ${preflightResponse.corsOrigin || '❌ Missing'}`);
      console.log(`   Allow Methods: ${preflightResponse.allowMethods || '❌ Missing'}`);
      console.log(`   Allow Headers: ${preflightResponse.allowHeaders || '❌ Missing'}`);
      console.log(`   Allow Credentials: ${preflightResponse.allowCredentials || '❌ Missing'}`);

      // Test actual GET request
      if (endpoint === '/api/health') {
        console.log('📊 Testing actual request...');
        const actualResponse = await testActualRequest(url);
        console.log(`   Status: ${actualResponse.status}`);
        console.log(`   CORS Origin: ${actualResponse.corsOrigin || '❌ Missing'}`);
        if (actualResponse.data) {
          console.log(`   Response: ${JSON.stringify(actualResponse.data)}`);
        }
      }

    } catch (error) {
      console.error(`❌ Error testing ${endpoint}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📋 Next steps:');
  console.log('1. Update your frontend .env.production file:');
  console.log('   VITE_API_URL=https://techprocessing-backend-xg75robkba-pd.a.run.app/api');
  console.log('2. Deploy your frontend to GitHub Pages');
  console.log('3. Test the login functionality');
};

const testPreflight = (url) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://qamarshahid.github.io',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
        'User-Agent': 'Mozilla/5.0 (CORS Test)'
      }
    };

    const req = https.request(options, (res) => {
      resolve({
        status: res.statusCode,
        corsOrigin: res.headers['access-control-allow-origin'],
        allowMethods: res.headers['access-control-allow-methods'],
        allowHeaders: res.headers['access-control-allow-headers'],
        allowCredentials: res.headers['access-control-allow-credentials']
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
};

const testActualRequest = (url) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Origin': 'https://qamarshahid.github.io',
        'User-Agent': 'Mozilla/5.0 (CORS Test)'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            corsOrigin: res.headers['access-control-allow-origin'],
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            corsOrigin: res.headers['access-control-allow-origin'],
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
};

// Run the test
testProductionCORS().catch(console.error);
