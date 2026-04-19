/**
 * ====================================
 * LAYER 3: SECTION RELATIONSHIPS
 * ====================================
 * 
 * PRINCIPLE:
 * - IPC sections have logical relationships
 * - Definition sections link to punishment sections
 * - Main offences link to special cases
 * - Offences link to attempt/abetment sections
 * 
 * This module defines these relationships and ensures
 * that when one section is matched, related sections
 * are automatically included.
 */

/**
 * Section relationship map
 * 
 * Types:
 * - definition: Section defines an offence
 * - punishment: Section provides punishment
 * - special: Special case of a main offence
 * - attempt: Attempt to commit the offence
 * - abetment: Helping commit the offence
 */
const SECTION_RELATIONSHIPS = {
  
  // Theft related
  'IPC 378': {
    code: 'IPC 378',
    type: 'definition',
    name: 'Theft (Definition)',
    punishmentSection: 'IPC 379',
    specialCases: ['IPC 380', 'IPC 381'],
    relatedSections: ['IPC 392', 'IPC 411'],
    attemptSection: 'IPC 511'
  },
  
  'IPC 379': {
    code: 'IPC 379',
    type: 'punishment',
    name: 'Punishment for Theft',
    definitionSection: 'IPC 378',
    specialCases: ['IPC 380', 'IPC 381'],
    relatedSections: ['IPC 392']
  },
  
  'IPC 392': {
    code: 'IPC 392',
    type: 'punishment',
    name: 'Robbery',
    relatedSections: ['IPC 379', 'IPC 395'],
    note: 'Theft with force or threat'
  },
  
  'IPC 395': {
    code: 'IPC 395',
    type: 'punishment',
    name: 'Dacoity',
    relatedSections: ['IPC 392'],
    note: 'Robbery by 5 or more persons'
  },
  
  'IPC 411': {
    code: 'IPC 411',
    type: 'punishment',
    name: 'Dishonestly Receiving Stolen Property',
    relatedSections: ['IPC 379'],
    note: 'Connected to theft cases'
  },
  
  // Murder and death related
  'IPC 302': {
    code: 'IPC 302',
    type: 'punishment',
    name: 'Punishment for Murder',
    relatedSections: ['IPC 307', 'IPC 304'],
    attemptSection: 'IPC 307'
  },
  
  'IPC 304': {
    code: 'IPC 304',
    type: 'punishment',
    name: 'Culpable Homicide Not Amounting to Murder',
    relatedSections: ['IPC 302'],
    note: 'Lesser offence than murder'
  },
  
  'IPC 307': {
    code: 'IPC 307',
    type: 'punishment',
    name: 'Attempt to Murder',
    mainOffence: 'IPC 302',
    relatedSections: ['IPC 302', 'IPC 324', 'IPC 323']
  },
  
  // Hurt related
  'IPC 323': {
    code: 'IPC 323',
    type: 'punishment',
    name: 'Voluntarily Causing Hurt',
    severeVersion: 'IPC 325',
    weaponVersion: 'IPC 324',
    relatedSections: ['IPC 324', 'IPC 325', 'IPC 307']
  },
  
  'IPC 324': {
    code: 'IPC 324',
    type: 'punishment',
    name: 'Voluntarily Causing Hurt by Dangerous Weapon',
    simpleVersion: 'IPC 323',
    severeVersion: 'IPC 326',
    relatedSections: ['IPC 323', 'IPC 307']
  },
  
  'IPC 325': {
    code: 'IPC 325',
    type: 'punishment',
    name: 'Voluntarily Causing Grievous Hurt',
    simpleVersion: 'IPC 323',
    weaponVersion: 'IPC 326',
    relatedSections: ['IPC 323', 'IPC 324']
  },
  
  // Women-related offences
  'IPC 354': {
    code: 'IPC 354',
    type: 'punishment',
    name: 'Assault to Outrage Modesty of Woman',
    specialCases: ['IPC 354A', 'IPC 354B', 'IPC 354C', 'IPC 354D'],
    severeVersion: 'IPC 376',
    relatedSections: ['IPC 509']
  },
  
  'IPC 354A': {
    code: 'IPC 354A',
    type: 'punishment',
    name: 'Sexual Harassment',
    mainOffence: 'IPC 354',
    relatedSections: ['IPC 354', 'IPC 509']
  },
  
  'IPC 354B': {
    code: 'IPC 354B',
    type: 'punishment',
    name: 'Assault with Intent to Disrobe',
    mainOffence: 'IPC 354',
    relatedSections: ['IPC 354', 'IPC 376']
  },
  
  'IPC 354C': {
    code: 'IPC 354C',
    type: 'punishment',
    name: 'Voyeurism',
    mainOffence: 'IPC 354',
    relatedSections: ['IPC 354', 'IPC 509']
  },
  
  'IPC 354D': {
    code: 'IPC 354D',
    type: 'punishment',
    name: 'Stalking',
    mainOffence: 'IPC 354',
    relatedSections: ['IPC 354', 'IPC 509']
  },
  
  'IPC 376': {
    code: 'IPC 376',
    type: 'punishment',
    name: 'Rape',
    relatedSections: ['IPC 354', 'IPC 354B'],
    lesserOffence: 'IPC 354'
  },
  
  'IPC 509': {
    code: 'IPC 509',
    type: 'punishment',
    name: 'Word/Gesture to Insult Modesty of Woman',
    relatedSections: ['IPC 354', 'IPC 354A', 'IPC 504']
  },
  
  // Threat and intimidation
  'IPC 503': {
    code: 'IPC 503',
    type: 'definition',
    name: 'Criminal Intimidation (Definition)',
    punishmentSection: 'IPC 506',
    relatedSections: ['IPC 504']
  },
  
  'IPC 506': {
    code: 'IPC 506',
    type: 'punishment',
    name: 'Punishment for Criminal Intimidation',
    definitionSection: 'IPC 503',
    relatedSections: ['IPC 503', 'IPC 504']
  },
  
  'IPC 504': {
    code: 'IPC 504',
    type: 'punishment',
    name: 'Intentional Insult to Provoke Breach of Peace',
    relatedSections: ['IPC 503', 'IPC 506', 'IPC 509']
  },
  
  // Fraud and cheating
  'IPC 420': {
    code: 'IPC 420',
    type: 'punishment',
    name: 'Cheating and Dishonestly Inducing Delivery of Property',
    relatedSections: ['IPC 406', 'IPC 467', 'IPC 471']
  },
  
  'IPC 406': {
    code: 'IPC 406',
    type: 'punishment',
    name: 'Criminal Breach of Trust',
    relatedSections: ['IPC 420']
  },
  
  'IPC 467': {
    code: 'IPC 467',
    type: 'punishment',
    name: 'Forgery of Valuable Security',
    relatedSections: ['IPC 471', 'IPC 420']
  },
  
  'IPC 471': {
    code: 'IPC 471',
    type: 'punishment',
    name: 'Using as Genuine a Forged Document',
    relatedSections: ['IPC 467', 'IPC 420']
  },
  
  // Dowry and family
  'IPC 498A': {
    code: 'IPC 498A',
    type: 'punishment',
    name: 'Cruelty by Husband or Relatives',
    severeVersion: 'IPC 304B',
    relatedSections: ['IPC 304B', 'IPC 323', 'IPC 506']
  },
  
  'IPC 304B': {
    code: 'IPC 304B',
    type: 'punishment',
    name: 'Dowry Death',
    relatedSections: ['IPC 498A', 'IPC 302', 'IPC 304']
  },
  
  'IPC 494': {
    code: 'IPC 494',
    type: 'punishment',
    name: 'Bigamy',
    relatedSections: []
  },
  
  // Kidnapping
  'IPC 363': {
    code: 'IPC 363',
    type: 'punishment',
    name: 'Kidnapping',
    specialCases: ['IPC 366'],
    relatedSections: ['IPC 366']
  },
  
  'IPC 366': {
    code: 'IPC 366',
    type: 'punishment',
    name: 'Kidnapping for Marriage',
    mainOffence: 'IPC 363',
    relatedSections: ['IPC 363']
  },
  
  // Property damage
  'IPC 427': {
    code: 'IPC 427',
    type: 'punishment',
    name: 'Mischief Causing Damage',
    relatedSections: ['IPC 452']
  },
  
  'IPC 452': {
    code: 'IPC 452',
    type: 'punishment',
    name: 'House-trespass After Preparation for Hurt',
    relatedSections: ['IPC 323', 'IPC 324', 'IPC 427']
  },
  
  // Evidence
  'IPC 201': {
    code: 'IPC 201',
    type: 'punishment',
    name: 'Causing Disappearance of Evidence',
    relatedSections: []
  },
  
  // Conspiracy
  'IPC 120B': {
    code: 'IPC 120B',
    type: 'punishment',
    name: 'Criminal Conspiracy',
    relatedSections: [],
    note: 'Can be combined with any other offence'
  }
};

/**
 * Get related sections for a given section code
 * 
 * @param {string} sectionCode - IPC section code
 * @returns {Array} - Array of related section codes
 */
function getRelatedSections(sectionCode) {
  const section = SECTION_RELATIONSHIPS[sectionCode];
  if (!section) return [];
  
  const related = [];
  
  // Add punishment section if exists
  if (section.punishmentSection) {
    related.push(section.punishmentSection);
  }
  
  // Add definition section if exists
  if (section.definitionSection) {
    related.push(section.definitionSection);
  }
  
  // Add main offence if this is a special case
  if (section.mainOffence) {
    related.push(section.mainOffence);
  }
  
  // Add related sections
  if (section.relatedSections) {
    related.push(...section.relatedSections);
  }
  
  return [...new Set(related)]; // Remove duplicates
}

/**
 * Auto-expand section list with related sections
 * 
 * @param {Array} sections - Array of matched section codes
 * @returns {Array} - Expanded array with related sections
 */
function expandWithRelated(sections) {
  const expanded = new Set(sections);
  
  sections.forEach(sectionCode => {
    const related = getRelatedSections(sectionCode);
    related.forEach(r => expanded.add(r));
  });
  
  return Array.from(expanded);
}

/**
 * Get section type (definition, punishment, etc.)
 * 
 * @param {string} sectionCode - IPC section code
 * @returns {string} - Section type
 */
function getSectionType(sectionCode) {
  const section = SECTION_RELATIONSHIPS[sectionCode];
  return section ? section.type : 'unknown';
}

/**
 * Get section metadata
 * 
 * @param {string} sectionCode - IPC section code
 * @returns {Object} - Section relationship data
 */
function getSectionMetadata(sectionCode) {
  return SECTION_RELATIONSHIPS[sectionCode] || null;
}

/**
 * Check if section should auto-include punishment section
 * 
 * @param {string} sectionCode - IPC section code
 * @returns {boolean} - True if punishment should be auto-included
 */
function shouldIncludePunishment(sectionCode) {
  const section = SECTION_RELATIONSHIPS[sectionCode];
  return section && section.type === 'definition' && section.punishmentSection;
}

module.exports = {
  SECTION_RELATIONSHIPS,
  getRelatedSections,
  expandWithRelated,
  getSectionType,
  getSectionMetadata,
  shouldIncludePunishment
};
