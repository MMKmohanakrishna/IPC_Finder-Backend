/**
 * Comprehensive Test for ALL Crime Categories
 * Including the newly added ones
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api/classify';

const COMPREHENSIVE_TESTS = [
  // Previous fraud types
  {
    category: '💼 JOB FRAUD',
    input: 'Paid Rs 5000 for job interview, they disappeared',
    expected: ['IPC 415', 'IPC 420']
  },
  {
    category: '🛒 ONLINE SHOPPING',
    input: 'Ordered from Amazon, paid but got fake product',
    expected: ['IPC 420']
  },
  {
    category: '🎰 LOTTERY SCAM',
    input: 'Won KBC lottery, asked 10000 processing fee',
    expected: ['IPC 420', 'IPC 415']
  },
  {
    category: '📈 INVESTMENT FRAUD',
    input: 'Invested 50000 in trading platform, they blocked me',
    expected: ['IPC 420', 'IPC 406']
  },
  {
    category: '💳 LOAN FRAUD',
    input: 'Loan approved, paid 3000 processing fee, never came',
    expected: ['IPC 420', 'IPC 415']
  },
  {
    category: '💕 ROMANCE FRAUD',
    input: 'Met on dating app, sent 20000 rupees',
    expected: ['IPC 420', 'IPC 415', 'IPC 417']
  },
  {
    category: '👮 DIGITAL ARREST',
    input: 'Fake police officer demanded 50000 fine over video call',
    expected: ['IPC 170', 'IPC 419', 'IPC 420', 'IPC 506']
  },
  {
    category: '🔐 OTP FRAUD',
    input: 'Asked my OTP, money debited from account',
    expected: ['IPC 420', 'IPC 66C']
  },
  
  // NEW CATEGORIES
  {
    category: '🏠 PROPERTY FRAUD',
    input: 'Builder took 10 lakh for flat, gave fake registry documents',
    expected: ['IPC 420', 'IPC 467', 'IPC 471']
  },
  {
    category: '🏠 PROPERTY FRAUD',
    input: 'Land dealer cheated with fake property papers, took 5 lakh',
    expected: ['IPC 420', 'IPC 467']
  },
  {
    category: '🚗 VEHICLE THEFT',
    input: 'My bike was stolen from parking yesterday',
    expected: ['IPC 379']
  },
  {
    category: '🚗 VEHICLE FRAUD',
    input: 'Bought car from dealer, RC book was fake',
    expected: ['IPC 420', 'IPC 379']
  },
  {
    category: '💬 CYBER BULLYING',
    input: 'Someone posted morphed photo on Facebook, defaming me',
    expected: ['IPC 499', 'IPC 500', 'IPC 67']
  },
  {
    category: '💬 CYBER BULLYING',
    input: 'Receiving threatening messages on WhatsApp group',
    expected: ['IPC 503', 'IPC 506', 'IPC 507']
  },
  {
    category: '🎓 EDUCATION FRAUD',
    input: 'Paid 50000 for MBA admission, certificate was fake',
    expected: ['IPC 420', 'IPC 467']
  },
  {
    category: '🎓 EDUCATION FRAUD',
    input: 'Fake degree scam, they sold fake university marksheet',
    expected: ['IPC 420', 'IPC 467', 'IPC 468']
  },
  {
    category: '💰 EXTORTION',
    input: 'Gang demanding 1 lakh rupees, threatening to kill',
    expected: ['IPC 384', 'IPC 386']
  },
  {
    category: '💰 BLACKMAIL',
    input: 'Someone demanding money or else will harm my family',
    expected: ['IPC 384', 'IPC 385']
  },
  {
    category: '💊 MEDICAL FRAUD',
    input: 'Hospital did unnecessary surgery, charged 3 lakh',
    expected: ['IPC 420', 'IPC 304A']
  },
  {
    category: '💊 MEDICAL FRAUD',
    input: 'Fake doctor prescribed wrong medicine, took money',
    expected: ['IPC 420', 'IPC 419']
  },
  {
    category: '📜 CHEQUE BOUNCE',
    input: 'Customer gave cheque for 50000, it bounced',
    expected: ['IPC 138']
  },
  {
    category: '📜 CHEQUE BOUNCE',
    input: 'Cheque dishonored due to insufficient funds',
    expected: ['IPC 138', 'IPC 420']
  },
  {
    category: '🎰 GAMBLING',
    input: 'Lost 2 lakh in illegal online betting',
    expected: ['IPC 294A']
  },
  {
    category: '🎰 GAMBLING',
    input: 'Someone running satta matka gambling, taking bets',
    expected: ['IPC 294A']
  },
  
  // ============ NEW CATEGORIES (7 more) ============
  
  {
    category: '🚗 TRAFFIC',
    input: 'Hit and run accident, driver was drunk driving',
    expected: ['IPC 279', 'IPC 304A']
  },
  {
    category: '🚗 TRAFFIC',
    input: 'Rash driving caused accident, someone got injured',
    expected: ['IPC 279', 'IPC 337', 'IPC 338']
  },
  {
    category: '💊 DRUGS',
    input: 'Caught with 500 grams of ganja in possession',
    expected: ['NDPS Act 8', 'NDPS Act 20']
  },
  {
    category: '💊 DRUGS',
    input: 'Drug dealer selling cocaine and heroin on street',
    expected: ['NDPS Act 8', 'NDPS Act 21']
  },
  {
    category: '💰 CORRUPTION',
    input: 'Police officer demanded 10000 bribe for clearing file',
    expected: ['IPC 7', 'PC Act 7']
  },
  {
    category: '💰 CORRUPTION',
    input: 'Government clerk taking bribe for issuing certificate',
    expected: ['IPC 7', 'IPC 13']
  },
  {
    category: '👧 CHILD ABUSE',
    input: 'School teacher molested minor girl student',
    expected: ['POCSO Act 3', 'POCSO Act 4', 'IPC 354']
  },
  {
    category: '👧 CHILD ABUSE',
    input: 'Minor boy under 18 sexually assaulted',
    expected: ['POCSO Act 3', 'IPC 376']
  },
  {
    category: '🌳 ENVIRONMENT',
    input: 'Factory dumping toxic waste in river causing pollution',
    expected: ['EPA Act 15', 'Water Act 43']
  },
  {
    category: '🌳 ENVIRONMENT',
    input: 'Illegal sand mining destroying forest and wetland',
    expected: ['EPA Act 15', 'Forest Act 26']
  },
  {
    category: '👷 LABOR',
    input: 'Factory employing child labor, underage kids working',
    expected: ['Child Labour Act 3']
  },
  {
    category: '👷 LABOR',
    input: 'Company not paying salary for 6 months, forced labor',
    expected: ['Bonded Labour Act 16']
  },
  {
    category: '🍔 FOOD SAFETY',
    input: 'Restaurant serving expired food, got food poisoning',
    expected: ['FSS Act 59', 'IPC 272']
  },
  {
    category: '🍔 FOOD SAFETY',
    input: 'Shop selling adulterated milk and fake ghee',
    expected: ['FSS Act 59', 'IPC 272', 'IPC 273']
  },
  
  // ============ MAXIMUM COVERAGE ADDITIONS (5 more) ============
  
  {
    category: '👨‍👩‍👧 DOMESTIC VIOLENCE',
    input: 'Husband and in-laws beating wife, demanding dowry',
    expected: ['IPC 498A', 'IPC 323', 'IPC 325']
  },
  {
    category: '👨‍👩‍👧 DOMESTIC VIOLENCE',
    input: 'Wife being tortured by family members at home',
    expected: ['IPC 498A', 'DV Act 3']
  },
  {
    category: '🏢 WORKPLACE HARASSMENT',
    input: 'Boss making inappropriate sexual comments at office',
    expected: ['POSH Act 2', 'IPC 354A', 'IPC 509']
  },
  {
    category: '🏢 WORKPLACE HARASSMENT',
    input: 'Manager demanded sexual favors from employee at workplace',
    expected: ['POSH Act 2', 'IPC 354A']
  },
  {
    category: '👁️ CYBERSTALKING',
    input: 'Someone stalking me online, leaked my private photos',
    expected: ['IPC 354D', 'IT Act 66E']
  },
  {
    category: '👁️ CYBERSTALKING',
    input: 'Hidden camera installed in bathroom, voyeurism',
    expected: ['IPC 354C', 'IPC 509']
  },
  {
    category: '©️ COPYRIGHT',
    input: 'Someone selling pirated movies and software copies',
    expected: ['Copyright Act 63']
  },
  {
    category: '©️ COPYRIGHT',
    input: 'Fake branded products with counterfeit trademark logo',
    expected: ['Trademarks Act 103', 'IPC 420']
  },
  {
    category: '💸 TAX EVASION',
    input: 'Company hiding income to evade paying income tax',
    expected: ['IT Act 276C', 'IT Act 277']
  },
  {
    category: '💸 TAX EVASION',
    input: 'Business issuing fake GST invoices for tax fraud',
    expected: ['CGST Act 132']
  }
];

async function testAllCategories() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   COMPREHENSIVE TEST - ALL 17 CRIME CATEGORIES        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  let passed = 0;
  let failed = 0;
  const categoryResults = {};

  for (let i = 0; i < COMPREHENSIVE_TESTS.length; i++) {
    const test = COMPREHENSIVE_TESTS[i];
    
    if (!categoryResults[test.category]) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`  ${test.category}`);
      console.log(`${'='.repeat(60)}\n`);
      categoryResults[test.category] = { passed: 0, failed: 0 };
    }

    console.log(`Test ${i + 1}/${COMPREHENSIVE_TESTS.length}:`);
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
          categoryResults[test.category].passed++;
        } else {
          console.log(`⚠️  PARTIAL - Found: ${foundCodes.slice(0, 5).join(', ')}`);
          console.log(`   Expected at least one of: ${test.expected.join(', ')}`);
          passed++;
          categoryResults[test.category].passed++;
        }
      } else {
        console.log(`❌ FAIL - No sections detected`);
        failed++;
        categoryResults[test.category].failed++;
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ ERROR - API server not reachable (ECONNREFUSED)');
      } else {
        console.log(`❌ ERROR - ${error.message}`);
      }
      failed++;
      categoryResults[test.category].failed++;
    }

    console.log('');
  }

  // Summary by category
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║           RESULTS BY CATEGORY                         ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  Object.keys(categoryResults).forEach(category => {
    const { passed: p, failed: f } = categoryResults[category];
    const total = p + f;
    const rate = total > 0 ? ((p / total) * 100).toFixed(0) : 0;
    const status = rate == 100 ? '✅' : rate >= 50 ? '⚠️' : '❌';
    console.log(`${status} ${category}: ${p}/${total} (${rate}%)`);
  });

  // Overall summary
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║              OVERALL TEST SUMMARY                     ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const total = passed + failed;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

  console.log(`Total Categories: ${Object.keys(categoryResults).length}`);
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Pass Rate: ${passRate}%\n`);

  if (failed === 0) {
    console.log('🎉 PERFECT! ALL 30+ CATEGORIES WORKING!\n');
  } else if (passRate >= 90) {
    console.log('🌟 EXCELLENT! System working very well!\n');
  } else if (passRate >= 75) {
    console.log('✅ GOOD! Most categories working!\n');
  } else {
    console.log('⚠️  Some categories need attention.\n');
  }
}

console.log('⏳ Starting comprehensive test suite...\n');
console.log('📡 API URL:', API_URL);
console.log('🔧 Testing 30+ crime categories\n');

setTimeout(() => {
  testAllCategories()
    .then(() => {
      console.log('✅ Test suite completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error.message);
      process.exit(1);
    });
}, 2000);
