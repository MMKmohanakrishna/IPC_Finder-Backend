// Validate all modules can be loaded
console.log('Checking if all modules load correctly...\n');

try {
  console.log('1. Loading aiParser...');
  const aiParser = require('./utils/aiParser');
  console.log('   ✅ aiParser loaded');
  
  console.log('2. Loading ruleEngine...');
  const ruleEngine = require('./utils/ruleEngine');
  console.log('   ✅ ruleEngine loaded');
  
  console.log('3. Loading sectionRelationships...');
  const relationships = require('./utils/sectionRelationships');
  console.log('   ✅ sectionRelationships loaded');
  
  console.log('4. Loading scoringEngine...');
  const scoring = require('./utils/scoringEngine');
  console.log('   ✅ scoringEngine loaded');
  
  console.log('5. Loading outputFormatter...');
  const formatter = require('./utils/outputFormatter');
  console.log('   ✅ outputFormatter loaded');
  
  console.log('\n✅ All modules loaded successfully!');
  console.log('\nTesting basic functionality...\n');
  
  // Test aiParser
  console.log('Testing aiParser with "My phone got thrift":');
  const parsed = aiParser.parseUserInput('My phone got thrift');
  console.log('  Normalized:', parsed.normalizedText);
  console.log('  Category:', parsed.offenceCategory);
  console.log('  Intent:', parsed.intent);
  
  // Test ruleEngine
  console.log('\nTesting ruleEngine:');
  const matches = ruleEngine.applyRules(parsed);
  console.log('  Matched sections:', matches.length);
  matches.forEach(m => console.log(`    - ${m.code}: ${m.reasoning}`));
  
  console.log('\n✅ All tests passed!');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
