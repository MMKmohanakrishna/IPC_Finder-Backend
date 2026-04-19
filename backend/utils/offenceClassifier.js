/**
 * Offence Classification Utility
 * Classifies legal problems into categories based on keywords and context
 */

/**
 * STEP 3: Classify offence type
 * @param {Object} keywords - Extracted keywords by category
 * @param {Array} objects - Extracted objects
 * @returns {Object} - Offence classification with confidence
 */
function classifyOffence(keywords, objects) {
  const classifications = [];
  
  // PROPERTY OFFENCES
  if (keywords.property.length > 0) {
    const score = keywords.property.length * 2 + 
                  (keywords.actions.length > 0 ? 1 : 0);
    
    classifications.push({
      category: 'PROPERTY_OFFENCE',
      confidence: score,
      indicators: keywords.property
    });
  }
  
  // OFFENCES AGAINST PERSON
  if (keywords.person.length > 0) {
    const score = keywords.person.length * 2 +
                  (keywords.weapons.length > 0 ? 2 : 0);
    
    classifications.push({
      category: 'OFFENCE_AGAINST_PERSON',
      confidence: score,
      indicators: keywords.person
    });
  }
  
  // SEXUAL OFFENCES
  if (keywords.sexual.length > 0) {
    const score = keywords.sexual.length * 3; // Higher weight for sexual crimes
    
    classifications.push({
      category: 'SEXUAL_OFFENCE',
      confidence: score,
      indicators: keywords.sexual
    });
  }
  
  // THREAT / INTIMIDATION
  if (keywords.threat.length > 0) {
    const score = keywords.threat.length * 2;
    
    classifications.push({
      category: 'THREAT_INTIMIDATION',
      confidence: score,
      indicators: keywords.threat
    });
  }
  
  // FAMILY / DOWRY OFFENCES
  if (keywords.family.length > 0) {
    const score = keywords.family.length * 2 +
                  (keywords.person.length > 0 ? 1 : 0);
    
    classifications.push({
      category: 'FAMILY_OFFENCE',
      confidence: score,
      indicators: keywords.family
    });
  }
  
  // CYBER / PRIVACY CRIMES
  const cyberIndicators = ['video', 'photo', 'camera', 'online', 'internet'];
  const cyberScore = objects.filter(obj => cyberIndicators.includes(obj)).length;
  
  if (cyberScore > 0 || keywords.actions.some(a => ['sent', 'shared', 'posted'].includes(a))) {
    classifications.push({
      category: 'CYBER_PRIVACY',
      confidence: cyberScore * 2,
      indicators: objects.filter(obj => cyberIndicators.includes(obj))
    });
  }
  
  // Sort by confidence
  classifications.sort((a, b) => b.confidence - a.confidence);
  
  return classifications.length > 0 ? classifications : [{
    category: 'GENERAL',
    confidence: 0,
    indicators: []
  }];
}

/**
 * Determine specific offence sub-types
 * @param {string} category - Main category
 * @param {Object} keywords - Keywords object
 * @param {Array} objects - Objects mentioned
 * @returns {Array} - Possible sub-types
 */
function determineSubType(category, keywords, objects) {
  const subTypes = [];
  
  switch(category) {
    case 'PROPERTY_OFFENCE':
      // Check for specific property crimes
      if (keywords.property.some(k => ['theft', 'stolen', 'stole'].includes(k))) {
        subTypes.push('THEFT');
      }
      if (keywords.property.some(k => ['cheating', 'fraud', 'scam'].includes(k))) {
        subTypes.push('FRAUD_CHEATING');
      }
      if (keywords.property.some(k => ['robbery', 'robbed', 'snatched'].includes(k)) ||
          keywords.threat.length > 0) {
        subTypes.push('ROBBERY');
      }
      if (keywords.property.some(k => ['embezzlement', 'misappropriation'].includes(k))) {
        subTypes.push('BREACH_OF_TRUST');
      }
      break;
      
    case 'OFFENCE_AGAINST_PERSON':
      // Check severity
      if (keywords.person.some(k => ['murder', 'killed', 'death'].includes(k))) {
        subTypes.push('MURDER_DEATH');
      }
      if (keywords.person.some(k => ['assault', 'hurt', 'beaten', 'hit'].includes(k))) {
        if (keywords.weapons.length > 0) {
          subTypes.push('HURT_WITH_WEAPON');
        } else {
          subTypes.push('SIMPLE_HURT');
        }
      }
      break;
      
    case 'SEXUAL_OFFENCE':
      if (keywords.sexual.some(k => ['rape'].includes(k))) {
        subTypes.push('RAPE');
      }
      if (keywords.sexual.some(k => ['molestation', 'inappropriate touch', 'groped'].includes(k))) {
        subTypes.push('MOLESTATION');
      }
      if (keywords.sexual.some(k => ['harassment', 'eve teasing', 'catcalling'].includes(k))) {
        subTypes.push('HARASSMENT');
      }
      if (keywords.sexual.some(k => ['stalking', 'following'].includes(k))) {
        subTypes.push('STALKING');
      }
      if (keywords.sexual.some(k => ['voyeurism'].includes(k)) || 
          objects.some(o => ['camera', 'video', 'photo'].includes(o))) {
        subTypes.push('VOYEURISM');
      }
      break;
      
    case 'THREAT_INTIMIDATION':
      if (keywords.threat.some(k => ['blackmail', 'extortion'].includes(k))) {
        subTypes.push('BLACKMAIL');
      }
      break;
      
    case 'FAMILY_OFFENCE':
      if (keywords.family.some(k => ['dowry'].includes(k))) {
        if (keywords.person.some(k => ['death', 'killed', 'died'].includes(k))) {
          subTypes.push('DOWRY_DEATH');
        } else {
          subTypes.push('DOWRY_HARASSMENT');
        }
      }
      if (keywords.family.some(k => ['married', 'marriage'].includes(k)) &&
          keywords.family.filter(k => k === 'married').length > 1) {
        subTypes.push('BIGAMY');
      }
      break;
  }
  
  return subTypes;
}

module.exports = {
  classifyOffence,
  determineSubType
};
