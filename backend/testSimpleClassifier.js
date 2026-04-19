/**
 * ====================================
 * SIMPLE CLASSIFIER TEST SCRIPT
 * ====================================
 * 
 * Test the beginner-friendly keyword-based classifier
 * Shows how text normalization and rules work
 */

const simpleClassifier = require('./utils/simpleClassifier');

// Test cases with poor English and spelling mistakes
const testCases = [
  "My phone got thrift",                    // Theft with spelling mistake
  "Someone scammed me in fake lottry",      // Fraud with spelling mistake
  "He threaten to kil me",                  // Threat with spelling mistakes
  "Boys hert me and pushed me",             // Assault with spelling mistake
  "I paid rs 50000 in upi scm",            // Fraud with money
  "Husband is torturing for dowry",         // Dowry harassment
  "Someone kidnaped my child",              // Kidnapping with spelling mistake
  "He shot my brother ded",                 // Murder with spelling mistake
  "Boys made dirty comments on road",       // Sexual harassment
  "He took my bag and ran away"             // Theft
];

console.log('='.repeat(60));
console.log('SIMPLE CLASSIFIER DEMONSTRATION');
console.log('='.repeat(60));

console.log('\n📚 STEP 1: SPELLING CORRECTIONS');
console.log('-'.repeat(60));
console.log('Available corrections:');
Object.entries(simpleClassifier.SPELLING_CORRECTIONS).slice(0, 10).forEach(([wrong, correct]) => {
  console.log(`  ${wrong} → ${correct}`);
});
console.log(`  ... and ${Object.keys(simpleClassifier.SPELLING_CORRECTIONS).length - 10} more`);

console.log('\n🔑 STEP 2: KEYWORD GROUPS');
console.log('-'.repeat(60));
Object.entries(simpleClassifier.KEYWORD_GROUPS).forEach(([category, keywords]) => {
  console.log(`  ${category}: ${keywords.slice(0, 5).join(', ')}${keywords.length > 5 ? '...' : ''}`);
});

console.log('\n⚖️  STEP 3: GENERIC RULES');
console.log('-'.repeat(60));
console.log(`Total rules: ${simpleClassifier.GENERIC_RULES.length}`);
simpleClassifier.GENERIC_RULES.slice(0, 5).forEach(rule => {
  console.log(`  ${rule.id}: ${rule.sections.join(', ')} - ${rule.reasoning}`);
});
console.log(`  ... and ${simpleClassifier.GENERIC_RULES.length - 5} more rules`);

console.log('\n🧪 STEP 4: TESTING');
console.log('-'.repeat(60));

// Test each case
testCases.forEach((testText, index) => {
  console.log(`\nTest ${index + 1}: "${testText}"`);
  console.log('-'.repeat(60));
  
  // Step 1: Normalize
  const normalized = simpleClassifier.normalizeText(testText);
  console.log(`  Normalized: "${normalized}"`);
  
  // Step 2: Detect keywords
  const flags = simpleClassifier.detectKeywordMatches(normalized);
  const activeFlags = Object.entries(flags)
    .filter(([key, value]) => value === true && key !== 'text')
    .map(([key]) => key);
  console.log(`  Detected: ${activeFlags.join(', ') || 'none'}`);
  
  // Step 3: Apply rules
  const matches = simpleClassifier.applyRules(normalized);
  console.log(`  Rules matched: ${matches.length}`);
  
  // Step 4: Show results
  const scored = simpleClassifier.scoreMatches(matches);
  if (scored.length > 0) {
    console.log(`  ✅ IPC Sections:`);
    scored.forEach(item => {
      console.log(`     ${item.code} (score: ${item.totalScore}) - ${item.reasons[0]}`);
    });
  } else {
    console.log(`  ❌ No matches`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('✅ SIMPLE CLASSIFIER TEST COMPLETE');
console.log('='.repeat(60));
console.log('\nNOTE: This classifier uses generic rules, not hardcoded logic.');
console.log('You can easily add more keywords and rules in simpleClassifier.js\n');
