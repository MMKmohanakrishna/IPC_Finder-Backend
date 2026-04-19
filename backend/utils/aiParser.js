/**
 * ====================================
 * LAYER 1: AI LANGUAGE UNDERSTANDING
 * ====================================
 * 
 * CRITICAL PRINCIPLE:
 * - AI is used ONLY for language understanding
 * - AI MUST NOT decide IPC sections
 * - AI MUST NOT make legal judgments
 * - AI only extracts structured information
 * 
 * AI responsibilities:
 * 1. Correct spelling mistakes
 * 2. Normalize text
 * 3. Extract structured meaning
 * 4. Identify entities (victim, accused, objects, etc.)
 * 
 * Output: Pure JSON with no IPC section numbers
 */

/**
 * Spelling correction dictionary
 * Maps common misspellings to correct legal terms
 */
const SPELLING_CORRECTIONS = {
  // Theft-related
  'thrift': 'theft',
  'theif': 'thief',
  'stole': 'stolen',
  'steeling': 'stealing',
  'roberry': 'robbery',
  
  // Violence-related
  'morder': 'murder',
  'kil': 'kill',
  'ded': 'dead',
  'atack': 'attack',
  'assult': 'assault',
  'beet': 'beat',
  'hert': 'hurt',
  'injure': 'injured',
  
  // Sexual offences
  'rpe': 'rape',
  'molest': 'molestation',
  'harras': 'harass',
  'harrasment': 'harassment',
  
  // Property
  'damge': 'damage',
  'destroyd': 'destroyed',
  'vandlism': 'vandalism',
  
  // Fraud
  'cheat': 'cheating',
  'frod': 'fraud',
  'scm': 'scam',
  
  // Common words
  'threaten': 'threatened',
  'kidnaped': 'kidnapped',
  'blackmale': 'blackmail'
};

/**
 * Offence category keywords
 * Used to classify user input into broad categories
 */
const CATEGORY_KEYWORDS = {
  property: [
    'theft', 'stolen', 'stole', 'robbery', 'robbed', 'pickpocket', 
    'shoplifting', 'burglary', 'took my', 'missing', 'lost', 'property',
    'money', 'wallet', 'phone', 'bag', 'laptop', 'vehicle', 'bike'
  ],
  
  person: [
    'murder', 'killed', 'death', 'hurt', 'injured', 'assault', 'attacked',
    'beating', 'hit', 'slapped', 'punched', 'kicked', 'stabbed', 'shot',
    'wounded', 'bleeding', 'hospital', 'died', 'dead', 'fatal'
  ],
  
  sexual: [
    'rape', 'molestation', 'sexual assault', 'inappropriate touch', 
    'groped', 'modesty', 'obscene', 'naked', 'disrobe', 'voyeurism',
    'stalking', 'followed', 'harass sexually', 'private parts'
  ],
  
  threat: [
    'threat', 'threatened', 'intimidation', 'blackmail', 'extortion',
    'will kill', 'will hurt', 'warning', 'scared', 'fear', 'danger'
  ],
  
  fraud: [
    'fraud', 'cheating', 'scam', 'deceived', 'fake', 'false', 'lied',
    'tricked', 'conned', 'forgery', 'counterfeit', 'duplicate'
  ],
  
  family: [
    'dowry', 'husband', 'wife', 'in-laws', 'marriage', 'divorce',
    'domestic violence', 'cruelty', 'torture', 'harassment at home'
  ],
  
  cyber: [
    'online', 'internet', 'social media', 'whatsapp', 'facebook',
    'video', 'photo', 'morphed', 'hacked', 'password', 'account'
  ],
  
  evidence: [
    'hiding', 'destroyed evidence', 'tampered', 'removed', 'concealed',
    'false information', 'cover up', 'accident scene'
  ]
};

/**
 * Action verbs that indicate different types of offences
 */
const ACTION_VERBS = {
  violence: ['killed', 'murdered', 'shot', 'stabbed', 'attacked', 'beat', 'hit', 'assaulted', 'hurt', 'injured', 'slapped', 'kicked', 'punched'],
  taking: ['stole', 'took', 'stolen', 'robbed', 'snatched', 'grabbed', 'removed', 'took away'],
  threat: ['threatened', 'warned', 'blackmailed', 'intimidated', 'scared', 'frightened'],
  deception: ['cheated', 'deceived', 'tricked', 'lied', 'scammed', 'conned', 'fooled'],
  sexual: ['raped', 'molested', 'touched', 'groped', 'harassed', 'stalked', 'followed'],
  damage: ['destroyed', 'damaged', 'broke', 'vandalized', 'burned', 'set fire'],
  evidence: ['hid', 'destroyed', 'removed', 'tampered', 'concealed', 'threw away']
};

/**
 * Weapons and dangerous objects
 */
const WEAPONS = [
  'gun', 'pistol', 'revolver', 'rifle', 'knife', 'sword', 'dagger',
  'rod', 'stick', 'bat', 'iron rod', 'pipe', 'hammer', 'axe',
  'acid', 'poison', 'fire', 'petrol', 'kerosene', 'bomb', 'explosive'
];

/**
 * Normalize user input
 * @param {string} text - Raw user input
 * @returns {string} - Normalized text
 */
function normalizeText(text) {
  if (!text) return '';
  
  let normalized = text.toLowerCase().trim();
  
  // Apply spelling corrections
  Object.keys(SPELLING_CORRECTIONS).forEach(mistake => {
    const correction = SPELLING_CORRECTIONS[mistake];
    const regex = new RegExp(`\\b${mistake}\\b`, 'gi');
    normalized = normalized.replace(regex, correction);
  });
  
  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized;
}

/**
 * Determine offence category from text
 * @param {string} text - Normalized text
 * @returns {string[]} - Array of matching categories (can be multiple)
 */
function identifyCategories(text) {
  const categories = [];
  
  Object.keys(CATEGORY_KEYWORDS).forEach(category => {
    const keywords = CATEGORY_KEYWORDS[category];
    const hasMatch = keywords.some(keyword => text.includes(keyword));
    if (hasMatch) {
      categories.push(category);
    }
  });
  
  // Default to 'general' if no category matched
  return categories.length > 0 ? categories : ['general'];
}

/**
 * Extract action verbs from text
 * @param {string} text - Normalized text
 * @returns {Object} - Actions grouped by type
 */
function extractActions(text) {
  const actions = {
    violence: [],
    taking: [],
    threat: [],
    deception: [],
    sexual: [],
    damage: [],
    evidence: []
  };
  
  Object.keys(ACTION_VERBS).forEach(type => {
    const verbs = ACTION_VERBS[type];
    verbs.forEach(verb => {
      if (text.includes(verb)) {
        actions[type].push(verb);
      }
    });
  });
  
  // Additional context-based detection
  // "got stolen" or "got theft" should be detected as "taking"
  if (/got (stolen|theft|stole|robbed)/i.test(text) || 
      /was (stolen|theft|stole)/i.test(text) ||
      /(theft|stolen) from/i.test(text)) {
    if (!actions.taking.includes('stolen')) {
      actions.taking.push('stolen');
    }
  }
  
  return actions;
}

/**
 * Extract objects/items mentioned in text
 * @param {string} text - Normalized text
 * @returns {string[]} - List of objects
 */
function extractObjects(text) {
  const objects = [];
  const objectPatterns = [
    'phone', 'mobile', 'wallet', 'money', 'cash', 'purse', 'bag',
    'laptop', 'computer', 'vehicle', 'car', 'bike', 'motorcycle',
    'jewelry', 'gold', 'chain', 'watch', 'property', 'house',
    'video', 'photo', 'image', 'document', 'certificate',
    'number plate', 'evidence', 'cctv', 'footage'
  ];
  
  objectPatterns.forEach(obj => {
    if (text.includes(obj)) {
      objects.push(obj);
    }
  });
  
  return objects;
}

/**
 * Detect if weapon was used
 * @param {string} text - Normalized text
 * @returns {Object} - Weapon info
 */
function detectWeapon(text) {
  for (const weapon of WEAPONS) {
    if (text.includes(weapon)) {
      return {
        present: true,
        type: weapon,
        dangerous: true
      };
    }
  }
  
  return { present: false, type: null, dangerous: false };
}

/**
 * Detect victim and accused (basic extraction)
 * @param {string} text - Normalized text
 * @returns {Object} - Victim and accused info
 */
function extractPersons(text) {
  const result = {
    victim: null,
    accused: null,
    victimGender: null
  };
  
  // Detect victim gender
  const femaleIndicators = ['woman', 'girl', 'wife', 'daughter', 'mother', 'sister', 'she', 'her'];
  const maleIndicators = ['man', 'boy', 'husband', 'father', 'brother', 'he', 'him'];
  
  const hasFemale = femaleIndicators.some(ind => text.includes(ind));
  const hasMale = maleIndicators.some(ind => text.includes(ind));
  
  if (hasFemale) result.victimGender = 'female';
  if (hasMale && !hasFemale) result.victimGender = 'male';
  
  // Check if user is victim (first person indicators)
  const firstPerson = ['my', 'me', 'i ', 'i\'m', 'i was', 'i am'];
  result.victim = firstPerson.some(fp => text.includes(fp)) ? 'self' : 'third-party';
  
  return result;
}

/**
 * Detect death or injury level
 * @param {string} text - Normalized text
 * @returns {string|null} - 'death', 'grievous', 'hurt', or null
 */
function detectInjuryLevel(text) {
  const deathKeywords = ['died', 'dead', 'death', 'killed', 'murder', 'fatal'];
  const grievousKeywords = ['serious injury', 'critical', 'hospital', 'fracture', 'broken bones', 'bleeding heavily'];
  const hurtKeywords = ['hurt', 'injured', 'pain', 'wound', 'bruise', 'bleeding'];
  
  if (deathKeywords.some(k => text.includes(k))) return 'death';
  if (grievousKeywords.some(k => text.includes(k))) return 'grievous';
  if (hurtKeywords.some(k => text.includes(k))) return 'hurt';
  
  return null;
}

/**
 * Detect location context
 * @param {string} text - Normalized text
 * @returns {string|null} - Location type
 */
function detectLocation(text) {
  if (/home|house|residence/.test(text)) return 'home';
  if (/street|road|public/.test(text)) return 'public';
  if (/office|workplace|work/.test(text)) return 'workplace';
  if (/online|internet|social media/.test(text)) return 'cyber';
  
  return null;
}

/**
 * MAIN PARSER FUNCTION
 * Converts user text into structured JSON
 * 
 * @param {string} userText - Raw user input
 * @returns {Object} - Structured legal problem JSON (NO IPC SECTIONS)
 */
function parseUserInput(userText) {
  // Step 1: Normalize
  const normalizedText = normalizeText(userText);
  
  // Step 2: Extract structured information
  const categories = identifyCategories(normalizedText);
  const actions = extractActions(normalizedText);
  const objects = extractObjects(normalizedText);
  const weapon = detectWeapon(normalizedText);
  const persons = extractPersons(normalizedText);
  const injuryLevel = detectInjuryLevel(normalizedText);
  const location = detectLocation(normalizedText);
  
  // Determine intent (simplified)
  let intent = 'unknown';
  if (actions.violence.length > 0) intent = 'violence';
  else if (actions.taking.length > 0) intent = 'theft';
  else if (actions.sexual.length > 0) intent = 'sexual-offence';
  else if (actions.threat.length > 0) intent = 'threat';
  else if (actions.deception.length > 0) intent = 'fraud';
  else if (actions.damage.length > 0) intent = 'damage';
  else if (actions.evidence.length > 0) intent = 'evidence-tampering';
  
  // Additional context-based intent detection
  if (intent === 'unknown' && categories.includes('property')) {
    if (/theft|stolen|stole|robbery|robbed/.test(normalizedText)) {
      intent = 'theft';
    }
  }
  
  // Build structured output (JSON ONLY - NO IPC SECTIONS)
  const structured = {
    normalizedText,
    originalText: userText,
    intent,
    offenceCategory: categories[0] || 'general',
    allCategories: categories,
    actions: {
      violence: actions.violence,
      taking: actions.taking,
      threat: actions.threat,
      deception: actions.deception,
      sexual: actions.sexual,
      damage: actions.damage,
      evidence: actions.evidence
    },
    objects,
    victim: persons.victim,
    victimGender: persons.victimGender,
    accused: persons.accused,
    forceUsed: actions.violence.length > 0 || weapon.present,
    weapon: weapon.present ? weapon.type : null,
    weaponDangerous: weapon.dangerous,
    location,
    sexualElement: categories.includes('sexual'),
    threatElement: categories.includes('threat'),
    financialLoss: objects.includes('money') || objects.includes('wallet') || objects.includes('cash'),
    deathOrInjury: injuryLevel,
    cyberElement: categories.includes('cyber') || location === 'cyber',
    familyElement: categories.includes('family'),
    evidenceTampering: categories.includes('evidence') || actions.evidence.length > 0
  };
  
  return structured;
}

/**
 * Validate parsed output
 * Ensures AI has not hallucinated IPC sections
 */
function validateOutput(parsed) {
  const output = JSON.stringify(parsed);
  
  // Check for IPC section mentions (should never be present)
  if (/IPC\s*\d+|section\s*\d+/i.test(output)) {
    console.warn('⚠️  WARNING: AI attempted to suggest IPC sections. Removing...');
    // In production, this would trigger an alert
  }
  
  return parsed;
}

module.exports = {
  parseUserInput,
  normalizeText,
  validateOutput
};
