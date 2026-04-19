/**
 * ====================================
 * LAYER 4: SCORING & RANKING ENGINE
 * ====================================
 * 
 * PRINCIPLES:
 * - Each rule match increases section score
 * - Stronger evidence = higher weight
 * - Remove duplicate sections
 * - Sort by relevance
 * - Return top results only
 */

const { expandWithRelated, getSectionType } = require('./sectionRelationships');

/**
 * Score boosting factors
 */
const SCORE_BOOSTERS = {
  // Boost if multiple rules match same section
  MULTIPLE_RULES: 1.5,
  
  // Boost for exact keyword matches
  EXACT_MATCH: 1.2,
  
  // Boost for weapon involvement
  WEAPON_PRESENT: 1.3,
  
  // Boost for death cases
  DEATH_INVOLVED: 1.5,
  
  // Boost for sexual offences (sensitive)
  SEXUAL_OFFENCE: 1.2,
  
  // Penalty for weak matches
  WEAK_MATCH: 0.7
};

/**
 * Aggregate scores from multiple rule matches
 * 
 * @param {Array} matches - Array of matched sections with weights
 * @returns {Object} - Aggregated scores by section code
 */
function aggregateScores(matches) {
  const scores = {};
  
  matches.forEach(match => {
    const { code, weight, reasoning, ruleId } = match;
    
    if (!scores[code]) {
      scores[code] = {
        code,
        totalScore: 0,
        ruleMatches: 0,
        reasons: [],
        ruleIds: []
      };
    }
    
    scores[code].totalScore += weight;
    scores[code].ruleMatches += 1;
    scores[code].reasons.push(reasoning);
    scores[code].ruleIds.push(ruleId);
  });
  
  return scores;
}

/**
 * Apply boosting factors based on case characteristics
 * 
 * @param {Object} scores - Aggregated scores
 * @param {Object} parsed - Parsed user input
 * @returns {Object} - Boosted scores
 */
function applyBoosters(scores, parsed) {
  Object.keys(scores).forEach(code => {
    const section = scores[code];
    
    // Boost if multiple rules matched same section
    if (section.ruleMatches > 1) {
      section.totalScore *= SCORE_BOOSTERS.MULTIPLE_RULES;
    }
    
    // Boost if weapon was present
    if (parsed.weaponDangerous) {
      // Apply to violence-related sections
      if (['IPC 302', 'IPC 307', 'IPC 324', 'IPC 326'].includes(code)) {
        section.totalScore *= SCORE_BOOSTERS.WEAPON_PRESENT;
      }
    }
    
    // Boost death cases
    if (parsed.deathOrInjury === 'death') {
      if (['IPC 302', 'IPC 304', 'IPC 304B'].includes(code)) {
        section.totalScore *= SCORE_BOOSTERS.DEATH_INVOLVED;
      }
    }
    
    // Boost sexual offences (sensitive cases)
    if (parsed.sexualElement) {
      if (code.startsWith('IPC 354') || code === 'IPC 376' || code === 'IPC 509') {
        section.totalScore *= SCORE_BOOSTERS.SEXUAL_OFFENCE;
      }
    }
  });
  
  return scores;
}

/**
 * Deduplicate and prioritize sections
 * 
 * @param {Object} scores - Section scores
 * @returns {Object} - Deduplicated scores
 */
function deduplicateSections(scores) {
  const deduped = { ...scores };
  
  // If both definition and punishment exist, keep both but note relationship
  // Example: IPC 378 (definition) and IPC 379 (punishment)
  
  // If multiple related sections exist, prioritize more specific ones
  const codes = Object.keys(deduped);
  
  // Remove very low scoring sections if better alternatives exist
  codes.forEach(code => {
    if (deduped[code].totalScore < 3 && codes.length > 5) {
      // Only remove if we have enough strong matches
      const strongMatches = codes.filter(c => deduped[c].totalScore >= 7);
      if (strongMatches.length >= 3) {
        delete deduped[code];
      }
    }
  });
  
  return deduped;
}

/**
 * Sort sections by score (descending)
 * 
 * @param {Object} scores - Section scores
 * @returns {Array} - Sorted array of section objects
 */
function sortByScore(scores) {
  return Object.values(scores).sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Get top N sections
 * 
 * @param {Array} sorted - Sorted sections
 * @param {number} limit - Maximum number to return
 * @returns {Array} - Top N sections
 */
function getTopSections(sorted, limit = 5) {
  return sorted.slice(0, limit);
}

/**
 * Add related sections to results
 * 
 * @param {Array} topSections - Top matched sections
 * @param {Object} allScores - All scores (for checking if already included)
 * @returns {Array} - Sections with related ones added
 */
function addRelatedSections(topSections, allScores) {
  const sectionCodes = topSections.map(s => s.code);
  const expanded = expandWithRelated(sectionCodes);
  
  // Add related sections that weren't already matched
  const relatedToAdd = [];
  
  expanded.forEach(code => {
    if (!sectionCodes.includes(code)) {
      // Check if this is a punishment section for a matched definition
      const sectionType = getSectionType(code);
      
      relatedToAdd.push({
        code,
        totalScore: 5, // Lower score since it's related, not directly matched
        ruleMatches: 0,
        reasons: ['Related to matched section'],
        ruleIds: [],
        isRelated: true
      });
    }
  });
  
  return [...topSections, ...relatedToAdd];
}

/**
 * Calculate confidence level for each section
 * 
 * @param {Object} section - Section with score
 * @returns {string} - Confidence level (high, medium, low)
 */
function calculateConfidence(section) {
  if (section.totalScore >= 15) return 'high';
  if (section.totalScore >= 8) return 'medium';
  return 'low';
}

/**
 * MAIN SCORING FUNCTION
 * 
 * @param {Array} ruleMatches - Matches from rule engine
 * @param {Object} parsed - Parsed user input
 * @param {number} limit - Max sections to return
 * @returns {Array} - Top scored sections with metadata
 */
function scoreAndRank(ruleMatches, parsed, limit = 5) {
  // Step 1: Aggregate scores from rule matches
  let scores = aggregateScores(ruleMatches);
  
  // Step 2: Apply boosting factors
  scores = applyBoosters(scores, parsed);
  
  // Step 3: Deduplicate
  scores = deduplicateSections(scores);
  
  // Step 4: Sort by score
  const sorted = sortByScore(scores);
  
  // Step 5: Get top N
  let topSections = getTopSections(sorted, limit);
  
  // Step 6: Add related sections (if space allows)
  if (topSections.length < limit) {
    topSections = addRelatedSections(topSections, scores);
    topSections = topSections.slice(0, limit); // Re-limit after adding related
  }
  
  // Step 7: Add confidence levels
  topSections = topSections.map(section => ({
    ...section,
    confidence: calculateConfidence(section),
    score: Math.round(section.totalScore) // Round for cleaner output
  }));
  
  return topSections;
}

/**
 * Generate scoring summary for debugging
 * 
 * @param {Array} scoredSections - Scored sections
 * @returns {Object} - Summary statistics
 */
function generateScoringSummary(scoredSections) {
  return {
    totalSections: scoredSections.length,
    highConfidence: scoredSections.filter(s => s.confidence === 'high').length,
    mediumConfidence: scoredSections.filter(s => s.confidence === 'medium').length,
    lowConfidence: scoredSections.filter(s => s.confidence === 'low').length,
    averageScore: scoredSections.reduce((sum, s) => sum + s.score, 0) / scoredSections.length,
    topScore: scoredSections.length > 0 ? scoredSections[0].score : 0
  };
}

module.exports = {
  scoreAndRank,
  aggregateScores,
  applyBoosters,
  calculateConfidence,
  generateScoringSummary,
  SCORE_BOOSTERS
};
