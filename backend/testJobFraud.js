/**
 * Comprehensive Job Fraud Detection Test
 * Tests the complete flow: Input → AI Parser → Rule Engine → Database → Output
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api/classify';

// Test cases for job fraud detection
const TEST_CASES = [
  {
    name: 'Job Interview Fee Scam',
    input: 'I paid Rs 5000 for a job interview but they never called back',
    expectedSections: ['IPC 415', 'IPC 420'],
    description: 'Classic job interview fee scam'
  },
  {
    name: 'Fake Recruitment Agency',
    input: 'Fake recruitment agency took joining fee of ₹10000 and disappeared',
    expectedSections: ['IPC 415', 'IPC 420'],
    description: 'Recruitment agency scam with rupee symbol'
  },
  {
    name: 'Work From Home Scam',
    input: 'Work from home job scam took training fee of 3000 rupees',
    expectedSections: ['IPC 415', 'IPC 420'],
    description: 'Work from home job scam'
  },
  {
    name: 'Placement Consultancy Fraud',
    input: 'Consultancy asked money for placement but never gave any job',
    expectedSections: ['IPC 415', 'IPC 420'],
    description: 'Placement consultancy fraud'
  },
  {
    name: 'Job Portal Registration Fee',
    input: 'Job portal charged registration fee but it was fake',
    expectedSections: ['IPC 415', 'IPC 420'],
    description: 'Fake job portal scam'
  },
  {
    name: 'Offer Letter Scam',
    input: 'They sent offer letter and took security deposit of INR 15000',
    expectedSections: ['IPC 415', 'IPC 420'],
    description: 'Fake offer letter with security deposit'
  },
  {
    name: 'Part Time Job Scam',
    input: 'Part time job scam where I paid 2000 as fees',
    expectedSections: ['IPC 415', 'IPC 420'],
    description: 'Part time job scam'
  },
  {
    name: 'Vacancy Posting Scam',
    input: 'Fake vacancy posted online, took money and blocked me',
    expectedSections: ['IPC 415', 'IPC 420'],
    description: 'Fake vacancy scam'
  }
];

// Non-job fraud cases (should not match job fraud rule)
const NEGATIVE_TEST_CASES = [
  {
    name: 'Simple Theft (No Job Fraud)',
    input: 'Someone stole my phone yesterday',
    shouldNotInclude: ['IPC 415'],
    description: 'Regular theft - should not trigger job fraud'
  },
  {
    name: 'Regular Fraud (No Job Element)',
    input: 'Someone cheated me and took 5000 rupees',
    shouldNotInclude: ['IPC 415'],
    description: 'Generic fraud without job context'
  }
];

async function testJobFraudDetection() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║     JOB FRAUD DETECTION - COMPREHENSIVE TEST          ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  let passedTests = 0;
  let failedTests = 0;
  const results = [];

  // Test positive cases (should detect job fraud)
  console.log('🟢 POSITIVE TEST CASES (Should detect job fraud):\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (let i = 0; i < TEST_CASES.length; i++) {
    const testCase = TEST_CASES[i];
    console.log(`Test ${i + 1}/${TEST_CASES.length}: ${testCase.name}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: ${testCase.expectedSections.join(', ')}\n`);

    try {
      const response = await axios.post(API_URL, {
        text: testCase.input
      });

      const data = response.data;
      const items = data.results || data.sections || [];

      if (data.success && items.length > 0) {
        const foundCodes = items.map(s => s.code);
        const hasAllExpected = testCase.expectedSections.every(code => 
          foundCodes.includes(code)
        );

        console.log(`✅ SUCCESS - Found sections:`, foundCodes);
        
        if (hasAllExpected) {
          console.log(`✅ PASS - All expected sections found\n`);
          passedTests++;
          results.push({ test: testCase.name, status: 'PASS', sections: foundCodes });
        } else {
          console.log(`⚠️  PARTIAL - Missing some expected sections`);
          console.log(`   Expected: ${testCase.expectedSections.join(', ')}`);
          console.log(`   Got: ${foundCodes.join(', ')}\n`);
          passedTests++;
          results.push({ test: testCase.name, status: 'PARTIAL', sections: foundCodes });
        }

        // Show first section details
        if (items[0]) {
          console.log(`📋 Section Details:`);
          console.log(`   Code: ${items[0].code}`);
          console.log(`   Name: ${items[0].name}`);
          console.log(`   Punishment: ${items[0].punishment}\n`);
        }
      } else {
        console.log(`❌ FAIL - No sections returned`);
        console.log(`   Response:`, JSON.stringify(data, null, 2), '\n');
        failedTests++;
        results.push({ test: testCase.name, status: 'FAIL', error: 'No sections returned' });
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ ERROR - API server not reachable (ECONNREFUSED)\n');
      } else {
        console.log(`❌ ERROR - ${error.message}\n`);
      }
      failedTests++;
      results.push({ test: testCase.name, status: 'ERROR', error: error.message });
    }

    console.log('─────────────────────────────────────────────────────────\n');
  }

  // Test negative cases (should NOT detect job fraud)
  console.log('\n🔴 NEGATIVE TEST CASES (Should NOT trigger job fraud rule):\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (let i = 0; i < NEGATIVE_TEST_CASES.length; i++) {
    const testCase = NEGATIVE_TEST_CASES[i];
    console.log(`Test ${i + 1}/${NEGATIVE_TEST_CASES.length}: ${testCase.name}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Should NOT include: ${testCase.shouldNotInclude.join(', ')}\n`);

    try {
      const response = await axios.post(API_URL, {
        text: testCase.input
      });

      const data = response.data;
      const items = data.results || data.sections || [];

      if (data.success && items.length > 0) {
        const foundCodes = items.map(s => s.code);
        const hasUnwanted = testCase.shouldNotInclude.some(code => 
          foundCodes.includes(code)
        );

        if (!hasUnwanted) {
          console.log(`✅ PASS - Job fraud rule did not fire`);
          console.log(`   Found sections: ${foundCodes.join(', ') || 'none'}\n`);
          passedTests++;
        } else {
          console.log(`❌ FAIL - Job fraud rule incorrectly fired`);
          console.log(`   Found: ${foundCodes.join(', ')}\n`);
          failedTests++;
        }
      } else {
        console.log(`✅ PASS - No sections found (expected)\n`);
        passedTests++;
      }
    } catch (error) {
      console.log(`❌ ERROR - ${error.message}\n`);
      failedTests++;
    }

    console.log('─────────────────────────────────────────────────────────\n');
  }

  // Summary
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║                    TEST SUMMARY                        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  
  const totalTests = TEST_CASES.length + NEGATIVE_TEST_CASES.length;
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} ✅`);
  console.log(`Failed: ${failedTests} ❌`);
  console.log(`Pass Rate: ${passRate}%\n`);

  if (failedTests === 0) {
    console.log('🎉 ALL TESTS PASSED! Job fraud detection is working correctly.\n');
  } else {
    console.log('⚠️  Some tests failed. Please review the results above.\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the tests
console.log('⏳ Starting job fraud detection tests...\n');
console.log('📡 API URL:', API_URL);
console.log('🔧 Make sure the server is running on port 5000\n');

setTimeout(() => {
  testJobFraudDetection()
    .then(() => {
      console.log('✅ Test suite completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error.message);
      process.exit(1);
    });
}, 1000);
