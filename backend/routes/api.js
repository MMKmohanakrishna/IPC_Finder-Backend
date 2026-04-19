const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const Mapping = require('../models/Mapping');
const Query = require('../models/Query');

/**
 * ================================================
 * AI + RULES HYBRID SYSTEM FOR IPC FINDER
 * ================================================
 * 
 * Layer 1: AI Language Understanding (aiParser)
 * Layer 2: Legal Rule Engine (ruleEngine)
 * Layer 3: Section Relationships (sectionRelationships)
 * Layer 4: Scoring & Ranking (scoringEngine)
 * Layer 5: Output Formatting (outputFormatter)
 * 
 * CRITICAL: AI NEVER decides IPC sections
 * Only rules make legal determinations
 */

// Import 5-layer hybrid system
const { parseUserInput, validateOutput } = require('../utils/aiParser');
const { applyRules } = require('../utils/ruleEngine');
const { expandWithRelated } = require('../utils/sectionRelationships');
const { scoreAndRank, generateScoringSummary } = require('../utils/scoringEngine');
const { 
  fetchSectionDetails, 
  generateOutput, 
  formatError, 
  formatNoResults,
  generateDebugInfo 
} = require('../utils/outputFormatter');

/**
 * ================================================
 * POST /api/classify - HYBRID AI + RULES SYSTEM
 * ================================================
 * 
 * 5-LAYER ARCHITECTURE:
 * Layer 1: AI parses language (NO legal decisions)
 * Layer 2: Rules determine IPC sections (deterministic)
 * Layer 3: Relationships auto-expand related sections
 * Layer 4: Scoring ranks by relevance
 * Layer 5: Output formats user-friendly response
 * 
 * Input: { text: "user problem description" }
 * Output: Matched IPC sections with explanations
 */
router.post('/classify', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { text, debug } = req.body;

    // Validate input
    if (!text || text.trim().length === 0) {
      return res.status(400).json(formatError('Please provide a problem description'));
    }

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   IPC FINDER - AI + RULES HYBRID SYSTEM   ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('📝 User Input:', text);
    console.log('');
    
    // ============================================
    // LAYER 1: AI LANGUAGE UNDERSTANDING
    // ============================================
    console.log('🔍 LAYER 1: AI Language Understanding...');
    const parsed = parseUserInput(text);
    validateOutput(parsed); // Ensure AI didn't suggest IPC sections
    
    console.log('   ✓ Normalized:', parsed.normalizedText);
    console.log('   ✓ Category:', parsed.offenceCategory);
    console.log('   ✓ Intent:', parsed.intent);
    console.log('   ✓ Actions:', Object.keys(parsed.actions).filter(k => parsed.actions[k].length > 0));
    console.log('   ✓ Objects:', parsed.objects);
    console.log('');
    
    // ============================================
    // LAYER 2: LEGAL RULE ENGINE
    // ============================================
    console.log('⚖️  LAYER 2: Applying Legal Rules...');
    const ruleMatches = applyRules(parsed);
    
    console.log(`   ✓ ${ruleMatches.length} rule matches found`);
    ruleMatches.forEach(match => {
      console.log(`   • ${match.code}: ${match.reasoning} (weight: ${match.weight})`);
    });
    console.log('');
    
    // Check if any rules matched
    if (ruleMatches.length === 0) {
      console.log('⚠️  No rules matched. Returning suggestions...');
      return res.json(formatNoResults(parsed));
    }
    
    // ============================================
    // LAYER 3: SECTION RELATIONSHIPS
    // ============================================
    console.log('🔗 LAYER 3: Expanding with Related Sections...');
    // This happens inside scoring engine
    
    // ============================================
    // LAYER 4: SCORING & RANKING
    // ============================================
    console.log('📊 LAYER 4: Scoring and Ranking...');
    const scoredSections = scoreAndRank(ruleMatches, parsed, 5);
    
    const summary = generateScoringSummary(scoredSections);
    console.log(`   ✓ Top ${scoredSections.length} sections selected`);
    console.log(`   ✓ High confidence: ${summary.highConfidence}`);
    console.log(`   ✓ Average score: ${summary.averageScore.toFixed(1)}`);
    console.log('');
    
    scoredSections.forEach(section => {
      console.log(`   ${section.code}: Score=${section.score}, Confidence=${section.confidence}`);
    });
    console.log('');
    
    // ============================================
    // LAYER 5: OUTPUT FORMATTING
    // ============================================
    console.log('📄 LAYER 5: Formatting Output...');
    const sectionDetails = await fetchSectionDetails(scoredSections);
    
    console.log(`   ✓ Fetched ${sectionDetails.length} section details from database`);
    console.log('');
    
    if (sectionDetails.length === 0) {
      return res.json(formatNoResults(parsed));
    }
    
    const output = generateOutput(sectionDetails, parsed);
    
    // Add debug info if requested
    if (debug === true) {
      output.debug = generateDebugInfo(parsed, ruleMatches, scoredSections);
    }
    
    // Save query for analytics
    await Query.create({
      userText: text,
      matchedSections: sectionDetails.map(s => ({
        sectionCode: s.code,
        score: s.matchInfo.score
      }))
    });
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Processing completed in ${processingTime}ms`);
    console.log('═══════════════════════════════════════════\n');
    
    // Return final output
    res.json({
      ...output,
      processingTime: `${processingTime}ms`
    });

  } catch (error) {
    console.error('❌ Classification error:', error);
    res.status(500).json(formatError('Error processing your request. Please try again.'));
  }
});

/**
 * GET /api/section-search?q=searchTerm
 * Searches for IPC section by code or name
 * 
 * Input: query parameter 'q' (e.g., "IPC 420" or "Cheating")
 * Output: Section details
 */
router.get('/section-search', async (req, res) => {
  try {
    const { q } = req.query;

    // Validate input
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search term'
      });
    }

    const searchTerm = q.trim();
    
    // Try to find section by exact code match first (case-insensitive)
    let section = await Section.findOne({ 
      code: new RegExp(`^${searchTerm}$`, 'i') 
    });

    // If not found by code, try searching by name or keywords
    if (!section) {
      section = await Section.findOne({
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { keywords: new RegExp(searchTerm, 'i') }
        ]
      });
    }

    // If still not found, try text search
    if (!section) {
      const sections = await Section.find(
        { $text: { $search: searchTerm } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } }).limit(1);
      
      if (sections.length > 0) {
        section = sections[0];
      }
    }

    // Return result or not found message
    if (section) {
      res.json({
        success: true,
        section: {
          code: section.code,
          name: section.name,
          simpleMeaning: section.simpleMeaning,
          usedWhen: section.usedWhen,
          examples: section.examples,
          punishment: section.punishment,
          firPossible: section.firPossible
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No matching IPC section found. Please try a different search term.'
      });
    }

  } catch (error) {
    console.error('Section search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your search. Please try again.'
    });
  }
});

/**
 * ================================================
 * POST /api/classify-simple - SIMPLE KEYWORD-BASED SYSTEM
 * ================================================
 * 
 * BEGINNER-FRIENDLY CLASSIFIER
 * - Simple keyword matching
 * - Easy to understand and modify
 * - Generic rules (not hardcoded)
 * - AI used ONLY for text normalization
 * 
 * Input: { text: "user problem description" }
 * Output: Matched IPC sections with reasoning
 */

// Import simple classifier
const simpleClassifier = require('../utils/simpleClassifier');

router.post('/classify-simple', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Validate input
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid problem description'
      });
    }
    
    console.log('\n=== SIMPLE CLASSIFIER API ===');
    console.log('User input:', text);
    
    // Use simple classifier
    const result = await simpleClassifier.classifySimple(text, Section);
    
    // Save query
    await Query.create({
      text: text,
      results: result.results || [],
      method: 'simple-classifier'
    });
    
    console.log('Results:', result.count, 'sections');
    
    res.json(result);
    
  } catch (error) {
    console.error('Simple classifier API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request',
      error: error.message
    });
  }
});

/**
 * GET /api/sections
 * Returns all IPC sections (for browsing)
 */
router.get('/sections', async (req, res) => {
  try {
    const sections = await Section.find({}).sort({ code: 1 });
    
    res.json({
      success: true,
      count: sections.length,
      sections: sections
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sections'
    });
  }
});

module.exports = router;
