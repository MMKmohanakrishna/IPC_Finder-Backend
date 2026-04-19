/**
 * Rule-Based Section Matcher
 * Maps offence classifications to specific IPC sections using legal rules
 */

/**
 * STEP 4: Rule-based IPC section mapping
 * Apply legal rules to determine applicable sections
 */

// Legal rules mapping offences to IPC sections
const LEGAL_RULES = {
  // PROPERTY CRIMES
  THEFT: [
    {
      condition: (keywords, objects, location) => 
        keywords.property.some(k => ['theft', 'stolen', 'stole', 'steal'].includes(k)),
      sections: ['IPC 379'],
      reason: 'Movable property taken without consent'
    },
    {
      condition: (keywords, objects, location) => 
        location.house && keywords.property.some(k => ['theft', 'stolen'].includes(k)),
      sections: ['IPC 379', 'IPC 452'],
      reason: 'Theft from dwelling/house trespass'
    }
  ],
  
  FRAUD_CHEATING: [
    {
      condition: (keywords, objects) => 
        keywords.property.some(k => ['cheating', 'fraud', 'scam', 'fake'].includes(k)),
      sections: ['IPC 420'],
      reason: 'Cheating and dishonestly inducing delivery of property'
    },
    {
      condition: (keywords, objects) => 
        keywords.property.some(k => ['forgery', 'forged', 'fake document'].includes(k)),
      sections: ['IPC 467', 'IPC 471'],
      reason: 'Forgery of documents'
    }
  ],
  
  ROBBERY: [
    {
      condition: (keywords, objects) => 
        (keywords.property.some(k => ['robbery', 'robbed', 'snatched'].includes(k)) ||
         (keywords.property.length > 0 && keywords.threat.length > 0)),
      sections: ['IPC 379', 'IPC 506'],
      reason: 'Theft with force or intimidation'
    }
  ],
  
  BREACH_OF_TRUST: [
    {
      condition: (keywords) => 
        keywords.property.some(k => ['embezzlement', 'misappropriation', 'breach of trust'].includes(k)),
      sections: ['IPC 406'],
      reason: 'Criminal breach of trust'
    }
  ],
  
  // CRIMES AGAINST PERSON
  MURDER_DEATH: [
    {
      condition: (keywords) => 
        keywords.person.some(k => ['murder', 'killed'].includes(k)) &&
        keywords.person.some(k => ['intentional', 'planned'].includes(k)),
      sections: ['IPC 302'],
      reason: 'Intentional murder'
    },
    {
      condition: (keywords) => 
        keywords.person.some(k => ['death', 'died', 'killed'].includes(k)) &&
        !keywords.person.some(k => ['intentional', 'planned'].includes(k)),
      sections: ['IPC 304'],
      reason: 'Culpable homicide not amounting to murder'
    },
    {
      condition: (keywords) => 
        keywords.person.some(k => ['shot', 'stabbed', 'attacked'].includes(k)) &&
        keywords.person.some(k => ['survived', 'injured'].includes(k)),
      sections: ['IPC 307'],
      reason: 'Attempt to murder'
    }
  ],
  
  SIMPLE_HURT: [
    {
      condition: (keywords) => 
        keywords.person.some(k => ['hurt', 'beaten', 'slapped', 'hit'].includes(k)),
      sections: ['IPC 323'],
      reason: 'Voluntarily causing hurt'
    }
  ],
  
  HURT_WITH_WEAPON: [
    {
      condition: (keywords) => 
        keywords.person.some(k => ['hurt', 'beaten', 'attacked'].includes(k)) &&
        keywords.weapons.length > 0,
      sections: ['IPC 324'],
      reason: 'Voluntarily causing hurt by dangerous weapons'
    }
  ],
  
  // SEXUAL OFFENCES
  RAPE: [
    {
      condition: (keywords) => 
        keywords.sexual.some(k => ['rape', 'raped'].includes(k)),
      sections: ['IPC 376'],
      reason: 'Rape'
    }
  ],
  
  MOLESTATION: [
    {
      condition: (keywords) => 
        keywords.sexual.some(k => ['molestation', 'inappropriate touch', 'groped', 'molest'].includes(k)),
      sections: ['IPC 354'],
      reason: 'Assault with intent to outrage modesty'
    }
  ],
  
  HARASSMENT: [
    {
      condition: (keywords) => 
        keywords.sexual.some(k => ['harassment', 'eve teasing', 'catcalling', 'lewd'].includes(k)),
      sections: ['IPC 509', 'IPC 354A'],
      reason: 'Sexual harassment / insult to modesty'
    }
  ],
  
  STALKING: [
    {
      condition: (keywords) => 
        keywords.sexual.some(k => ['stalking', 'following'].includes(k)),
      sections: ['IPC 354D'],
      reason: 'Stalking'
    }
  ],
  
  VOYEURISM: [
    {
      condition: (keywords, objects) => 
        keywords.sexual.some(k => ['voyeurism'].includes(k)) ||
        (objects.some(o => ['camera', 'video', 'photo'].includes(o)) &&
         keywords.sexual.length > 0),
      sections: ['IPC 354C'],
      reason: 'Voyeurism / privacy violation'
    }
  ],
  
  // THREATS
  BLACKMAIL: [
    {
      condition: (keywords) => 
        keywords.threat.some(k => ['threat', 'threatened', 'intimidation'].includes(k)),
      sections: ['IPC 503', 'IPC 506'],
      reason: 'Criminal intimidation'
    }
  ],
  
  // FAMILY OFFENCES
  DOWRY_HARASSMENT: [
    {
      condition: (keywords) => 
        keywords.family.some(k => ['dowry'].includes(k)) &&
        !keywords.person.some(k => ['death', 'died'].includes(k)),
      sections: ['IPC 498A'],
      reason: 'Cruelty by husband or relatives'
    }
  ],
  
  DOWRY_DEATH: [
    {
      condition: (keywords) => 
        keywords.family.some(k => ['dowry'].includes(k)) &&
        keywords.person.some(k => ['death', 'died', 'killed'].includes(k)),
      sections: ['IPC 304B'],
      reason: 'Dowry death'
    }
  ],
  
  BIGAMY: [
    {
      condition: (keywords) => 
        keywords.family.some(k => ['married', 'marriage'].includes(k)) &&
        keywords.family.some(k => ['second', 'twice', 'bigamy'].includes(k)),
      sections: ['IPC 494'],
      reason: 'Bigamy'
    }
  ]
};

// Additional contextual rules
const CONTEXTUAL_RULES = [
  {
    condition: (keywords, objects, location) => 
      keywords.actions.some(a => ['hid', 'removed', 'destroyed'].includes(a)) &&
      objects.some(o => ['evidence', 'vehicle', 'number plate'].includes(o)),
    sections: ['IPC 201'],
    reason: 'Destroying evidence',
    weight: 8
  },
  {
    condition: (keywords, objects, location) => 
      objects.some(o => ['video', 'photo'].includes(o)) &&
      keywords.actions.some(a => ['sent', 'shared'].includes(a)) &&
      keywords.family.some(f => ['mom', 'mother', 'parent', 'family'].includes(f)),
    sections: ['IPC 509', 'IPC 504', 'IPC 354C'],
    reason: 'Privacy violation and insult',
    weight: 7
  },
  {
    condition: (keywords, objects, location) => 
      keywords.family.some(k => ['kidnapped', 'abducted', 'abduction'].includes(k)),
    sections: ['IPC 363'],
    reason: 'Kidnapping',
    weight: 9
  }
];

/**
 * Apply legal rules to determine applicable IPC sections
 * @param {Array} subTypes - Offence sub-types
 * @param {Object} keywords - Extracted keywords
 * @param {Array} objects - Extracted objects
 * @param {Object} location - Location context
 * @returns {Array} - Matched IPC sections with reasons
 */
function applyLegalRules(subTypes, keywords, objects, location) {
  const matchedSections = [];
  
  // Apply rules for each sub-type
  subTypes.forEach(subType => {
    const rules = LEGAL_RULES[subType] || [];
    
    rules.forEach(rule => {
      if (rule.condition(keywords, objects, location)) {
        rule.sections.forEach(section => {
          if (!matchedSections.find(m => m.code === section)) {
            matchedSections.push({
              code: section,
              reason: rule.reason,
              weight: 10 // Rule-based matches get high weight
            });
          }
        });
      }
    });
  });
  
  // Apply contextual rules
  CONTEXTUAL_RULES.forEach(rule => {
    if (rule.condition(keywords, objects, location)) {
      rule.sections.forEach(section => {
        if (!matchedSections.find(m => m.code === section)) {
          matchedSections.push({
            code: section,
            reason: rule.reason,
            weight: rule.weight
          });
        }
      });
    }
  });
  
  return matchedSections;
}

module.exports = {
  applyLegalRules,
  LEGAL_RULES,
  CONTEXTUAL_RULES
};
