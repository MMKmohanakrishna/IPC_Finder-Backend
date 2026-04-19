/**
 * Quick Test Script for Hybrid AI + Rules System
 * 
 * Run with: node quickTest.js
 */

const http = require('http');

// Test cases
const tests = [
  {
    name: 'Spelling Correction - Theft',
    input: 'My phone got thrift',
    expect: 'IPC 379'
  },
  {
    name: 'Murder Case',
    input: 'He shot my brother dead',
    expect: 'IPC 302'
  },
  {
    name: 'Eve Teasing',
    input: 'Some boys made dirty comments about my body',
    expect: 'IPC 509'
  },
  {
    name: 'Dowry Harassment',
    input: 'My husband and in-laws are torturing me for dowry',
    expect: 'IPC 498A'
  },
  {
    name: 'Evidence Tampering',
    input: 'After accident he hid the vehicle and removed number plate',
    expect: 'IPC 201'
  }
];

// Function to call API
function testCase(testData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ text: testData.input });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/classify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  HYBRID AI + RULES SYSTEM - QUICK TEST    ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`Input: "${test.input}"`);
      
      const result = await testCase(test);
      
      if (!result.success) {
        console.log(`❌ FAILED: API returned error`);
        console.log(`   Error: ${result.error || result.message}\n`);
        failed++;
        continue;
      }
      
      const matchedCodes = result.sections.map(s => s.code);
      const hasExpected = matchedCodes.includes(test.expect);
      
      if (hasExpected) {
        console.log(`✅ PASSED`);
        console.log(`   Expected: ${test.expect} ✓`);
        console.log(`   Got: ${matchedCodes.join(', ')}`);
        console.log(`   Confidence: ${result.sections[0]?.matchInfo?.confidence || 'N/A'}`);
        console.log(`   Reasoning: ${result.sections[0]?.matchInfo?.reasoning || 'N/A'}\n`);
        passed++;
      } else {
        console.log(`❌ FAILED`);
        console.log(`   Expected: ${test.expect}`);
        console.log(`   Got: ${matchedCodes.join(', ')}\n`);
        failed++;
      }
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}\n`);
      failed++;
    }
  }
  
  console.log('═══════════════════════════════════════════');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════════\n');
  
  process.exit(failed === 0 ? 0 : 1);
}

// Run tests
runTests();
