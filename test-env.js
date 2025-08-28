import https from 'https';

// Test environment variables
const testEnv = async () => {
  const url = 'https://techprocessing-backend-320817886283.northamerica-northeast2.run.app/api/health';
  
  console.log('Testing environment variables...');
  console.log('URL:', url);
  
  const options = {
    hostname: 'techprocessing-backend-320817886283.northamerica-northeast2.run.app',
    port: 443,
    path: '/api/health',
    method: 'GET',
    headers: {
      'Origin': 'https://qamarshahid.github.io'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log('Status:', res.statusCode);
      console.log('Headers:', res.headers);
      
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

// Run test
(async () => {
  try {
    await testEnv();
  } catch (error) {
    console.error('Test failed:', error);
  }
})();
