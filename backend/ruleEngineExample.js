/**
 * ================================================
 * RULE ENGINE - IPC Section Classifier
 * ================================================
 * 
 * Accepts cleaned text and returns IPC section codes
 * based on keyword matching rules.
 * 
 * PRINCIPLE: Rules make ALL legal decisions, NOT AI
 */

// ================================================
// KEYWORD ARRAYS - Define crime categories
// ================================================

const KEYWORDS = {
  // Theft keywords
  theft: [
    'theft', 'stolen', 'stole', 'snatched', 'snatch',
    'pickpocket', 'took my', 'robbed', 'robbery',
    'burglary', 'missing'
  ],
  
  // Fraud keywords
  fraud: [
    'fraud', 'scam', 'scammed', 'cheated', 'cheating',
    'fake', 'lottery', 'prize', 'upi', 'paytm',
    'link', 'otp', 'cyber fraud', 'online fraud',
    'investment', 'promise'
  ],
  
  // Money/financial keywords
  money: [
    '₹', 'rs', 'rupees', 'money', 'cash',
    'paid', 'payment', 'sent', 'transferred',
    'amount', 'lakh', 'thousand', 'crore'
  ],
  
  // Threat keywords
  threat: [
    'threatened', 'threaten', 'threat', 'kill', 'harm',
    'warning', 'blackmail', 'extortion', 'intimidation',
    'will hurt', 'will kill', 'death threat'
  ],
  
  // Assault keywords
  assault: [
    'hit', 'beat', 'beaten', 'slapped', 'punched',
    'kicked', 'pushed', 'attack', 'attacked',
    'assault', 'hurt', 'injured', 'fight'
  ]
};

// ================================================
// HELPER FUNCTION - Check if text contains keywords
// ================================================

/**
 * Check if text contains any keyword from a keyword array
 * @param {string} text - Cleaned/normalized text
 * @param {string[]} keywords - Array of keywords to search for
 * @returns {boolean} - True if any keyword is found
 */
function containsKeywords(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

// ================================================
// MAIN RULE ENGINE FUNCTION
// ================================================

/**
 * Apply legal rules to determine IPC sections
 * 
 * @param {string} cleanedText - Normalized/cleaned text (lowercase, no special chars)
 * @returns {string[]} - Array of IPC section codes
 * 
 * @example
 * ruleEngine("my phone got theft")
 * // Returns: ["IPC 378", "IPC 379"]
 * 
 * @example
 * ruleEngine("i paid rs 5000 in fake lottery scam")
 * // Returns: ["IPC 415", "IPC 420"]
 */
function ruleEngine(cleanedText) {
  if (!cleanedText || typeof cleanedText !== 'string') {
    return [];
  }
  
  const sections = [];
  
  // ================================================
  // RULE 1: THEFT
  // If text contains theft keywords → IPC 378 + IPC 379
  // IPC 378: Definition of theft
  // IPC 379: Punishment for theft
  // ================================================
  if (containsKeywords(cleanedText, KEYWORDS.theft)) {
    sections.push('IPC 378'); // Definition of theft
    sections.push('IPC 379'); // Punishment for theft
  }
  
  // ================================================
  // RULE 2: FRAUD WITH MONEY
  // If text contains fraud keywords AND money keywords → IPC 415 + IPC 420
  // IPC 415: Cheating (definition)
  // IPC 420: Cheating and dishonestly inducing delivery of property
  // ================================================
  const hasFraud = containsKeywords(cleanedText, KEYWORDS.fraud);
  const hasMoney = containsKeywords(cleanedText, KEYWORDS.money);
  
  if (hasFraud && hasMoney) {
    sections.push('IPC 415'); // Cheating definition
    sections.push('IPC 420'); // Cheating with property
  } else if (hasFraud) {
    // Fraud without money - only IPC 420
    sections.push('IPC 420');
  }
  
  // ================================================
  // RULE 3: THREAT
  // If text contains threat keywords → IPC 506
  // IPC 506: Criminal intimidation
  // ================================================
  if (containsKeywords(cleanedText, KEYWORDS.threat)) {
    sections.push('IPC 506'); // Criminal intimidation
  }
  
  // ================================================
  // RULE 4: ASSAULT
  // If text contains assault keywords → IPC 323 + IPC 352
  // IPC 323: Voluntarily causing hurt
  // IPC 352: Assault or criminal force
  // ================================================
  if (containsKeywords(cleanedText, KEYWORDS.assault)) {
    sections.push('IPC 323'); // Voluntarily causing hurt
    sections.push('IPC 352'); // Assault or criminal force
  }
  
  // Return unique sections (in case of duplicates)
  return [...new Set(sections)];
}

// ================================================
// ENHANCED VERSION - Returns details, not just codes
// ================================================

/**
 * Apply rules and return detailed results
 * @param {string} cleanedText - Normalized text
 * @returns {Object[]} - Array of objects with section code and reasoning
 */
function ruleEngineDetailed(cleanedText) {
  if (!cleanedText || typeof cleanedText !== 'string') {
    return [];
  }
  
  const results = [];
  
  // Rule 1: Theft
  if (containsKeywords(cleanedText, KEYWORDS.theft)) {
    results.push({
      code: 'IPC 378',
      name: 'Theft',
      reasoning: 'Text contains theft-related keywords',
      matchedKeywords: KEYWORDS.theft.filter(k => cleanedText.includes(k))
    });
    results.push({
      code: 'IPC 379',
      name: 'Punishment for Theft',
      reasoning: 'Punishment section for theft offense',
      matchedKeywords: KEYWORDS.theft.filter(k => cleanedText.includes(k))
    });
  }
  
  // Rule 2: Fraud
  const hasFraud = containsKeywords(cleanedText, KEYWORDS.fraud);
  const hasMoney = containsKeywords(cleanedText, KEYWORDS.money);
  
  if (hasFraud && hasMoney) {
    results.push({
      code: 'IPC 415',
      name: 'Cheating',
      reasoning: 'Fraud with financial loss detected',
      matchedKeywords: [
        ...KEYWORDS.fraud.filter(k => cleanedText.includes(k)),
        ...KEYWORDS.money.filter(k => cleanedText.includes(k))
      ]
    });
    results.push({
      code: 'IPC 420',
      name: 'Cheating and dishonestly inducing delivery of property',
      reasoning: 'Fraud involving money/property',
      matchedKeywords: [
        ...KEYWORDS.fraud.filter(k => cleanedText.includes(k)),
        ...KEYWORDS.money.filter(k => cleanedText.includes(k))
      ]
    });
  } else if (hasFraud) {
    results.push({
      code: 'IPC 420',
      name: 'Cheating',
      reasoning: 'Fraud detected without specific financial loss',
      matchedKeywords: KEYWORDS.fraud.filter(k => cleanedText.includes(k))
    });
  }
  
  // Rule 3: Threat
  if (containsKeywords(cleanedText, KEYWORDS.threat)) {
    results.push({
      code: 'IPC 506',
      name: 'Criminal Intimidation',
      reasoning: 'Threat or intimidation detected',
      matchedKeywords: KEYWORDS.threat.filter(k => cleanedText.includes(k))
    });
  }
  
  // Rule 4: Assault
  if (containsKeywords(cleanedText, KEYWORDS.assault)) {
    results.push({
      code: 'IPC 323',
      name: 'Voluntarily Causing Hurt',
      reasoning: 'Physical assault or hurt detected',
      matchedKeywords: KEYWORDS.assault.filter(k => cleanedText.includes(k))
    });
    results.push({
      code: 'IPC 352',
      name: 'Assault or Criminal Force',
      reasoning: 'Use of force or assault detected',
      matchedKeywords: KEYWORDS.assault.filter(k => cleanedText.includes(k))
    });
  }
  
  return results;
}

// ================================================
// TESTING & EXAMPLES
// ================================================

if (require.main === module) {
  console.log('='.repeat(70));
  console.log('RULE ENGINE - TESTING');
  console.log('='.repeat(70));
  
  const testCases = [
    {
      description: 'Theft case',
      text: 'my phone got theft',
      expected: ['IPC 378', 'IPC 379']
    },
    {
      description: 'Fraud with money',
      text: 'i paid rs 5000 in fake lottery scam',
      expected: ['IPC 415', 'IPC 420']
    },
    {
      description: 'Threat case',
      text: 'he threatened to kill me',
      expected: ['IPC 506']
    },
    {
      description: 'Assault case',
      text: 'boys hit me and pushed me',
      expected: ['IPC 323', 'IPC 352']
    },
    {
      description: 'Multiple crimes (theft + assault)',
      text: 'he beat me and stolen my money',
      expected: ['IPC 378', 'IPC 379', 'IPC 323', 'IPC 352']
    },
    {
      description: 'Fraud without money',
      text: 'someone cheated me with fake promise',
      expected: ['IPC 420']
    }
  ];
  
  console.log('\n📋 SIMPLE VERSION (returns codes only)\n');
  
  testCases.forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.description}`);
    console.log(`  Input: "${test.text}"`);
    
    const result = ruleEngine(test.text);
    console.log(`  Result: [${result.join(', ')}]`);
    console.log(`  Expected: [${test.expected.join(', ')}]`);
    
    const match = JSON.stringify(result.sort()) === JSON.stringify(test.expected.sort());
    console.log(`  Status: ${match ? '✅ PASS' : '❌ FAIL'}\n`);
  });
  
  console.log('='.repeat(70));
  console.log('📊 DETAILED VERSION (returns objects with reasoning)\n');
  
  const sampleText = 'i paid rs 5000 in fake lottery scam';
  console.log(`Input: "${sampleText}"\n`);
  
  const detailedResults = ruleEngineDetailed(sampleText);
  detailedResults.forEach(result => {
    console.log(`${result.code}: ${result.name}`);
    console.log(`  Reasoning: ${result.reasoning}`);
    console.log(`  Matched: ${result.matchedKeywords.join(', ')}\n`);
  });
  
  console.log('='.repeat(70));
  console.log('\n📝 USAGE EXAMPLES:\n');
  console.log(`
// Simple usage
const sections = ruleEngine("my phone got theft");
console.log(sections); // ["IPC 378", "IPC 379"]

// Detailed usage
const details = ruleEngineDetailed("he threatened to kill me");
console.log(details);
// [
//   {
//     code: "IPC 506",
//     name: "Criminal Intimidation",
//     reasoning: "Threat or intimidation detected",
//     matchedKeywords: ["threatened", "kill"]
//   }
// ]

// Check if specific section applies
const text = "someone scammed me";
const sections = ruleEngine(text);
if (sections.includes("IPC 420")) {
  console.log("Fraud case detected!");
}
  `);
  
  console.log('='.repeat(70));
}

// ================================================
// EXPORTS
// ================================================

module.exports = {
  ruleEngine,
  ruleEngineDetailed,
  containsKeywords,
  KEYWORDS
};
