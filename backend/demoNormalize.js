/**
 * ====================================
 * DEMO: normalizeText() and fixSpelling()
 * ====================================
 */

const { normalizeText, fixSpelling, SPELLING_CORRECTIONS } = require('./utils/simpleClassifier');

console.log('═'.repeat(70));
console.log('NORMALIZE TEXT & FIX SPELLING - DEMO');
console.log('═'.repeat(70));

// Show available spelling corrections
console.log('\n📚 Available Spelling Corrections:');
console.log('-'.repeat(70));
Object.entries(SPELLING_CORRECTIONS).forEach(([wrong, correct]) => {
  console.log(`  ${wrong.padEnd(15)} → ${correct}`);
});

console.log('\n');
console.log('═'.repeat(70));
console.log('TESTING fixSpelling() FUNCTION');
console.log('═'.repeat(70));

const spellingTests = [
  "My phone got thrift",
  "Someone scammed me in fake lottry",
  "He threaten to kil me",
  "Boys hert me and pushed me",
  "I payed mony in UPI scm",
  "Husband is torturing for dowry",
  "Someone kidnaped my child",
  "He shot my brother ded",
  "Theif stole my bag"
];

spellingTests.forEach((text, index) => {
  console.log(`\nTest ${index + 1}:`);
  console.log(`  Original: "${text}"`);
  console.log(`  Fixed:    "${fixSpelling(text)}"`);
});

console.log('\n');
console.log('═'.repeat(70));
console.log('TESTING normalizeText() FUNCTION');
console.log('═'.repeat(70));
console.log('\nThis function does 4 things:');
console.log('  1. Convert to lowercase');
console.log('  2. Fix spelling mistakes');
console.log('  3. Remove special characters');
console.log('  4. Clean extra spaces');

const normalizeTests = [
  "My PHONE got THRIFT!!!",
  "I paid Rs. 50,000 in UPI scm",
  "He threaten to KIL me!!!",
  "Someone    kidnaped    my child",
  "@#$Boys hert me and pushed me$%^",
  "Husband   is   torturing   for   dowry"
];

normalizeTests.forEach((text, index) => {
  console.log(`\nTest ${index + 1}:`);
  console.log(`  Original:   "${text}"`);
  console.log(`  Normalized: "${normalizeText(text)}"`);
});

console.log('\n');
console.log('═'.repeat(70));
console.log('STEP-BY-STEP BREAKDOWN');
console.log('═'.repeat(70));

const sampleText = "My PHONE got THRIFT!!!";
console.log(`\nOriginal Text: "${sampleText}"`);
console.log('-'.repeat(70));

// Step 1: Lowercase
const step1 = sampleText.toLowerCase().trim();
console.log(`Step 1 - Lowercase:        "${step1}"`);

// Step 2: Fix spelling
const step2 = fixSpelling(step1);
console.log(`Step 2 - Fix Spelling:     "${step2}"`);

// Step 3: Remove special chars
const step3 = step2.replace(/[^a-z0-9\s₹]/g, ' ');
console.log(`Step 3 - Remove Special:   "${step3}"`);

// Step 4: Clean spaces
const step4 = step3.replace(/\s+/g, ' ').trim();
console.log(`Step 4 - Clean Spaces:     "${step4}"`);

// Compare with normalizeText()
const final = normalizeText(sampleText);
console.log(`\nFinal (normalizeText):     "${final}"`);
console.log(`Match: ${step4 === final ? '✅' : '❌'}`);

console.log('\n');
console.log('═'.repeat(70));
console.log('USAGE EXAMPLES');
console.log('═'.repeat(70));

console.log(`
// Example 1: Fix spelling only
const fixSpelling = require('./utils/simpleClassifier').fixSpelling;
const fixed = fixSpelling("My phone got thrift");
console.log(fixed); // "My phone got theft"

// Example 2: Full normalization
const normalizeText = require('./utils/simpleClassifier').normalizeText;
const normalized = normalizeText("My PHONE got THRIFT!!!");
console.log(normalized); // "my phone got theft"

// Example 3: Check available corrections
const { SPELLING_CORRECTIONS } = require('./utils/simpleClassifier');
console.log(SPELLING_CORRECTIONS.thrift); // "theft"
`);

console.log('═'.repeat(70));
console.log('✅ DEMO COMPLETE');
console.log('═'.repeat(70));
console.log('\nBoth functions are now available in utils/simpleClassifier.js');
console.log('Use fixSpelling() for spelling corrections only');
console.log('Use normalizeText() for complete text cleaning\n');
