/**
 * ====================================
 * TEST CASES FOR HYBRID AI + RULES SYSTEM
 * ====================================
 * 
 * Tests cover ALL offence categories
 * Each test includes:
 * - Input text (with spelling mistakes)
 * - Expected IPC sections
 * - Category
 */

const testCases = [
  
  // ============ PROPERTY OFFENCES ============
  
  {
    category: 'Property - Simple Theft',
    input: 'My phone got thrift',
    expectedSections: ['IPC 379', 'IPC 378'],
    description: 'Spelling mistake "thrift" should be corrected to "theft"'
  },
  
  {
    category: 'Property - Theft',
    input: 'Someone stole my wallet from my pocket',
    expectedSections: ['IPC 379', 'IPC 378'],
    description: 'Pickpocketing case'
  },
  
  {
    category: 'Property - Robbery with force',
    input: 'A man attacked me and took my money',
    expectedSections: ['IPC 392', 'IPC 379'],
    description: 'Theft with force = Robbery'
  },
  
  {
    category: 'Property - Receiving stolen',
    input: 'I bought a phone but it was stolen',
    expectedSections: ['IPC 411'],
    description: 'Receiving stolen property'
  },
  
  // ============ CRIMES AGAINST PERSON ============
  
  {
    category: 'Person - Murder',
    input: 'He shot my brother dead',
    expectedSections: ['IPC 302'],
    description: 'Murder with weapon (gun)'
  },
  
  {
    category: 'Person - Attempt to murder',
    input: 'He tried to kill me with a knife but I survived',
    expectedSections: ['IPC 307'],
    description: 'Attempt to murder with weapon'
  },
  
  {
    category: 'Person - Culpable homicide',
    input: 'During a fight he pushed him and he died from hitting his head',
    expectedSections: ['IPC 304'],
    description: 'Unintentional death in fight'
  },
  
  {
    category: 'Person - Simple hurt',
    input: 'He slapped me and punched me',
    expectedSections: ['IPC 323'],
    description: 'Physical assault without weapon'
  },
  
  {
    category: 'Person - Hurt with weapon',
    input: 'He hit me with an iron rod and I got injured',
    expectedSections: ['IPC 324'],
    description: 'Hurt using dangerous weapon'
  },
  
  // ============ SEXUAL OFFENCES ============
  
  {
    category: 'Sexual - Rape',
    input: 'He forced me into sexual intercourse against my will',
    expectedSections: ['IPC 376'],
    description: 'Rape case'
  },
  
  {
    category: 'Sexual - Molestation',
    input: 'A man touched me inappropriately without my consent',
    expectedSections: ['IPC 354'],
    description: 'Molestation / Outraging modesty'
  },
  
  {
    category: 'Sexual - Eve teasing',
    input: 'Some boys made dirty comments about my body and whistled at me',
    expectedSections: ['IPC 509', 'IPC 354A'],
    description: 'Eve teasing / Sexual harassment'
  },
  
  {
    category: 'Sexual - Voyeurism',
    input: 'Someone recorded a video of me dancing with my boyfriend and sent it to my mom',
    expectedSections: ['IPC 354C'],
    description: 'Recording and sharing private video'
  },
  
  {
    category: 'Sexual - Stalking',
    input: 'A man keeps following me everywhere despite me telling him to stop',
    expectedSections: ['IPC 354D'],
    description: 'Stalking case'
  },
  
  // ============ THREAT & INTIMIDATION ============
  
  {
    category: 'Threat - Death threat',
    input: 'He threatened to kill me and my family',
    expectedSections: ['IPC 506'],
    description: 'Criminal intimidation with death threat'
  },
  
  {
    category: 'Threat - General threat',
    input: 'He said he will hurt me if I don\'t give him money',
    expectedSections: ['IPC 503', 'IPC 506'],
    description: 'Threat to extort money'
  },
  
  {
    category: 'Threat - Video blackmail',
    input: 'He has my private video and threatened to share it if I don\'t pay him',
    expectedSections: ['IPC 506', 'IPC 503', 'IPC 509'],
    description: 'Blackmail using video'
  },
  
  // ============ FRAUD & CHEATING ============
  
  {
    category: 'Fraud - Cheating',
    input: 'He took my money promising 50% returns but it was all fake',
    expectedSections: ['IPC 420'],
    description: 'Investment fraud'
  },
  
  {
    category: 'Fraud - Breach of trust',
    input: 'My employee who I trusted stole money from the cash register',
    expectedSections: ['IPC 406'],
    description: 'Criminal breach of trust by employee'
  },
  
  {
    category: 'Fraud - Forgery',
    input: 'He forged my signature on a property document',
    expectedSections: ['IPC 467', 'IPC 471'],
    description: 'Forgery of valuable document'
  },
  
  // ============ FAMILY / MARRIAGE OFFENCES ============
  
  {
    category: 'Family - Dowry harassment',
    input: 'My husband and in-laws are torturing me for more dowry',
    expectedSections: ['IPC 498A'],
    description: 'Dowry harassment case'
  },
  
  {
    category: 'Family - Dowry death',
    input: 'My sister died within 2 years of marriage after constant dowry demands',
    expectedSections: ['IPC 304B', 'IPC 498A'],
    description: 'Dowry death case'
  },
  
  {
    category: 'Family - Bigamy',
    input: 'My husband married another woman without divorcing me',
    expectedSections: ['IPC 494'],
    description: 'Bigamy / Second marriage'
  },
  
  // ============ KIDNAPPING / ABDUCTION ============
  
  {
    category: 'Kidnap - General',
    input: 'Someone kidnapped my child',
    expectedSections: ['IPC 363'],
    description: 'Kidnapping of minor'
  },
  
  {
    category: 'Kidnap - For marriage',
    input: 'They abducted a girl to force her into marriage',
    expectedSections: ['IPC 366', 'IPC 363'],
    description: 'Kidnapping for forced marriage'
  },
  
  // ============ PROPERTY DAMAGE ============
  
  {
    category: 'Damage - Mischief',
    input: 'Someone broke my car windows intentionally',
    expectedSections: ['IPC 427'],
    description: 'Mischief / Vandalism'
  },
  
  {
    category: 'Damage - Trespass',
    input: 'A group of people entered my house with weapons to attack me',
    expectedSections: ['IPC 452'],
    description: 'House trespass with preparation for assault'
  },
  
  // ============ EVIDENCE TAMPERING ============
  
  {
    category: 'Evidence - Tampering',
    input: 'After the accident he hid the vehicle and removed the number plate to avoid police',
    expectedSections: ['IPC 201'],
    description: 'Destroying evidence after accident'
  },
  
  // ============ ORGANIZED CRIME ============
  
  {
    category: 'Conspiracy',
    input: 'A group of people planned together to rob the bank',
    expectedSections: ['IPC 120B'],
    description: 'Criminal conspiracy'
  },
  
  {
    category: 'Dacoity',
    input: 'A gang of 5 people robbed our house with weapons',
    expectedSections: ['IPC 395'],
    description: 'Dacoity (robbery by 5+ persons)'
  },
  
  // ============ INSULT / PROVOCATION ============
  
  {
    category: 'Insult',
    input: 'He used abusive language to provoke me into fighting',
    expectedSections: ['IPC 504'],
    description: 'Intentional insult to provoke'
  },
  
  // ============ COMPLEX CASES (Multiple sections) ============
  
  {
    category: 'Complex - Murder + Evidence',
    input: 'He killed someone and then destroyed all evidence',
    expectedSections: ['IPC 302', 'IPC 201'],
    description: 'Murder with evidence tampering'
  },
  
  {
    category: 'Complex - Assault + Threat',
    input: 'He beat me with a stick and threatened to kill me',
    expectedSections: ['IPC 324', 'IPC 506'],
    description: 'Assault with weapon and death threat'
  },
  
  {
    category: 'Complex - Theft + Trespass',
    input: 'Someone broke into my house and stole my laptop',
    expectedSections: ['IPC 379', 'IPC 452'],
    description: 'Burglary (trespass + theft)'
  }
];

/**
 * Run a single test case
 * 
 * @param {Object} testCase - Test case object
 * @param {Function} classifyFunction - The POST /api/classify function
 * @returns {Object} - Test result
 */
async function runTestCase(testCase, classifyFunction) {
  try {
    const result = await classifyFunction({ text: testCase.input });
    
    const matchedCodes = result.sections.map(s => s.code);
    const expectedCodes = testCase.expectedSections;
    
    // Check if at least one expected section was matched
    const hasMatch = expectedCodes.some(expected => matchedCodes.includes(expected));
    
    return {
      passed: hasMatch,
      category: testCase.category,
      input: testCase.input,
      expected: expectedCodes,
      actual: matchedCodes,
      description: testCase.description
    };
  } catch (error) {
    return {
      passed: false,
      category: testCase.category,
      input: testCase.input,
      error: error.message
    };
  }
}

/**
 * Run all test cases
 */
async function runAllTests(classifyFunction) {
  console.log('\n════════════════════════════════════════');
  console.log('   RUNNING AI + RULES HYBRID TESTS');
  console.log('════════════════════════════════════════\n');
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    const result = await runTestCase(testCase, classifyFunction);
    results.push(result);
    
    if (result.passed) {
      passed++;
      console.log(`✅ ${result.category}`);
    } else {
      failed++;
      console.log(`❌ ${result.category}`);
      console.log(`   Expected: ${result.expected.join(', ')}`);
      console.log(`   Got: ${result.actual ? result.actual.join(', ') : 'ERROR'}`);
    }
  }
  
  console.log('\n════════════════════════════════════════');
  console.log(`   RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`   Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  console.log('════════════════════════════════════════\n');
  
  return results;
}

module.exports = {
  testCases,
  runTestCase,
  runAllTests
};
