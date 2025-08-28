import https from 'https';

// Test the backend CORS configuration
const testCors = async () => {
  const url = 'https://techprocessing-backend-320817886283.northamerica-northeast2.run.app/api/health';
  
  console.log('Testing CORS configuration...');
  console.log('URL:', url);
  
  const options = {
    hostname: 'techprocessing-backend-320817886283.northamerica-northeast2.run.app',
    port: 443,
    path: '/api/health',
    method: 'GET',
    headers: {
      'Origin': 'https://qamarshahid.github.io',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'Content-Type, Authorization'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log('Status:', res.statusCode);
      console.log('Headers:', res.headers);
      
      // Check for CORS headers
      const corsOrigin = res.headers['access-control-allow-origin'];
      console.log('CORS Origin Header:', corsOrigin);
      
      if (corsOrigin) {
        console.log('✅ CORS Origin header is set:', corsOrigin);
      } else {
        console.log('❌ CORS Origin header is missing!');
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Response:', data);
        resolve({ status: res.statusCode, headers: res.headers, data });
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error);
      reject(error);
    });

    req.end();
  });
};

// Test OPTIONS request (preflight)
const testPreflight = async () => {
  const url = 'https://techprocessing-backend-320817886283.northamerica-northeast2.run.app/api/auth/login';
  
  console.log('\nTesting preflight request...');
  console.log('URL:', url);
  
  const options = {
    hostname: 'techprocessing-backend-320817886283.northamerica-northeast2.run.app',
    port: 443,
    path: '/api/auth/login',
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://qamarshahid.github.io',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Authorization'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log('Preflight Status:', res.statusCode);
      console.log('Preflight Headers:', res.headers);
      
      // Check for CORS headers in preflight
      const corsOrigin = res.headers['access-control-allow-origin'];
      console.log('Preflight CORS Origin Header:', corsOrigin);
      
      if (corsOrigin) {
        console.log('✅ Preflight CORS Origin header is set:', corsOrigin);
      } else {
        console.log('❌ Preflight CORS Origin header is missing!');
      }
      
      resolve({ status: res.statusCode, headers: res.headers });
    });

    req.on('error', (error) => {
      console.error('Preflight Error:', error);
      reject(error);
    });

    req.end();
  });
};

// Run tests
(async () => {
  try {
    await testCors();
    await testPreflight();
  } catch (error) {
    console.error('Test failed:', error);
  }
})();
