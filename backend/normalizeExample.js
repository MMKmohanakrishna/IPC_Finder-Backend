/**
 * ================================================
 * STANDALONE: normalizeText() & fixSpelling()
 * ================================================
 * 
 * Two clean functions for text processing in Node.js
 */

// Spelling correction dictionary
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
 * 
 * @param {string} text - Text with possible spelling mistakes
 * @returns {string} - Text with corrected spelling
 * 
 * @example
 * fixSpelling("My phone got thrift")
 * // Returns: "My phone got theft"
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
 * Normalize text - clean and standardize user input
 * 
 * Steps:
 * 1. Convert to lowercase
 * 2. Fix spelling mistakes
 * 3. Remove special characters
 * 4. Clean extra spaces
 * 
 * @param {string} text - Raw user input
 * @returns {string} - Cleaned and normalized text
 * 
 * @example
 * normalizeText("My PHONE got THRIFT!!!")
 * // Returns: "my phone got theft"
 */
function normalizeText(text) {
  if (!text) return '';
  
  // Step 1: Convert to lowercase
  let normalized = text.toLowerCase().trim();
  
  // Step 2: Fix spelling mistakes
  normalized = fixSpelling(normalized);
  
  // Step 3: Remove special characters (keep letters, numbers, spaces, ₹)
  normalized = normalized.replace(/[^a-z0-9\s₹]/g, ' ');
  
  // Step 4: Remove extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

// ============================================
// EXAMPLES & TESTS
// ============================================

if (require.main === module) {
  console.log('='.repeat(60));
  console.log('TESTING fixSpelling()');
  console.log('='.repeat(60));
  
  console.log('\n1. Simple spelling fix:');
  console.log('   Input:  "My phone got thrift"');
  console.log('   Output:', fixSpelling("My phone got thrift"));
  
  console.log('\n2. Multiple mistakes:');
  console.log('   Input:  "I payed mony in UPI scm"');
  console.log('   Output:', fixSpelling("I payed mony in UPI scm"));
  
  console.log('\n3. Case insensitive:');
  console.log('   Input:  "He THREATEN to KIL me"');
  console.log('   Output:', fixSpelling("He THREATEN to KIL me"));
  
  console.log('\n' + '='.repeat(60));
  console.log('TESTING normalizeText()');
  console.log('='.repeat(60));
  
  console.log('\n1. Lowercase + spelling + special chars:');
  console.log('   Input:  "My PHONE got THRIFT!!!"');
  console.log('   Output:', normalizeText("My PHONE got THRIFT!!!"));
  
  console.log('\n2. Extra spaces removed:');
  console.log('   Input:  "Someone    kidnaped    my child"');
  console.log('   Output:', normalizeText("Someone    kidnaped    my child"));
  
  console.log('\n3. Special characters removed:');
  console.log('   Input:  "@#$Boys hert me$%^"');
  console.log('   Output:', normalizeText("@#$Boys hert me$%^"));
  
  console.log('\n' + '='.repeat(60));
}

// Export functions
module.exports = {
  fixSpelling,
  normalizeText,
  SPELLING_CORRECTIONS
};
