/**
 * ====================================
 * LAYER 5: OUTPUT FORMATTER
 * ====================================
 * 
 * PRINCIPLES:
 * - User-friendly language (no legal jargon)
 * - Clear, simple explanations
 * - Actionable information
 * - Proper disclaimers
 */

const Section = require('../models/Section');

/**
 * Format single section for user output
 * 
 * @param {Object} section - Section from database
 * @param {Object} scoreData - Score and reasoning data
 * @returns {Object} - Formatted section
 */
function formatSection(section, scoreData) {
  return {
    code: section.code,
    name: section.name,
    
    // Simplified explanation
    purpose: section.simpleMeaning,
    
    // When this section applies
    usedWhen: section.usedWhen,
    
    // Examples in simple language
    examples: section.examples,
    
    // Punishment info
    punishment: section.punishment,
    
    // Can FIR be filed?
    firPossible: section.firPossible,
    
    // Match metadata
    matchInfo: {
      confidence: scoreData.confidence,
      score: scoreData.score,
      reasoning: scoreData.reasons[0] || 'Pattern match',
      isRelated: scoreData.isRelated || false
    }
  };
}

/**
 * Fetch section details from database
 * 
 * @param {Array} scoredSections - Sections with scores
 * @returns {Array} - Sections with full database details
 */
async function fetchSectionDetails(scoredSections) {
  const results = [];
  
  for (const scored of scoredSections) {
    try {
      const section = await Section.findOne({ code: scored.code });
      
      if (section) {
        const formatted = formatSection(section, scored);
        results.push(formatted);
      } else {
        console.warn(`Section ${scored.code} not found in database`);
      }
    } catch (error) {
      console.error(`Error fetching section ${scored.code}:`, error.message);
    }
  }
  
  return results;
}

/**
 * Generate user-friendly output
 * 
 * @param {Array} sections - Formatted sections
 * @param {Object} parsed - Parsed user input (for context)
 * @returns {Object} - Final JSON output
 */
function generateOutput(sections, parsed) {
  return {
    success: true,
    
    // Analysis summary
    summary: {
      problemType: parsed.offenceCategory,
      totalSections: sections.length,
      highConfidenceCount: sections.filter(s => s.matchInfo.confidence === 'high').length
    },
    
    // Matched sections
    sections: sections,
    
    // Important disclaimer
    disclaimer: 'This system provides general legal information only, NOT legal advice. Always consult a qualified lawyer for your specific case.',
    
    // Next steps
    nextSteps: generateNextSteps(sections, parsed)
  };
}

/**
 * Generate suggested next steps based on matched sections
 * 
 * @param {Array} sections - Matched sections
 * @param {Object} parsed - Parsed input
 * @returns {Array} - Suggested actions
 */
function generateNextSteps(sections, parsed) {
  const steps = [];
  
  // Check if serious offence
  const seriousOffences = ['IPC 302', 'IPC 307', 'IPC 376', 'IPC 304B'];
  const hasSeriousOffence = sections.some(s => seriousOffences.includes(s.code));
  
  if (hasSeriousOffence) {
    steps.push('⚠️ This appears to be a serious offence. Report to police immediately.');
    steps.push('📞 Call emergency helpline: 100 (Police) or 112 (Emergency)');
  }
  
  // Check if FIR can be filed
  const canFileFIR = sections.some(s => s.firPossible === 'Yes');
  if (canFileFIR) {
    steps.push('📝 You can file an FIR (First Information Report) at your nearest police station');
  }
  
  // Women-specific helplines
  const womenOffences = sections.some(s => 
    s.code.startsWith('IPC 354') || 
    s.code === 'IPC 376' || 
    s.code === 'IPC 498A' ||
    s.code === 'IPC 304B'
  );
  
  if (womenOffences) {
    steps.push('👩 Women Helpline: 1091 or 181');
    steps.push('🆘 Women in Distress: Call 1091 for immediate assistance');
  }
  
  // General advice
  steps.push('⚖️ Consult a lawyer to understand your legal options');
  steps.push('📋 Preserve all evidence (messages, photos, videos, documents)');
  
  return steps;
}

/**
 * Format error response
 * 
 * @param {string} message - Error message
 * @returns {Object} - Error response
 */
function formatError(message) {
  return {
    success: false,
    error: message,
    sections: [],
    disclaimer: 'This system provides general legal information only, NOT legal advice.'
  };
}

/**
 * Format "no results" response
 * 
 * @param {Object} parsed - Parsed input
 * @returns {Object} - No results response
 */
function formatNoResults(parsed) {
  return {
    success: true,
    summary: {
      problemType: parsed.offenceCategory,
      totalSections: 0,
      message: 'No specific IPC sections matched. Try providing more details.'
    },
    sections: [],
    disclaimer: 'This system provides general legal information only, NOT legal advice.',
    suggestions: [
      'Try describing the incident in more detail',
      'Mention specific actions (e.g., "stole my phone", "threatened me")',
      'Include relevant objects or weapons if any',
      'Specify if anyone was hurt or if property was damaged'
    ],
    helplines: [
      'Police Emergency: 100',
      'General Emergency: 112',
      'Women Helpline: 1091',
      'Legal Aid: Contact your nearest legal aid center'
    ]
  };
}

/**
 * Generate debug info (only in development)
 * 
 * @param {Object} parsed - Parsed input
 * @param {Array} ruleMatches - Rule matches
 * @param {Array} scoredSections - Scored sections
 * @returns {Object} - Debug information
 */
function generateDebugInfo(parsed, ruleMatches, scoredSections) {
  return {
    parsing: {
      normalizedText: parsed.normalizedText,
      intent: parsed.intent,
      category: parsed.offenceCategory,
      actions: parsed.actions,
      objects: parsed.objects
    },
    ruleMatches: ruleMatches.length,
    scoredSections: scoredSections.map(s => ({
      code: s.code,
      score: s.score,
      confidence: s.confidence,
      ruleIds: s.ruleIds
    }))
  };
}

module.exports = {
  formatSection,
  fetchSectionDetails,
  generateOutput,
  formatError,
  formatNoResults,
  generateDebugInfo,
  generateNextSteps
};
