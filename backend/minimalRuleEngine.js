/**
 * ================================================
 * MINIMAL RULE ENGINE - Beginner Version
 * ================================================
 * 
 * Clean, simple function that accepts text
 * and returns IPC section codes based on keywords.
 */

// ================================================
// STEP 1: Define keyword arrays
// ================================================

const THEFT_KEYWORDS = ['theft', 'stolen', 'stole', 'snatched', 'robbed', 'robbery'];
const FRAUD_KEYWORDS = ['fraud', 'scam', 'cheated', 'fake', 'lottery', 'upi'];
const MONEY_KEYWORDS = ['₹', 'rs', 'rupees', 'money', 'paid', 'cash', 'amount'];
const THREAT_KEYWORDS = ['threatened', 'threat', 'kill', 'harm', 'blackmail'];
const ASSAULT_KEYWORDS = ['hit', 'beat', 'slapped', 'punched', 'kicked', 'pushed', 'attack'];

// ================================================
// STEP 2: Helper function to check keywords
// ================================================

function hasKeyword(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

// ================================================
// STEP 3: Main rule engine function
// ================================================

function ruleEngine(cleanedText) {
  const sections = [];
  
  // Rule 1: Theft → IPC 378, IPC 379
  if (hasKeyword(cleanedText, THEFT_KEYWORDS)) {
    sections.push('IPC 378'); // Theft definition
    sections.push('IPC 379'); // Theft punishment
  }
  
  // Rule 2: Fraud with money → IPC 415, IPC 420
  const hasFraud = hasKeyword(cleanedText, FRAUD_KEYWORDS);
  const hasMoney = hasKeyword(cleanedText, MONEY_KEYWORDS);
  
  if (hasFraud && hasMoney) {
    sections.push('IPC 415'); // Cheating
    sections.push('IPC 420'); // Cheating with property
  } else if (hasFraud) {
    sections.push('IPC 420'); // Cheating only
  }
  
  // Rule 3: Threat → IPC 506
  if (hasKeyword(cleanedText, THREAT_KEYWORDS)) {
    sections.push('IPC 506'); // Criminal intimidation
  }
  
  // Rule 4: Assault → IPC 323, IPC 352
  if (hasKeyword(cleanedText, ASSAULT_KEYWORDS)) {
    sections.push('IPC 323'); // Causing hurt
    sections.push('IPC 352'); // Assault
  }
  
  return sections;
}

// ================================================
// TESTING
// ================================================

console.log('RULE ENGINE - QUICK TEST\n');

// Test 1
console.log('Test 1: "my phone got theft"');
console.log('Result:', ruleEngine('my phone got theft'));
console.log('Expected: IPC 378, IPC 379\n');

// Test 2
console.log('Test 2: "i paid rs 5000 in lottery scam"');
console.log('Result:', ruleEngine('i paid rs 5000 in lottery scam'));
console.log('Expected: IPC 415, IPC 420\n');

// Test 3
console.log('Test 3: "he threatened to kill me"');
console.log('Result:', ruleEngine('he threatened to kill me'));
console.log('Expected: IPC 506\n');

// Test 4
console.log('Test 4: "boys hit me"');
console.log('Result:', ruleEngine('boys hit me'));
console.log('Expected: IPC 323, IPC 352\n');

// Export
module.exports = { ruleEngine };
