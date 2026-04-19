/**
 * Text Processing Utility
 * Handles input normalization, spell correction, and keyword extraction
 */

// Common spelling corrections for legal terms
const SPELLING_CORRECTIONS = {
  'thrift': 'theft',
  'theif': 'theft',
  'stollen': 'stolen',
  'roberry': 'robbery',
  'murdr': 'murder',
  'kidnaped': 'kidnapped',
  'asault': 'assault',
  'harrass': 'harass',
  'raep': 'rape',
  'cheat': 'cheating',
  'frauded': 'fraud',
  'theef': 'theft',
  'attaked': 'attacked',
  'threaten': 'threat',
  'intimitation': 'intimidation'
};

// Legal keywords categorized by type
const LEGAL_KEYWORDS = {
  // Property crimes
  property: [
    'theft', 'stolen', 'stole', 'steal', 'robbery', 'robbed', 'rob',
    'burglary', 'pickpocket', 'shoplifting', 'snatched', 'took',
    'cheating', 'fraud', 'scam', 'fake', 'counterfeit', 'forgery',
    'embezzlement', 'misappropriation', 'property', 'money', 'phone',
    'wallet', 'bike', 'vehicle', 'jewellery', 'cash'
  ],
  
  // Person-related crimes
  person: [
    'assault', 'hurt', 'beaten', 'hit', 'slapped', 'punched', 'kicked',
    'attacked', 'injured', 'wound', 'harm', 'violence', 'fight',
    'murder', 'killed', 'death', 'shot', 'stabbed', 'poisoned'
  ],
  
  // Sexual offences
  sexual: [
    'rape', 'molestation', 'harassment', 'modesty', 'sexual',
    'inappropriate touch', 'groped', 'stalking', 'voyeurism',
    'disrobe', 'eve teasing', 'catcalling', 'obscene'
  ],
  
  // Threats and intimidation
  threat: [
    'threat', 'threatened', 'intimidation', 'blackmail', 'extortion',
    'coercion', 'force', 'compel', 'demanded'
  ],
  
  // Weapons
  weapons: [
    'weapon', 'knife', 'gun', 'pistol', 'sword', 'rod', 'stick',
    'acid', 'sharp', 'dangerous weapon'
  ],
  
  // Actions
  actions: [
    'took', 'removed', 'hid', 'destroyed', 'damaged', 'broke',
    'entered', 'trespassed', 'followed', 'sent', 'shared', 'posted'
  ],
  
  // Family/Social
  family: [
    'husband', 'wife', 'in-laws', 'mother', 'father', 'parent',
    'dowry', 'marriage', 'married', 'family'
  ]
};

/**
 * STEP 1: Normalize input text
 * @param {string} text - Raw user input
 * @returns {string} - Cleaned and normalized text
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Convert to lowercase
  let normalized = text.toLowerCase();
  
  // Apply spelling corrections
  Object.keys(SPELLING_CORRECTIONS).forEach(mistake => {
    const correction = SPELLING_CORRECTIONS[mistake];
    const regex = new RegExp(`\\b${mistake}\\b`, 'gi');
    normalized = normalized.replace(regex, correction);
  });
  
  // Remove special characters except spaces and basic punctuation
  normalized = normalized.replace(/[^a-z0-9\s.,!?-]/g, ' ');
  
  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

/**
 * STEP 2: Extract keywords from text
 * @param {string} text - Normalized text
 * @returns {Object} - Categorized keywords found in text
 */
function extractKeywords(text) {
  const found = {
    property: [],
    person: [],
    sexual: [],
    threat: [],
    weapons: [],
    actions: [],
    family: []
  };
  
  // Check each category
  Object.keys(LEGAL_KEYWORDS).forEach(category => {
    LEGAL_KEYWORDS[category].forEach(keyword => {
      if (text.includes(keyword)) {
        found[category].push(keyword);
      }
    });
  });
  
  return found;
}

/**
 * Extract objects/subjects from text
 * @param {string} text - Normalized text
 * @returns {Array} - List of objects mentioned
 */
function extractObjects(text) {
  const objects = [];
  const objectKeywords = [
    'phone', 'mobile', 'money', 'cash', 'wallet', 'purse',
    'bike', 'car', 'vehicle', 'jewellery', 'jewelry', 'gold',
    'laptop', 'watch', 'bag', 'property', 'house', 'document',
    'girl', 'woman', 'boy', 'man', 'child', 'person',
    'video', 'photo', 'image', 'camera', 'number plate'
  ];
  
  objectKeywords.forEach(obj => {
    if (text.includes(obj)) {
      objects.push(obj);
    }
  });
  
  return objects;
}

/**
 * Check if text mentions location/place
 * @param {string} text - Normalized text
 * @returns {Object} - Location context
 */
function extractLocationContext(text) {
  return {
    house: text.includes('house') || text.includes('home') || text.includes('residence'),
    public: text.includes('public') || text.includes('road') || text.includes('street'),
    workplace: text.includes('office') || text.includes('workplace') || text.includes('work'),
    online: text.includes('online') || text.includes('internet') || text.includes('cyber')
  };
}

/**
 * Detect if input is a section search (number or name)
 * @param {string} text - User input
 * @returns {Object} - Section search info
 */
function detectSectionSearch(text) {
  const trimmed = text.trim();
  
  // Check for IPC code pattern (e.g., "IPC 420", "420")
  const ipcPattern = /^(?:ipc\s*)?(\d{1,3}[a-z]?)$/i;
  const match = trimmed.match(ipcPattern);
  
  if (match) {
    return {
      isSection: true,
      type: 'code',
      value: 'IPC ' + match[1].toUpperCase()
    };
  }
  
  // Check if it's a short query (likely a section name)
  if (trimmed.split(' ').length <= 3 && trimmed.length < 30) {
    return {
      isSection: true,
      type: 'name',
      value: trimmed
    };
  }
  
  return {
    isSection: false
  };
}

module.exports = {
  normalizeText,
  extractKeywords,
  extractObjects,
  extractLocationContext,
  detectSectionSearch,
  LEGAL_KEYWORDS,
  SPELLING_CORRECTIONS
};
