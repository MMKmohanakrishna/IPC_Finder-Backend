/**
 * ====================================
 * SIMPLE KEYWORD-BASED CLASSIFIER
 * ====================================
 * 
 * PRINCIPLE:
 * - Simple keyword matching for beginners
 * - Easy to understand and modify
 * - Generic rules (not hardcoded for one case)
 * - AI used ONLY for language understanding
 */

/**
 * STEP 1: TEXT NORMALIZATION
 * Clean and standardize user input
 */

// Common spelling mistakes → Correct words
const SPELLING_CORRECTIONS = {
  // Theft related
  'thrift': 'theft',
  'theif': 'thief',
  'stole': 'stolen',
  'theift': 'theft',
  'roberry': 'robbery',
  'snathed': 'snatched',
  
  // Fraud related
  'frod': 'fraud',
  'scm': 'scam',
  'cheat': 'cheated',
  'cheting': 'cheating',
  'lottry': 'lottery',
  
  // Threat related
  'threaten': 'threatened',
  'threten': 'threaten',
  'kil': 'kill',
  'kidnaped': 'kidnapped',
  
  // Assault related
  'beet': 'beat',
  'hert': 'hurt',
  'atack': 'attack',
  'assult': 'assault',
  'slaped': 'slapped',
  
  // General
  'mony': 'money',
  'payed': 'paid',
  'recieved': 'received'
};

/**
 * Fix spelling mistakes in text
 * @param {string} text - Text with possible spelling mistakes
 * @returns {string} - Text with corrected spelling
 */
function fixSpelling(text) {
  if (!text) return '';
  
  let corrected = text;
  
  // Apply each spelling correction
  Object.keys(SPELLING_CORRECTIONS).forEach(mistake => {
    const correction = SPELLING_CORRECTIONS[mistake];
    // Use word boundaries to avoid partial replacements
    // Case-insensitive matching
    const regex = new RegExp(`\\b${mistake}\\b`, 'gi');
    corrected = corrected.replace(regex, correction);
  });
  
  return corrected;
}

/**
 * Normalize text - lowercase, fix spelling, remove special chars
 * @param {string} text - Raw user input
 * @returns {string} - Cleaned text
 */
function normalizeText(text) {
  if (!text) return '';
  
  // Step 1: Convert to lowercase
  let normalized = text.toLowerCase().trim();
  
  // Step 2: Fix common spelling mistakes
  normalized = fixSpelling(normalized);
  
  // Step 3: Remove special characters but keep spaces and money symbols
  // Keep: letters, numbers, spaces, ₹, rs
  normalized = normalized.replace(/[^a-z0-9\s₹]/g, ' ');
  
  // Step 4: Remove extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

/**
 * STEP 2: KEYWORD GROUPS
 * Define keywords for each crime category
 */

const KEYWORD_GROUPS = {
  // Theft keywords
  theft: [
    'theft', 'stolen', 'stole', 'snatched', 'snatch',
    'pickpocket', 'took my', 'robbed', 'robbery',
    'burglary', 'burglar', 'shoplifting'
  ],
  
  // Fraud keywords
  fraud: [
    'fraud', 'scam', 'scammed', 'cheated', 'cheating',
    'fake', 'lottery', 'prize', 'upi', 'paytm',
    'link', 'otp', 'online fraud', 'cyber fraud',
    'investment', 'scheme', 'promise', 'returned'
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
  ],
  
  // Sexual offence keywords
  sexual: [
    'rape', 'molest', 'molestation', 'touched',
    'inappropriate', 'harass', 'eve teasing',
    'stalking', 'followed', 'obscene', 'vulgar'
  ],
  
  // Murder keywords
  murder: [
    'murder', 'killed', 'dead', 'death', 'died',
    'shot', 'stabbed', 'strangled', 'poisoned'
  ],
  
  // Dowry keywords
  dowry: [
    'dowry', 'in-laws', 'husband', 'wife',
    'marriage', 'torture', 'cruelty'
  ],
  
  // Kidnapping keywords
  kidnap: [
    'kidnap', 'kidnapped', 'abduct', 'abducted',
    'missing', 'taken away', 'forcibly'
  ]
};

/**
 * STEP 3: FINANCIAL LOSS DETECTION
 * Detect if money is involved in the case
 */

/**
 * Check if text mentions financial loss
 * @param {string} text - Normalized text
 * @returns {boolean} - True if money is mentioned
 */
function hasFinancialLoss(text) {
  // Money symbols and keywords
  const moneyIndicators = [
    '₹', 'rs', 'rupees', 'money', 'cash',
    'paid', 'payment', 'sent', 'transferred',
    'amount', 'lakh', 'thousand', 'crore'
  ];
  
  return moneyIndicators.some(indicator => text.includes(indicator));
}

/**
 * STEP 4: GENERIC RULE ENGINE
 * Apply rules to determine IPC sections
 */

/**
 * Generic rules mapping keywords to IPC sections
 * Each rule has:
 * - keywords: which keyword group to check
 * - conditions: additional conditions (optional)
 * - sections: IPC sections to return
 * - reasoning: why these sections apply
 */
const GENERIC_RULES = [
  
  // THEFT RULES
  {
    id: 'THEFT_SIMPLE',
    keywords: 'theft',
    conditions: (flags) => !flags.assault && !flags.murder,
    sections: ['IPC 378', 'IPC 379'],
    reasoning: 'Simple theft - property taken without consent',
    weight: 10
  },
  
  {
    id: 'THEFT_WITH_VIOLENCE',
    keywords: 'theft',
    conditions: (flags) => flags.assault || flags.threat,
    sections: ['IPC 392', 'IPC 379'],
    reasoning: 'Robbery - theft with force or threat',
    weight: 12
  },
  
  // FRAUD RULES
  {
    id: 'FRAUD_SIMPLE',
    keywords: 'fraud',
    conditions: (flags) => !flags.financialLoss,
    sections: ['IPC 420'],
    reasoning: 'Cheating and fraud',
    weight: 9
  },
  
  {
    id: 'FRAUD_FINANCIAL',
    keywords: 'fraud',
    conditions: (flags) => flags.financialLoss,
    sections: ['IPC 415', 'IPC 420'],
    reasoning: 'Cheating with financial loss - fraudulently obtaining property',
    weight: 12
  },
  
  // THREAT RULES
  {
    id: 'THREAT_GENERAL',
    keywords: 'threat',
    conditions: (flags) => !flags.murder,
    sections: ['IPC 503', 'IPC 506'],
    reasoning: 'Criminal intimidation and threats',
    weight: 10
  },
  
  {
    id: 'THREAT_DEATH',
    keywords: 'threat',
    conditions: (flags) => flags.murder || flags.text.includes('kill') || flags.text.includes('death'),
    sections: ['IPC 506'],
    reasoning: 'Threat to cause death or grievous hurt',
    weight: 11
  },
  
  // ASSAULT RULES
  {
    id: 'ASSAULT_SIMPLE',
    keywords: 'assault',
    conditions: (flags) => !flags.murder,
    sections: ['IPC 323', 'IPC 352'],
    reasoning: 'Voluntarily causing hurt and assault',
    weight: 10
  },
  
  {
    id: 'ASSAULT_SERIOUS',
    keywords: 'assault',
    conditions: (flags) => flags.text.includes('weapon') || flags.text.includes('knife') || flags.text.includes('rod'),
    sections: ['IPC 324', 'IPC 352'],
    reasoning: 'Assault with dangerous weapon',
    weight: 12
  },
  
  // SEXUAL OFFENCE RULES
  {
    id: 'SEXUAL_HARASSMENT',
    keywords: 'sexual',
    conditions: (flags) => flags.text.includes('comment') || flags.text.includes('eve') || flags.text.includes('tease'),
    sections: ['IPC 509', 'IPC 354A'],
    reasoning: 'Sexual harassment and insulting modesty',
    weight: 11
  },
  
  {
    id: 'SEXUAL_ASSAULT',
    keywords: 'sexual',
    conditions: (flags) => flags.text.includes('touched') || flags.text.includes('molest'),
    sections: ['IPC 354', 'IPC 354A'],
    reasoning: 'Assault to outrage modesty',
    weight: 12
  },
  
  {
    id: 'SEXUAL_RAPE',
    keywords: 'sexual',
    conditions: (flags) => flags.text.includes('rape') || flags.text.includes('forced'),
    sections: ['IPC 376'],
    reasoning: 'Rape and sexual assault',
    weight: 15
  },
  
  // MURDER RULES
  {
    id: 'MURDER',
    keywords: 'murder',
    conditions: (flags) => true,
    sections: ['IPC 302'],
    reasoning: 'Murder - intentionally causing death',
    weight: 15
  },
  
  {
    id: 'ATTEMPT_MURDER',
    keywords: 'murder',
    conditions: (flags) => flags.text.includes('tried') || flags.text.includes('attempt') || flags.assault,
    sections: ['IPC 307'],
    reasoning: 'Attempt to murder',
    weight: 13
  },
  
  // DOWRY RULES
  {
    id: 'DOWRY_HARASSMENT',
    keywords: 'dowry',
    conditions: (flags) => !flags.murder,
    sections: ['IPC 498A'],
    reasoning: 'Cruelty by husband or relatives for dowry',
    weight: 12
  },
  
  {
    id: 'DOWRY_DEATH',
    keywords: 'dowry',
    conditions: (flags) => flags.murder || flags.text.includes('death') || flags.text.includes('died'),
    sections: ['IPC 304B', 'IPC 498A'],
    reasoning: 'Dowry death',
    weight: 15
  },
  
  // KIDNAPPING RULES
  {
    id: 'KIDNAPPING',
    keywords: 'kidnap',
    conditions: (flags) => true,
    sections: ['IPC 363'],
    reasoning: 'Kidnapping from lawful guardianship',
    weight: 12
  },
  
  {
    id: 'KIDNAPPING_MARRIAGE',
    keywords: 'kidnap',
    conditions: (flags) => flags.text.includes('marriage') || flags.text.includes('marry'),
    sections: ['IPC 366', 'IPC 363'],
    reasoning: 'Kidnapping to compel marriage',
    weight: 13
  }
];

/**
 * Check which keyword groups match the text
 * @param {string} text - Normalized text
 * @returns {Object} - Flags for each keyword group
 */
function detectKeywordMatches(text) {
  const flags = {
    text: text, // Keep original for condition checking
    financialLoss: hasFinancialLoss(text)
  };
  
  // Check each keyword group
  Object.keys(KEYWORD_GROUPS).forEach(category => {
    const keywords = KEYWORD_GROUPS[category];
    // Check if any keyword from this category is in the text
    flags[category] = keywords.some(keyword => text.includes(keyword));
  });
  
  return flags;
}

/**
 * Apply generic rules to get matching IPC sections
 * @param {string} normalizedText - Clean text
 * @returns {Array} - Matched sections with reasoning
 */
function applyRules(normalizedText) {
  // Detect which keyword groups are present
  const flags = detectKeywordMatches(normalizedText);
  
  const matches = [];
  
  // Test each rule
  GENERIC_RULES.forEach(rule => {
    // Check if the rule's keyword group is present
    const keywordMatch = flags[rule.keywords];
    
    if (keywordMatch) {
      // Check additional conditions (if any)
      const conditionsMet = rule.conditions ? rule.conditions(flags) : true;
      
      if (conditionsMet) {
        // Rule matches - add all sections
        rule.sections.forEach(sectionCode => {
          matches.push({
            code: sectionCode,
            reasoning: rule.reasoning,
            ruleId: rule.id,
            weight: rule.weight
          });
        });
      }
    }
  });
  
  return matches;
}

/**
 * STEP 5: GET SECTIONS FROM MONGODB
 * Fetch full section details from database
 */

/**
 * Score and rank matched sections
 * @param {Array} matches - Raw matches from rules
 * @returns {Array} - Scored and sorted section codes
 */
function scoreMatches(matches) {
  const scores = {};
  
  // Aggregate scores for each section
  matches.forEach(match => {
    if (!scores[match.code]) {
      scores[match.code] = {
        code: match.code,
        totalScore: 0,
        reasons: []
      };
    }
    
    scores[match.code].totalScore += match.weight;
    scores[match.code].reasons.push(match.reasoning);
  });
  
  // Sort by score (descending)
  const sorted = Object.values(scores)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5); // Top 5 only
  
  return sorted;
}

/**
 * Main classification function
 * @param {string} userText - Raw user input
 * @param {Object} Section - Mongoose Section model
 * @returns {Object} - Classification results
 */
async function classifySimple(userText, Section) {
  try {
    // STEP 1: Normalize text
    const normalizedText = normalizeText(userText);
    
    console.log('\n=== SIMPLE CLASSIFIER ===');
    console.log('Original:', userText);
    console.log('Normalized:', normalizedText);
    
    // STEP 2-4: Apply rules
    const matches = applyRules(normalizedText);
    
    console.log('Rule matches:', matches.length);
    
    if (matches.length === 0) {
      return {
        success: true,
        count: 0,
        results: [],
        message: 'No matching IPC sections found. Try providing more details.'
      };
    }
    
    // Score and rank
    const scored = scoreMatches(matches);
    
    console.log('Top sections:', scored.map(s => s.code).join(', '));
    
    // STEP 5: Fetch from MongoDB
    const results = [];
    
    for (const item of scored) {
      const section = await Section.findOne({ code: item.code });
      
      if (section) {
        results.push({
          code: section.code,
          name: section.name,
          simpleMeaning: section.simpleMeaning,
          usedWhen: section.usedWhen,
          examples: section.examples,
          punishment: section.punishment,
          firPossible: section.firPossible,
          score: item.totalScore,
          matchReason: item.reasons[0]
        });
      }
    }
    
    return {
      success: true,
      count: results.length,
      results: results,
      method: 'simple-classifier',
      disclaimer: 'This is general legal information only, NOT legal advice. Always consult a qualified lawyer for your specific case.'
    };
    
  } catch (error) {
    console.error('Simple classifier error:', error);
    throw error;
  }
}

// Export all functions
module.exports = {
  fixSpelling,
  normalizeText,
  hasFinancialLoss,
  detectKeywordMatches,
  applyRules,
  scoreMatches,
  classifySimple,
  SPELLING_CORRECTIONS,
  KEYWORD_GROUPS,
  GENERIC_RULES
};
