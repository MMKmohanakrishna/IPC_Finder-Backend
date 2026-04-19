// Simple API test
const http = require('http');

const API_PORT = Number(process.env.API_PORT || 5000);

const testData = JSON.stringify({ text: 'My phone got thrift' });

const options = {
  hostname: 'localhost',
  port: API_PORT,
  path: '/api/classify',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

console.log('Testing API: POST /api/classify');
console.log('Input: "My phone got thrift"\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      const items = result.results || result.sections || [];
      console.log('✅ API Response:\n');
      console.log(JSON.stringify(result, null, 2));
      
      if (result.success && items.length > 0) {
        console.log('\n✅ TEST PASSED!');
        console.log(`Found ${items.length} sections:`);
        items.forEach(s => {
          console.log(`  - ${s.code}: ${s.name}`);
        });
      } else {
        console.log('\n❌ TEST FAILED: No sections found');
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.error('Hint: start API server with `npm start` or set API_PORT/API_URL as needed.');
  }
});

req.write(testData);
req.end();
