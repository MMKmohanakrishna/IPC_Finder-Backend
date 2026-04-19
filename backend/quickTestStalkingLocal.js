const { parseUserInput } = require('./utils/aiParser');
const { applyRules } = require('./utils/ruleEngine');

const text = 'A man keeps following me and calling me even after I told him to stop.';
console.log('\nInput:', text, '\n');
const parsed = parseUserInput(text);
console.log('normalizedText:', parsed.normalizedText);
console.log('offenceCategory:', parsed.offenceCategory);
console.log('actions:', parsed.actions);

const matches = applyRules(parsed);
console.log('\nRule matches count:', matches.length);
matches.forEach(m => console.log(' -', m.code, m.ruleId, m.reasoning));

if (matches.length === 0) process.exit(2);
else process.exit(0);
