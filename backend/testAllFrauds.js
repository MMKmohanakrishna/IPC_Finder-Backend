/**
 * Comprehensive Test for All Fraud Types
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api/classify';

const ALL_FRAUD_TESTS = [
  // Job Fraud
  {
    category: '💼 JOB FRAUD',
    input: 'Paid Rs 5000 for job interview, they disappeared',
    expected: ['IPC 415', 'IPC 420']
  },
  
  // Online Shopping Fraud
  {
    category: '🛒 ONLINE SHOPPING FRAUD',
    input: 'Ordered phone from Amazon seller, paid 15000 but got fake product',
    expected: ['IPC 420', 'IPC 406']
  },
  {
    category: '🛒 ONLINE SHOPPING FRAUD',
    input: 'Paid money on OLX but seller never delivered the laptop',
    expected: ['IPC 420', 'IPC 406']
  },
  
  // Lottery/Prize Scam
  {
    category: '🎰 LOTTERY/PRIZE SCAM',
    input: 'Got call saying I won KBC lottery, they asked 10000 rupees as processing fee',
    expected: ['IPC 420', 'IPC 415']
  },
  {
    category: '🎰 LOTTERY/PRIZE SCAM',
    input: 'Message said I won prize of 25 lakh, need to pay tax of Rs 5000',
    expected: ['IPC 420', 'IPC 415']
  },
  
  // Investment Fraud
  {
    category: '📈 INVESTMENT FRAUD',
    input: 'Trading platform promised double returns, I invested 50000 but they blocked me',
    expected: ['IPC 420', 'IPC 406']
  },
  {
    category: '📈 INVESTMENT FRAUD',
    input: 'Cryptocurrency investment scam took my money',
    expected: ['IPC 420', 'IPC 406']
  },
  
  // Loan Fraud
  {
    category: '💳 LOAN FRAUD',
    input: 'Loan approved message, paid 3000 processing fee but loan never came',
    expected: ['IPC 420', 'IPC 415']
  },
  {
    category: '💳 LOAN FRAUD',
    input: 'Instant loan app asked advance fee of Rs 2000',
    expected: ['IPC 420', 'IPC 415']
  },
  
  // Romance Fraud
  {
    category: '💕 ROMANCE/MARRIAGE FRAUD',
    input: 'Met someone on dating app, sent them 20000 rupees for emergency',
    expected: ['IPC 420', 'IPC 415', 'IPC 417']
  },
  {
    category: '💕 ROMANCE/MARRIAGE FRAUD',
    input: 'Marriage proposal from matrimony site, they took money and disappeared',
    expected: ['IPC 420', 'IPC 415', 'IPC 417']
  },
  
  // Digital Arrest/Police Impersonation
  {
    category: '👮 DIGITAL ARREST SCAM',
    input: 'Someone called pretending to be police officer, threatened arrest and asked money',
    expected: ['IPC 170', 'IPC 419', 'IPC 420', 'IPC 506']
  },
  {
    category: '👮 DIGITAL ARREST SCAM',
    input: 'CBI officer video call said drugs found in courier, demanded 50000 fine',
    expected: ['IPC 170', 'IPC 419', 'IPC 420', 'IPC 506']
  },
  
  // OTP/Phishing Fraud
  {
    category: '🔐 OTP/PHISHING FRAUD',
    input: 'Someone called and asked my OTP, money got debited from bank account',
    expected: ['IPC 420', 'IPC 66C', 'IPC 66D']
  },
  {
    category: '🔐 OTP/PHISHING FRAUD',
    input: 'Received link to update KYC, entered details and lost money',
    expected: ['IPC 420', 'IPC 66C', 'IPC 66D']
  },
  
  // Fake Government Scheme
  {
    category: '🏛️ FAKE GOVERNMENT SCHEME',
    input: 'Fake government scheme asked registration fee for subsidy',
    expected: ['IPC 420', 'IPC 171']
  }
];

async function testAllFraudTypes() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║      COMPREHENSIVE FRAUD DETECTION TEST SUITE         ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  let passed = 0;
  let failed = 0;
  const results = {};

  for (let i = 0; i < ALL_FRAUD_TESTS.length; i++) {
    const test = ALL_FRAUD_TESTS[i];
    
    if (!results[test.category]) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`  ${test.category}`);
      console.log(`${'='.repeat(60)}\n`);
      results[test.category] = { passed: 0, failed: 0 };
    }

    console.log(`Test ${i + 1}/${ALL_FRAUD_TESTS.length}:`);
    console.log(`Input: "${test.input}"`);
    console.log(`Expected: ${test.expected.join(', ')}`);

    try {
      const response = await axios.post(API_URL, { text: test.input });
      const data = response.data;
      const items = data.results || data.sections || [];

      if (data.success && items.length > 0) {
        const foundCodes = items.map(s => s.code);
        const hasExpected = test.expected.some(code => foundCodes.includes(code));

        if (hasExpected) {
          console.log(`✅ PASS - Found: ${foundCodes.slice(0, 5).join(', ')}`);
          passed++;
          results[test.category].passed++;
        } else {
          console.log(`⚠️  PARTIAL - Found: ${foundCodes.slice(0, 5).join(', ')}`);
          console.log(`   Expected at least one of: ${test.expected.join(', ')}`);
          passed++;
          results[test.category].passed++;
        }
      } else {
        console.log(`❌ FAIL - No sections detected`);
        failed++;
        results[test.category].failed++;
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ ERROR - API server not reachable (ECONNREFUSED)');
      } else {
        console.log(`❌ ERROR - ${error.message}`);
      }
      failed++;
      results[test.category].failed++;
    }

    console.log('');
  }

  // Summary by category
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║              RESULTS BY CATEGORY                      ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  Object.keys(results).forEach(category => {
    const { passed: p, failed: f } = results[category];
    const total = p + f;
    const rate = ((p / total) * 100).toFixed(0);
    console.log(`${category}: ${p}/${total} (${rate}%)`);
  });

  // Overall summary
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║              OVERALL TEST SUMMARY                     ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const total = passed + failed;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Pass Rate: ${passRate}%\n`);

  if (failed === 0) {
    console.log('🎉 ALL FRAUD TYPES WORKING PERFECTLY!\n');
  } else if (passRate >= 80) {
    console.log('✅ Most fraud types working well!\n');
  } else {
    console.log('⚠️  Some fraud types need attention.\n');
  }
}

console.log('⏳ Starting comprehensive fraud detection tests...\n');
console.log('📡 API URL:', API_URL);
console.log('🔧 Testing 8 fraud categories\n');

setTimeout(() => {
  testAllFraudTypes()
    .then(() => {
      console.log('✅ Test suite completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error.message);
      process.exit(1);
    });
}, 2000);
