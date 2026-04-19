/**
 * ================================================
 * TEST CLIENT - POST /api/classify
 * ================================================
 * 
 * Tests the classify endpoint with various inputs
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api/classify';

// Test cases
const testCases = [
  {
    name: 'Theft case',
    text: 'My phone got thrift'
  },
  {
    name: 'Fraud with money',
    text: 'I paid rs 5000 in fake lottery scm'
  },
  {
    name: 'Threat case',
    text: 'He threaten to kil me'
  },
  {
    name: 'Assault case',
    text: 'Boys hert me and pushed me'
  },
  {
    name: 'Multiple crimes',
    text: 'He beat me and stolen my money'
  },
  {
    name: 'No match',
    text: 'I want to file a complaint'
  }
];

// Test function
async function testEndpoint() {
  console.log('='.repeat(70));
  console.log('TESTING POST /api/classify ENDPOINT');
  console.log('='.repeat(70));
  console.log();
  
  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    
    console.log(`Test ${i + 1}: ${test.name}`);
    console.log('-'.repeat(70));
    console.log(`Input: "${test.text}"`);
    
    try {
      const response = await axios.post(API_URL, {
        text: test.text
      });
      
      const data = response.data;
      const items = data.results || data.sections || [];
      
      console.log(`Status: ✅ ${response.status}`);
      console.log(`Success: ${data.success}`);
      console.log(`Count: ${data.count}`);
      
      if (data.input) {
        console.log(`Normalized: "${data.input.normalized}"`);
        console.log(`Matched codes: [${data.input.matchedCodes?.join(', ')}]`);
      }
      
      if (items.length > 0) {
        console.log(`\nResults:`);
        items.forEach(section => {
          console.log(`  - ${section.code}: ${section.name}`);
          console.log(`    Purpose: ${section.purpose}`);
          console.log(`    Punishment: ${section.punishment}`);
          console.log(`    FIR: ${section.firPossible}`);
        });
      } else {
        console.log(`Message: ${data.message}`);
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`Status: ❌ ${error.response.status}`);
        console.log(`Error: ${error.response.data.message}`);
      } else if (error.code === 'ECONNREFUSED') {
        console.log('Error: Could not connect to API server (connection refused).');
        console.log('Hint: Start the backend with `npm start` or set API_URL.');
      } else {
        console.log(`Error: ${error.message}`);
      }
    }
    
    console.log();
  }
  
  console.log('='.repeat(70));
  console.log('✅ ALL TESTS COMPLETE');
  console.log('='.repeat(70));
}

// Run tests
testEndpoint().catch(error => {
  console.error('❌ Test failed:', error.message);
  console.log('\n💡 Make sure the server is running:');
  console.log('   node apiServer.js');
});
