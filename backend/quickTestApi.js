/**
 * Quick inline test for the API
 */

const axios = require('axios');

async function quickTest() {
  try {
    console.log('Testing POST /api/classify...\n');
    
    const response = await axios.post('http://localhost:3000/api/classify', {
      text: 'My phone got thrift'
    });
    
    console.log('✅ Success!');
    console.log('Count:', response.data.count);
    console.log('Normalized:', response.data.input.normalized);
    console.log('\nResults:');
    response.data.results.forEach(s => {
      console.log(`  - ${s.code}: ${s.name}`);
      console.log(`    ${s.purpose}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (!error.response) {
      console.log('\n💡 Make sure server is running: node apiServer.js');
    }
  }
}

quickTest();
