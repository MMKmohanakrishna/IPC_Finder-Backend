/**
 * ================================================
 * COMPLETE API SERVER - IPC Classifier
 * ================================================
 * 
 * Includes:
 * - POST /api/classify endpoint
 * - Text normalization
 * - Rule engine
 * - MongoDB integration
 */

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// ================================================
// MONGOOSE SCHEMA
// ================================================

const sectionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  purpose: {
    type: String,
    required: true
  },
  punishment: {
    type: String,
    required: true
  },
  firPossible: {
    type: String,
    required: true,
    enum: ['Yes', 'No', 'Depends']
  }
});

const Section = mongoose.model('Section', sectionSchema);

// ================================================
// HELPER FUNCTIONS
// ================================================

// Text normalization
const SPELLING_CORRECTIONS = {
  'thrift': 'theft',
  'theif': 'thief',
  'stole': 'stolen',
  'scm': 'scam',
  'lottry': 'lottery',
  'threaten': 'threatened',
  'kil': 'kill',
  'kidnaped': 'kidnapped',
  'hert': 'hurt',
  'payed': 'paid',
  'mony': 'money'
};

function fixSpelling(text) {
  if (!text) return '';
  let corrected = text;
  Object.keys(SPELLING_CORRECTIONS).forEach(mistake => {
    const regex = new RegExp(`\\b${mistake}\\b`, 'gi');
    corrected = corrected.replace(regex, SPELLING_CORRECTIONS[mistake]);
  });
  return corrected;
}

function normalizeText(text) {
  if (!text) return '';
  let normalized = text.toLowerCase().trim();
  normalized = fixSpelling(normalized);
  normalized = normalized.replace(/[^a-z0-9\s₹]/g, ' ');
  normalized = normalized.replace(/\s+/g, ' ').trim();
  return normalized;
}

// Rule engine
const THEFT_KEYWORDS = ['theft', 'stolen', 'stole', 'snatched', 'robbed', 'robbery'];
const FRAUD_KEYWORDS = ['fraud', 'scam', 'cheated', 'fake', 'lottery', 'upi'];
const MONEY_KEYWORDS = ['₹', 'rs', 'rupees', 'money', 'paid', 'cash', 'amount'];
const THREAT_KEYWORDS = ['threatened', 'threat', 'kill', 'harm', 'blackmail'];
const ASSAULT_KEYWORDS = ['hit', 'beat', 'slapped', 'punched', 'kicked', 'pushed', 'attack'];

function hasKeyword(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

function ruleEngine(cleanedText) {
  const sections = [];
  
  // Rule 1: Theft
  if (hasKeyword(cleanedText, THEFT_KEYWORDS)) {
    sections.push('IPC 378');
    sections.push('IPC 379');
  }
  
  // Rule 2: Fraud
  const hasFraud = hasKeyword(cleanedText, FRAUD_KEYWORDS);
  const hasMoney = hasKeyword(cleanedText, MONEY_KEYWORDS);
  
  if (hasFraud && hasMoney) {
    sections.push('IPC 415');
    sections.push('IPC 420');
  } else if (hasFraud) {
    sections.push('IPC 420');
  }
  
  // Rule 3: Threat
  if (hasKeyword(cleanedText, THREAT_KEYWORDS)) {
    sections.push('IPC 506');
  }
  
  // Rule 4: Assault
  if (hasKeyword(cleanedText, ASSAULT_KEYWORDS)) {
    sections.push('IPC 323');
    sections.push('IPC 352');
  }
  
  return [...new Set(sections)];
}

// ================================================
// API ENDPOINT
// ================================================

/**
 * POST /api/classify
 * Classify legal problem and return matching IPC sections
 */
app.post('/api/classify', async (req, res) => {
  try {
    // STEP 1: Get text from request
    const { text } = req.body;
    
    // Validate input
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid text input'
      });
    }
    
    console.log('\n📝 Original:', text);
    
    // STEP 2: Normalize text
    const cleanedText = normalizeText(text);
    console.log('🧹 Cleaned:', cleanedText);
    
    // STEP 3: Apply rule engine
    const sectionCodes = ruleEngine(cleanedText);
    console.log('⚖️  Rules matched:', sectionCodes);
    
    if (sectionCodes.length === 0) {
      return res.json({
        success: true,
        count: 0,
        results: [],
        message: 'No matching IPC sections found'
      });
    }
    
    // STEP 4: Fetch from MongoDB
    const sections = await Section.find({
      code: { $in: sectionCodes }
    });
    
    console.log('💾 DB results:', sections.length, 'sections');
    
    // STEP 5: Return JSON
    res.json({
      success: true,
      count: sections.length,
      results: sections,
      input: {
        original: text,
        normalized: cleanedText,
        matchedCodes: sectionCodes
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error processing request',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ================================================
// START SERVER
// ================================================

async function startServer() {
  try {
    // Connect to MongoDB
    const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/ipc-finder';
    await mongoose.connect(DB_URL, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB');
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`\n📌 Test with:`);
      console.log(`   POST http://localhost:${PORT}/api/classify`);
      console.log(`   Body: { "text": "My phone got thrift" }\n`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('💡 Ensure MongoDB is running or set MONGODB_URI in .env');
    }
    process.exit(1);
  }
}

// Run server
if (require.main === module) {
  startServer();
}

module.exports = app;
