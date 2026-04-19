/**
 * ================================================
 * API ENDPOINT - POST /api/classify
 * ================================================
 * 
 * Complete implementation:
 * 1. Accept text input
 * 2. Normalize text
 * 3. Apply rule engine
 * 4. Fetch sections from MongoDB
 * 5. Return JSON results
 */

const express = require('express');
const router = express.Router();
const Section = require('./models/Section'); // Adjust path as needed

// Import helper functions
const { normalizeText } = require('./utils/simpleClassifier');
const { ruleEngine } = require('./minimalRuleEngine');

/**
 * POST /api/classify
 * Classify user's legal problem and return matching IPC sections
 */
router.post('/api/classify', async (req, res) => {
  try {
    // STEP 1: Get text from request body
    const { text } = req.body;
    
    // Validate input
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid text input'
      });
    }
    
    console.log('📝 Original text:', text);
    
    // STEP 2: Normalize the text
    const cleanedText = normalizeText(text);
    console.log('🧹 Cleaned text:', cleanedText);
    
    // STEP 3: Apply rule engine to get IPC section codes
    const sectionCodes = ruleEngine(cleanedText);
    console.log('⚖️  Matched sections:', sectionCodes);
    
    // Check if any sections matched
    if (sectionCodes.length === 0) {
      return res.json({
        success: true,
        count: 0,
        results: [],
        message: 'No matching IPC sections found. Try providing more details.'
      });
    }
    
    // STEP 4: Fetch full section details from MongoDB
    const sections = await Section.find({
      code: { $in: sectionCodes }
    });
    
    console.log('💾 Found in DB:', sections.length, 'sections');
    
    // STEP 5: Return results as JSON
    res.json({
      success: true,
      count: sections.length,
      results: sections,
      input: {
        original: text,
        normalized: cleanedText
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request',
      error: error.message
    });
  }
});

module.exports = router;
