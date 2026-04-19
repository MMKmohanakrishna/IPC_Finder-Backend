/**
 * ====================================
 * LAYER 2: LEGAL RULE ENGINE
 * ====================================
 * 
 * CRITICAL PRINCIPLES:
 * - Rules are DETERMINISTIC (same input → same output)
 * - Rules are GENERIC (work for ALL offence types)
 * - Rules are EXPLAINABLE (every decision has a reason)
 * - Rules are EXTENSIBLE (easy to add new patterns)
 * - AI NEVER makes final decisions - only rules do
 * 
 * Rule Structure:
 * {
 *   id: unique identifier,
 *   category: offence category,
 *   conditions: function that checks if rule applies,
 *   sections: IPC sections to apply if conditions are met,
 *   weight: relevance weight (1-10),
 *   reasoning: human-readable explanation
 * }
 */

/**
 * =================================
 * GENERIC RULE PATTERNS
 * =================================
 */

const LEGAL_RULES = [
  
  // ============ PROPERTY OFFENCES ============
  
  // Rule: Simple Theft (no force)
  {
    id: 'PROPERTY_THEFT_SIMPLE',
    category: 'property',
    conditions: (parsed) => {
      return (
        parsed.offenceCategory === 'property' &&
        (parsed.intent === 'theft' || parsed.actions.taking.length > 0) &&
        !parsed.forceUsed
      );
    },
    sections: ['IPC 378', 'IPC 379'], // Definition + Punishment
    weight: 10,
    reasoning: 'Property taken without consent, no force used'
  },
  
  // Rule: Theft with force (Robbery)
  {
    id: 'PROPERTY_ROBBERY',
    category: 'property',
    conditions: (parsed) => {
      return (
        parsed.offenceCategory === 'property' &&
        parsed.actions.taking.length > 0 &&
        parsed.forceUsed
      );
    },
    sections: ['IPC 392', 'IPC 379'], // Robbery + Theft
    weight: 10,
    reasoning: 'Property taken using force or threat'
  },
  
  // Rule: Receiving stolen property
  {
    id: 'PROPERTY_RECEIVING_STOLEN',
    category: 'property',
    conditions: (parsed) => {
      return (
        parsed.normalizedText.includes('bought') ||
        parsed.normalizedText.includes('received') ||
        parsed.normalizedText.includes('got')
      ) && parsed.objects.some(obj => ['phone', 'laptop', 'jewelry'].includes(obj));
    },
    sections: ['IPC 411'],
    weight: 7,
    reasoning: 'Receiving or possessing stolen property'
  },
  
  // Rule: Criminal breach of trust
  {
    id: 'PROPERTY_BREACH_TRUST',
    category: 'property',
    conditions: (parsed) => {
      return (
        parsed.normalizedText.includes('trust') ||
        parsed.normalizedText.includes('entrusted') ||
        parsed.normalizedText.includes('employee') ||
        parsed.normalizedText.includes('agent')
      ) && parsed.financialLoss;
    },
    sections: ['IPC 406'],
    weight: 9,
    reasoning: 'Misappropriation by person in position of trust'
  },
  
  // ============ CRIMES AGAINST PERSON ============
  
  // Rule: Murder
  {
    id: 'PERSON_MURDER',
    category: 'person',
    conditions: (parsed) => {
      return (
        parsed.deathOrInjury === 'death' &&
        (parsed.actions.violence.includes('killed') ||
         parsed.actions.violence.includes('murdered') ||
         parsed.actions.violence.includes('shot'))
      );
    },
    sections: ['IPC 302'],
    weight: 10,
    reasoning: 'Intentional killing causing death'
  },
  
  // Rule: Culpable homicide (unintentional death)
  {
    id: 'PERSON_CULPABLE_HOMICIDE',
    category: 'person',
    conditions: (parsed) => {
      return (
        parsed.deathOrInjury === 'death' &&
        !parsed.actions.violence.includes('murdered') &&
        (parsed.normalizedText.includes('accident') ||
         parsed.normalizedText.includes('fight') ||
         parsed.normalizedText.includes('sudden'))
      );
    },
    sections: ['IPC 304'],
    weight: 9,
    reasoning: 'Death without intent to murder'
  },
  
  // Rule: Attempt to murder
  {
    id: 'PERSON_ATTEMPT_MURDER',
    category: 'person',
    conditions: (parsed) => {
      return (
        parsed.actions.violence.length > 0 &&
        parsed.deathOrInjury !== 'death' &&
        (parsed.weapon || parsed.actions.violence.includes('shot') ||
         parsed.actions.violence.includes('stabbed'))
      );
    },
    sections: ['IPC 307'],
    weight: 9,
    reasoning: 'Attempt to cause death but victim survived'
  },
  
  // Rule: Grievous hurt
  {
    id: 'PERSON_GRIEVOUS_HURT',
    category: 'person',
    conditions: (parsed) => {
      return (
        parsed.deathOrInjury === 'grievous' ||
        parsed.normalizedText.includes('fracture') ||
        parsed.normalizedText.includes('broken') ||
        parsed.normalizedText.includes('critical')
      );
    },
    sections: ['IPC 325'],
    weight: 8,
    reasoning: 'Serious injury causing grievous hurt'
  },
  
  // Rule: Simple hurt with weapon
  {
    id: 'PERSON_HURT_WEAPON',
    category: 'person',
    conditions: (parsed) => {
      return (
        (parsed.deathOrInjury === 'hurt' || parsed.actions.violence.length > 0) &&
        parsed.weaponDangerous
      );
    },
    sections: ['IPC 324'],
    weight: 8,
    reasoning: 'Hurt caused using dangerous weapon'
  },
  
  // Rule: Simple hurt (no weapon)
  {
    id: 'PERSON_HURT_SIMPLE',
    category: 'person',
    conditions: (parsed) => {
      return (
        (parsed.deathOrInjury === 'hurt' || parsed.actions.violence.length > 0) &&
        !parsed.weaponDangerous &&
        parsed.deathOrInjury !== 'death'
      );
    },
    sections: ['IPC 323'],
    weight: 7,
    reasoning: 'Physical hurt without dangerous weapon'
  },
  
  // ============ SEXUAL OFFENCES ============
  
  // Rule: Rape
  {
    id: 'SEXUAL_RAPE',
    category: 'sexual',
    conditions: (parsed) => {
      return (
        parsed.sexualElement &&
        (parsed.actions.sexual.includes('raped') ||
         parsed.normalizedText.includes('forced intercourse') ||
         parsed.normalizedText.includes('sexual assault'))
      );
    },
    sections: ['IPC 376'],
    weight: 10,
    reasoning: 'Sexual intercourse without consent'
  },
  
  // Rule: Molestation / Outraging modesty
  {
    id: 'SEXUAL_MOLESTATION',
    category: 'sexual',
    conditions: (parsed) => {
      return (
        parsed.sexualElement &&
        parsed.victimGender === 'female' &&
        (parsed.actions.sexual.includes('touched') ||
         parsed.actions.sexual.includes('groped') ||
         parsed.normalizedText.includes('inappropriate') ||
         parsed.normalizedText.includes('modesty'))
      );
    },
    sections: ['IPC 354'],
    weight: 9,
    reasoning: 'Assault with intent to outrage modesty'
  },
  
  // Rule: Sexual harassment / Eve teasing
  {
    id: 'SEXUAL_HARASSMENT',
    category: 'sexual',
    conditions: (parsed) => {
      return (
        parsed.sexualElement &&
        (parsed.normalizedText.includes('comment') ||
         parsed.normalizedText.includes('gesture') ||
         parsed.normalizedText.includes('eve teasing') ||
         parsed.normalizedText.includes('catcall') ||
         parsed.normalizedText.includes('lewd'))
      );
    },
    sections: ['IPC 509', 'IPC 354A'],
    weight: 8,
    reasoning: 'Words or gestures insulting modesty'
  },
  
  // Rule: Voyeurism / Privacy violation
  {
    id: 'SEXUAL_VOYEURISM',
    category: 'sexual',
    conditions: (parsed) => {
      return (
        (parsed.normalizedText.includes('video') ||
         parsed.normalizedText.includes('photo') ||
         parsed.normalizedText.includes('recording') ||
         parsed.normalizedText.includes('camera')) &&
        (parsed.normalizedText.includes('private') ||
         parsed.normalizedText.includes('bathroom') ||
         parsed.normalizedText.includes('changing') ||
         parsed.normalizedText.includes('without consent'))
      );
    },
    sections: ['IPC 354C'],
    weight: 9,
    reasoning: 'Recording or watching in private without consent'
  },
  
  // Rule: Stalking
  {
    id: 'SEXUAL_STALKING',
    category: 'sexual',
    conditions: (parsed) => {
      return (
        parsed.actions.sexual.includes('stalked') ||
        parsed.actions.sexual.includes('followed') ||
        parsed.normalizedText.includes('repeatedly') ||
        parsed.normalizedText.includes('persistent')
      );
    },
    sections: ['IPC 354D'],
    weight: 8,
    reasoning: 'Following or monitoring despite disinterest'
  },

  // Rule: Stalking - simple phrasing matcher (keeps following / keeps calling / told him to stop)
  {
    id: 'SEXUAL_STALKING_SIMPLE',
    category: 'sexual',
    conditions: (parsed) => {
      const txt = parsed.normalizedText || '';
      const stalkingRegex = /(stalk(ed|ing)?|follow(s|ed)?|keeps following|keeps following me|keeps calling|keeps calling me|called me repeatedly|kept following)/i;
      const stopPhrase = /told (him|her|them) to stop|asked (him|her|them) to stop|asked him to stop/i;
      return stalkingRegex.test(txt) || (stalkingRegex.test(txt) && stopPhrase.test(txt)) || txt.includes('stalking');
    },
    sections: ['IPC 354D'],
    weight: 9,
    reasoning: 'Following, repeated calling or contacting after being asked to stop'
  },
  
  // Rule: Disrobing
  {
    id: 'SEXUAL_DISROBE',
    category: 'sexual',
    conditions: (parsed) => {
      return (
        parsed.normalizedText.includes('disrobe') ||
        parsed.normalizedText.includes('strip') ||
        parsed.normalizedText.includes('remove cloth') ||
        parsed.normalizedText.includes('naked')
      );
    },
    sections: ['IPC 354B'],
    weight: 9,
    reasoning: 'Assault with intent to disrobe'
  },
  
  // ============ THREAT & INTIMIDATION ============
  
  // Rule: Criminal intimidation (serious)
  {
    id: 'THREAT_SERIOUS',
    category: 'threat',
    conditions: (parsed) => {
      return (
        parsed.threatElement &&
        (parsed.normalizedText.includes('kill') ||
         parsed.normalizedText.includes('death') ||
         parsed.normalizedText.includes('grievous') ||
         parsed.weapon)
      );
    },
    sections: ['IPC 506'],
    weight: 9,
    reasoning: 'Threat to cause death or grievous hurt'
  },
  
  // Rule: Criminal intimidation (general)
  {
    id: 'THREAT_GENERAL',
    category: 'threat',
    conditions: (parsed) => {
      return (
        parsed.threatElement &&
        parsed.actions.threat.length > 0
      );
    },
    sections: ['IPC 503', 'IPC 506'],
    weight: 8,
    reasoning: 'Threat to cause harm or loss'
  },
  
  // Rule: Blackmail (video/photo related)
  {
    id: 'THREAT_BLACKMAIL_VIDEO',
    category: 'threat',
    conditions: (parsed) => {
      return (
        parsed.threatElement &&
        (parsed.objects.includes('video') || parsed.objects.includes('photo')) &&
        (parsed.normalizedText.includes('share') ||
         parsed.normalizedText.includes('send') ||
         parsed.normalizedText.includes('post'))
      );
    },
    sections: ['IPC 503', 'IPC 506', 'IPC 509', 'IPC 504'],
    weight: 9,
    reasoning: 'Blackmail using video or image to insult or intimidate'
  },
  
  // ============ FRAUD & CHEATING ============
  
  // Rule: Cheating / Fraud
  {
    id: 'FRAUD_CHEATING',
    category: 'fraud',
    conditions: (parsed) => {
      return (
        parsed.intent === 'fraud' ||
        parsed.actions.deception.length > 0 ||
        (parsed.offenceCategory === 'fraud' && parsed.financialLoss)
      );
    },
    sections: ['IPC 420'],
    weight: 9,
    reasoning: 'Dishonestly inducing delivery of property'
  },
  
  // Rule: Forgery
  {
    id: 'FRAUD_FORGERY',
    category: 'fraud',
    conditions: (parsed) => {
      return (
        parsed.normalizedText.includes('fake') ||
        parsed.normalizedText.includes('forged') ||
        parsed.normalizedText.includes('counterfeit') ||
        parsed.normalizedText.includes('false document')
      );
    },
    sections: ['IPC 467', 'IPC 471'],
    weight: 8,
    reasoning: 'Forgery of valuable documents'
  },
  
  // Rule: Job Fraud / Employment Scam (with money detection)
  {
    id: 'FRAUD_JOB_SCAM',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      // Job-related keywords
      const jobKeywords = [
        'job', 'employment', 'recruitment', 'interview', 'placement',
        'offer letter', 'joining fee', 'training fee', 'registration fee',
        'security deposit', 'work from home', 'part time job', 'hiring',
        'vacancy', 'consultancy', 'job portal', 'job offer', 'job opportunity'
      ];
      
      // Money detection regex
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash/i;
      
      const hasJobKeyword = jobKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      
      return hasJobKeyword && hasMoney;
    },
    sections: ['IPC 415', 'IPC 420'],
    weight: 9,
    reasoning: 'Job fraud/employment scam involving money'
  },
  
  // Rule: Online Shopping Fraud
  {
    id: 'FRAUD_ONLINE_SHOPPING',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const shoppingKeywords = [
        'amazon', 'flipkart', 'olx', 'quikr', 'meesho', 'snapdeal',
        'online order', 'online shopping', 'e-commerce', 'delivery',
        'courier', 'non-delivery', 'fake product', 'counterfeit product',
        'wrong product', 'ordered', 'purchased online', 'shopping site',
        'website', 'app purchase', 'cod', 'cash on delivery'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash/i;
      
      const hasShoppingKeyword = shoppingKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      
      return hasShoppingKeyword && hasMoney;
    },
    sections: ['IPC 420', 'IPC 406'],
    weight: 9,
    reasoning: 'Online shopping fraud or non-delivery of goods'
  },
  
  // Rule: Lottery/Prize Scam
  {
    id: 'FRAUD_LOTTERY_PRIZE',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const lotteryKeywords = [
        'lottery', 'prize', 'won', 'winner', 'congratulations',
        'kbc', 'kaun banega crorepati', 'lucky draw', 'scratch card',
        'claim fee', 'processing fee', 'tax payment', 'prize money',
        'jackpot', 'raffle', 'sweepstakes', 'game show'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash/i;
      
      const hasLotteryKeyword = lotteryKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      
      return hasLotteryKeyword && hasMoney;
    },
    sections: ['IPC 420', 'IPC 415'],
    weight: 9,
    reasoning: 'Lottery or prize scam asking for fees'
  },
  
  // Rule: Investment/Stock Market Fraud
  {
    id: 'FRAUD_INVESTMENT',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const investmentKeywords = [
        'investment', 'invest', 'invested', 'investing', 'stock', 'trading', 'share market',
        'forex', 'cryptocurrency', 'bitcoin', 'crypto', 'profit guaranteed',
        'returns', 'high returns', 'double money', 'mlm', 'pyramid scheme',
        'ponzi', 'portfolio', 'trading platform', 'broker', 'demat account',
        'mutual fund', 'sip', 'nifty', 'sensex'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash|invested/i;
      
      const hasInvestmentKeyword = investmentKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      
      return hasInvestmentKeyword && hasMoney;
    },
    sections: ['IPC 420', 'IPC 406'],
    weight: 9,
    reasoning: 'Investment or stock market fraud'
  },
  
  // Rule: Loan Fraud
  {
    id: 'FRAUD_LOAN',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const loanKeywords = [
        'loan', 'loan approved', 'processing fee', 'credit card',
        'instant loan', 'personal loan', 'home loan', 'easy loan',
        'loan application', 'disbursement', 'sanction letter',
        'credit score', 'emi', 'advance fee', 'documentation fee'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash/i;
      
      const hasLoanKeyword = loanKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      
      return hasLoanKeyword && hasMoney;
    },
    sections: ['IPC 420', 'IPC 415'],
    weight: 9,
    reasoning: 'Loan fraud with advance fee scam'
  },
  
  // Rule: Romance/Marriage Fraud
  {
    id: 'FRAUD_ROMANCE',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const romanceKeywords = [
        'dating app', 'dating site', 'tinder', 'bumble', 'shaadi',
        'marriage proposal', 'relationship', 'matrimony', 'profile',
        'boyfriend', 'girlfriend', 'partner', 'love', 'romance',
        'meet me', 'video call', 'gift', 'help me financially'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash/i;
      
      const hasRomanceKeyword = romanceKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      
      return hasRomanceKeyword && hasMoney;
    },
    sections: ['IPC 420', 'IPC 415', 'IPC 417'],
    weight: 9,
    reasoning: 'Romance or marriage fraud involving money'
  },
  
  // Rule: Digital Arrest/Police Impersonation
  {
    id: 'FRAUD_DIGITAL_ARREST',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const impersonationKeywords = [
        'police officer', 'police call', 'cbi', 'ed', 'enforcement directorate',
        'cyber cell', 'crime branch', 'arrest warrant', 'fir registered',
        'video call', 'courier', 'parcel', 'drugs', 'illegal package',
        'customs', 'narcotics', 'digital arrest', 'investigation',
        'officer', 'badge number', 'station', 'case registered'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash|fine|penalty/i;
      
      const hasImpersonationKeyword = impersonationKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text) || parsed.threatElement;
      
      return hasImpersonationKeyword && hasMoney;
    },
    sections: ['IPC 170', 'IPC 419', 'IPC 420', 'IPC 506'],
    weight: 10,
    reasoning: 'Impersonation of public servant/police officer for fraud'
  },
  
  // Rule: OTP/Phishing Fraud
  {
    id: 'FRAUD_OTP_PHISHING',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const phishingKeywords = [
        'otp', 'one time password', 'verification code', 'cvv',
        'pin', 'password', 'link', 'click here', 'update kyc',
        'kyc pending', 'account blocked', 'account suspended',
        'verify account', 'confirm identity', 'bank account',
        'debit card', 'atm card', 'net banking', 'upi pin',
        'phishing', 'suspicious link', 'fake link'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash|account|bank/i;
      
      const hasPhishingKeyword = phishingKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      
      return hasPhishingKeyword && hasMoney;
    },
    sections: ['IPC 420', 'IPC 66C', 'IPC 66D'],
    weight: 9,
    reasoning: 'OTP fraud or phishing to steal bank details'
  },
  
  // Rule: Fake Government Scheme
  {
    id: 'FRAUD_GOVT_SCHEME',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const govtSchemeKeywords = [
        'government scheme', 'sarkari yojana', 'pm scheme',
        'subsidy', 'ration card', 'aadhaar', 'pan card',
        'voter id', 'gas subsidy', 'lpg subsidy', 'pension',
        'government benefit', 'ayushman bharat', 'jan dhan',
        'mudra loan', 'kisan yojana', 'registration fee for scheme'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash/i;
      
      const hasGovtKeyword = govtSchemeKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      
      return hasGovtKeyword && hasMoney && text.includes('fake' || 'fraud' || 'scam');
    },
    sections: ['IPC 420', 'IPC 171'],
    weight: 9,
    reasoning: 'Fake government scheme or subsidy fraud'
  },
  
  // Rule: Land/Property Fraud
  {
    id: 'FRAUD_PROPERTY',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const propertyKeywords = [
        'property', 'land', 'plot', 'builder', 'flat', 'apartment',
        'registry', 'deed', 'down payment', 'booking amount', 'real estate',
        'construction', 'duplex', 'villa', 'farmhouse', 'land deal',
        'property dealer', 'broker', 'possession', 'registration'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash/i;
      
      const hasPropertyKeyword = propertyKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      const hasFraud = text.includes('fake') || text.includes('fraud') || text.includes('scam') || 
                       text.includes('cheat') || text.includes('deceive');
      
      return hasPropertyKeyword && hasMoney && hasFraud;
    },
    sections: ['IPC 420', 'IPC 467', 'IPC 471', 'IPC 120B'],
    weight: 10,
    reasoning: 'Property or land fraud with fake documents'
  },
  
  // Rule: Vehicle Theft/Fraud
  {
    id: 'VEHICLE_THEFT_FRAUD',
    category: 'property',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const vehicleKeywords = [
        'car', 'bike', 'motorcycle', 'vehicle', 'scooter', 'auto',
        'number plate', 'rc book', 'registration', 'two wheeler',
        'four wheeler', 'scooty', 'activa', 'pulsar', 'honda', 'yamaha'
      ];
      
      const hasVehicleKeyword = vehicleKeywords.some(word => text.includes(word));
      const isTheft = text.includes('stole') || text.includes('stolen') || 
                      text.includes('theft') || text.includes('missing');
      const isFraud = text.includes('fake') || text.includes('fraud') || 
                      text.includes('scam') || text.includes('cheat');
      
      return hasVehicleKeyword && (isTheft || isFraud);
    },
    sections: ['IPC 379', 'IPC 420', 'IPC 411'],
    weight: 9,
    reasoning: 'Vehicle theft or fraud involving fake sale/documents'
  },
  
  // Rule: Cyber Bullying/Online Harassment
  {
    id: 'CYBER_BULLYING',
    category: 'cyber',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const cyberBullyingKeywords = [
        'trolling', 'abuse online', 'threatening messages', 'social media',
        'defamation', 'morphed photo', 'fake profile', 'online harassment',
        'cyber bullying', 'whatsapp group', 'facebook', 'instagram',
        'twitter', 'post about me', 'comment', 'reputation', 'character',
        'false post', 'spreading rumors'
      ];
      
      const hasCyberKeyword = cyberBullyingKeywords.some(word => text.includes(word));
      const isHarassment = text.includes('harass') || text.includes('abuse') || 
                          text.includes('threat') || text.includes('defam') ||
                          text.includes('insult') || text.includes('morphed');
      
      return hasCyberKeyword && isHarassment;
    },
    sections: ['IPC 499', 'IPC 500', 'IPC 503', 'IPC 506', 'IPC 507', 'IPC 67'],
    weight: 8,
    reasoning: 'Cyber bullying, online defamation or harassment'
  },
  
  // Rule: Education Fraud
  {
    id: 'FRAUD_EDUCATION',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const educationKeywords = [
        'fake certificate', 'fake degree', 'admission', 'university',
        'exam', 'result', 'marksheet', 'fake diploma', 'college',
        'education certificate', 'degree scam', 'fake transcript',
        'admission fraud', 'donation for admission', 'capitation fee'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash/i;
      
      const hasEducationKeyword = educationKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      const hasFraud = text.includes('fake') || text.includes('fraud') || 
                       text.includes('scam') || text.includes('cheat');
      
      return hasEducationKeyword && (hasMoney || hasFraud);
    },
    sections: ['IPC 420', 'IPC 467', 'IPC 468', 'IPC 471'],
    weight: 9,
    reasoning: 'Education fraud with fake certificates or admission scam'
  },
  
  // Rule: Extortion/Blackmail (Enhanced)
  {
    id: 'EXTORTION_BLACKMAIL',
    category: 'threat',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const extortionKeywords = [
        'extortion', 'demand money', 'demanding', 'ransom',
        'pay or else', 'give money or', 'blackmail', 'demanding cash',
        'forced to pay', 'threatening for money', 'kidnap for money',
        'demanding amount', 'hafta', 'protection money'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash|ransom/i;
      
      const hasExtortionKeyword = extortionKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      const hasThreat = parsed.threatElement || text.includes('threat') || 
                        text.includes('force') || text.includes('demand');
      
      return hasExtortionKeyword && hasMoney && hasThreat;
    },
    sections: ['IPC 384', 'IPC 385', 'IPC 386', 'IPC 387'],
    weight: 10,
    reasoning: 'Extortion or blackmail demanding money with threats'
  },
  
  // Rule: Medical/Healthcare Fraud
  {
    id: 'FRAUD_MEDICAL',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const medicalKeywords = [
        'fake medicine', 'hospital bill', 'insurance fraud', 'fake doctor',
        'medical fraud', 'health insurance', 'fake prescription',
        'medical certificate', 'hospital scam', 'surgery', 'treatment',
        'unnecessary surgery', 'fake hospital', 'quack', 'unqualified doctor'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash|bill/i;
      
      const hasMedicalKeyword = medicalKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      const hasFraud = text.includes('fake') || text.includes('fraud') || 
                       text.includes('scam') || text.includes('cheat') ||
                       text.includes('unnecessary');
      
      return hasMedicalKeyword && hasMoney && hasFraud;
    },
    sections: ['IPC 420', 'IPC 419', 'IPC 304A'],
    weight: 9,
    reasoning: 'Medical fraud or fake doctor/hospital scam'
  },
  
  // Rule: Cheque Bounce/Dishonor
  {
    id: 'CHEQUE_BOUNCE',
    category: 'fraud',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const hasCheque = text.includes('cheque') || text.includes('check');
      const hasBounce = text.includes('bounce') || text.includes('dishonor') || 
                        text.includes('returned') || text.includes('insufficient funds') ||
                        text.includes('stop payment') || text.includes('not honored') ||
                        text.includes('account closed') || text.includes('payment stopped') ||
                        text.includes('gave cheque');
      
      return hasCheque && (hasBounce || text.includes('gave cheque'));
    },
    sections: ['IPC 138', 'IPC 420'],
    weight: 8,
    reasoning: 'Cheque bounce or dishonor of payment'
  },
  
  // Rule: Illegal Gambling/Betting
  {
    id: 'ILLEGAL_GAMBLING',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const gamblingKeywords = [
        'betting', 'gambling', 'satta', 'matka', 'online betting',
        'cricket betting', 'casino', 'bet', 'gamble', 'wagering',
        'sports betting', 'illegal betting', 'bookmaker', 'bookie',
        'taking bets', 'running satta'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash|lost|lakh/i;
      
      const hasGamblingKeyword = gamblingKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      const isRunning = text.includes('running') || text.includes('taking');
      
      return hasGamblingKeyword && (hasMoney || isRunning);
    },
    sections: ['IPC 294A'],
    weight: 7,
    reasoning: 'Illegal gambling or betting activities'
  },

  // ============ TRAFFIC AND ROAD OFFENSES ============

  // Rule: Traffic Violations & Road Accidents
  {
    id: 'TRAFFIC_VIOLATIONS',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const trafficKeywords = [
        'hit and run', 'rash driving', 'drunk driving', 'drunken driving',
        'accident', 'negligent driving', 'over speed', 'overspeed',
        'jumped signal', 'red light', 'no helmet', 'triple riding',
        'wrong side', 'license', 'driving without', 'uninsured',
        'reckless driving', 'dangerous driving', 'road rage'
      ];
      
      const hasTrafficKeyword = trafficKeywords.some(word => text.includes(word));
      const hasVehicle = text.includes('car') || text.includes('bike') || 
                        text.includes('auto') || text.includes('truck') || 
                        text.includes('vehicle') || text.includes('driver');
      
      return hasTrafficKeyword || (hasVehicle && (text.includes('accident') || text.includes('hit')));
    },
    sections: ['IPC 279', 'IPC 304A', 'IPC 337', 'IPC 338', 'MV Act 184'],
    weight: 8,
    reasoning: 'Traffic violations, rash/negligent driving causing accidents or endangering lives'
  },

  // ============ DRUGS AND NARCOTICS ============

  // Rule: Drug Possession & Trafficking
  {
    id: 'DRUGS_NARCOTICS',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const drugKeywords = [
        'drugs', 'narcotics', 'ganja', 'marijuana', 'cannabis', 'charas',
        'cocaine', 'heroin', 'opium', 'mdma', 'lsd', 'ecstasy',
        'methamphetamine', 'meth', 'smack', 'brown sugar', 'weed',
        'drug dealer', 'drug peddler', 'drug trafficking', 'drug smuggling',
        'substance abuse', 'contraband', 'illegal substance', 'narcotic substance'
      ];
      
      const activityKeywords = [
        'selling', 'possessing', 'smuggling', 'trafficking', 'peddling',
        'distributing', 'consuming', 'found with', 'caught with', 'seized'
      ];
      
      const hasDrugKeyword = drugKeywords.some(word => text.includes(word));
      const hasActivity = activityKeywords.some(word => text.includes(word));
      
      return hasDrugKeyword && (hasActivity || text.includes('drugs'));
    },
    sections: ['NDPS Act 8', 'NDPS Act 20', 'NDPS Act 21', 'NDPS Act 27'],
    weight: 9,
    reasoning: 'Drug possession, trafficking, or narcotics-related offenses under NDPS Act'
  },

  // ============ CORRUPTION AND BRIBERY ============

  // Rule: Bribery & Corruption
  {
    id: 'CORRUPTION_BRIBERY',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const corruptionKeywords = [
        'bribe', 'bribery', 'corruption', 'corrupt', 'kickback',
        'illegal gratification', 'undue advantage', 'demanded money',
        'asked for money', 'taking bribe', 'giving bribe', 'pay bribe'
      ];
      
      const officialKeywords = [
        'police', 'officer', 'official', 'government', 'clerk', 'inspector',
        'public servant', 'minister', 'mla', 'mp', 'bureaucrat', 'babu',
        'rto', 'municipal', 'revenue'
      ];
      
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|payment|rupees|cash/i;
      
      const hasCorruptionKeyword = corruptionKeywords.some(word => text.includes(word));
      const hasOfficial = officialKeywords.some(word => text.includes(word));
      const hasMoney = moneyRegex.test(text);
      
      return hasCorruptionKeyword || (hasOfficial && text.includes('demanded') && hasMoney);
    },
    sections: ['IPC 7', 'IPC 13', 'PC Act 7', 'PC Act 13'],
    weight: 8,
    reasoning: 'Bribery and corruption by public servants under Prevention of Corruption Act'
  },

  // ============ CHILD CRIMES ============

  // Rule: Child Sexual Abuse (POCSO)
  {
    id: 'CHILD_SEXUAL_ABUSE',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const childKeywords = [
        'child', 'minor', 'kid', 'boy', 'girl', 'student', 'teenager',
        'under 18', 'below 18', 'juvenile', 'school girl', 'school boy'
      ];
      
      const abuseKeywords = [
        'molest', 'abuse', 'rape', 'sexual', 'assault', 'touch',
        'harassment', 'inappropriate', 'indecent', 'obscene act',
        'sexual harassment', 'molestation', 'raped'
      ];
      
      const hasChildKeyword = childKeywords.some(word => text.includes(word));
      const hasAbuseKeyword = abuseKeywords.some(word => text.includes(word));
      
      return hasChildKeyword && hasAbuseKeyword;
    },
    sections: ['POCSO Act 3', 'POCSO Act 4', 'POCSO Act 5', 'POCSO Act 9', 'IPC 354', 'IPC 376'],
    weight: 10,
    reasoning: 'Child sexual abuse or exploitation under POCSO Act - serious offense'
  },

  // ============ ENVIRONMENTAL CRIMES ============

  // Rule: Environmental Violations
  {
    id: 'ENVIRONMENTAL_CRIME',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const envKeywords = [
        'pollution', 'pollute', 'polluting', 'toxic waste', 'hazardous waste',
        'illegal dumping', 'waste dumping', 'river pollution', 'water pollution',
        'air pollution', 'deforestation', 'illegal mining', 'sand mining',
        'plastic waste', 'industrial waste', 'chemical waste', 'oil spill',
        'noise pollution', 'illegal construction', 'wetland', 'forest cutting'
      ];
      
      const hasEnvKeyword = envKeywords.some(word => text.includes(word));
      const hasIllegal = text.includes('illegal') || text.includes('unauthorized');
      
      return hasEnvKeyword || (hasIllegal && (text.includes('mining') || text.includes('dumping')));
    },
    sections: ['EPA Act 15', 'Water Act 43', 'Air Act 37', 'Forest Act 26'],
    weight: 7,
    reasoning: 'Environmental pollution or illegal activities harming environment'
  },

  // ============ LABOR VIOLATIONS ============

  // Rule: Labor Law Violations
  {
    id: 'LABOR_VIOLATIONS',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const laborKeywords = [
        'child labor', 'child labour', 'bonded labor', 'bonded labour',
        'forced labor', 'forced labour', 'unpaid wages', 'salary not paid',
        'exploitation', 'working conditions', 'unsafe workplace',
        'no safety equipment', 'overtime without pay', 'illegal employment',
        'underage worker', 'factory exploitation', 'sweatshop'
      ];
      
      const hasLaborKeyword = laborKeywords.some(word => text.includes(word));
      const hasChild = text.includes('child') && (text.includes('work') || text.includes('labor'));
      
      return hasLaborKeyword || hasChild;
    },
    sections: ['Child Labour Act 3', 'Bonded Labour Act 16', 'Factories Act 92'],
    weight: 8,
    reasoning: 'Labor law violations including child labor, bonded labor, or wage theft'
  },

  // ============ FOOD SAFETY VIOLATIONS ============

  // Rule: Food Adulteration & Safety
  {
    id: 'FOOD_ADULTERATION',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const foodKeywords = [
        'food adulteration', 'adulterated', 'contaminated food', 'expired food',
        'fake food', 'substandard food', 'food poisoning', 'unhygienic',
        'rotten food', 'spoiled food', 'food safety', 'fssai',
        'restaurant hygiene', 'hotel hygiene', 'stale food', 'foreign object in food',
        'chemical in food', 'synthetic milk', 'fake ghee', 'food contamination'
      ];
      
      const hasFoodKeyword = foodKeywords.some(word => text.includes(word));
      const hasFoodAndQuality = text.includes('food') && 
        (text.includes('bad') || text.includes('expired') || 
         text.includes('contaminated') || text.includes('rotten'));
      
      return hasFoodKeyword || hasFoodAndQuality;
    },
    sections: ['FSS Act 59', 'IPC 272', 'IPC 273', 'IPC 274'],
    weight: 7,
    reasoning: 'Food adulteration or safety violations under Food Safety and Standards Act'
  },

  // ============ DOMESTIC VIOLENCE ============

  // Rule: Domestic Violence & Assault
  {
    id: 'DOMESTIC_VIOLENCE',
    category: 'family',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const domesticKeywords = [
        'husband', 'wife', 'spouse', 'married', 'in-laws', 'mother-in-law',
        'father-in-law', 'family', 'domestic', 'home', 'house'
      ];
      
      const violenceKeywords = [
        'beating', 'hit', 'slap', 'assault', 'violence', 'abuse',
        'physical abuse', 'mental abuse', 'torture', 'cruelty',
        'harassment', 'threat', 'dowry', 'demanding dowry'
      ];
      
      const hasDomesticContext = domesticKeywords.some(word => text.includes(word));
      const hasViolence = violenceKeywords.some(word => text.includes(word));
      
      return hasDomesticContext && hasViolence;
    },
    sections: ['IPC 498A', 'IPC 323', 'IPC 325', 'IPC 326', 'DV Act 3'],
    weight: 9,
    reasoning: 'Domestic violence, cruelty, or assault within family/marriage context'
  },

  // ============ WORKPLACE SEXUAL HARASSMENT ============

  // Rule: Sexual Harassment at Workplace
  {
    id: 'WORKPLACE_SEXUAL_HARASSMENT',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const workplaceKeywords = [
        'office', 'workplace', 'work', 'colleague', 'boss', 'manager',
        'supervisor', 'coworker', 'employee', 'employer', 'company',
        'job', 'professional'
      ];
      
      const harassmentKeywords = [
        'sexual harassment', 'inappropriate touch', 'unwanted advances',
        'sexual comments', 'harassment', 'molest', 'inappropriate behavior',
        'sexual favors', 'quid pro quo', 'hostile environment',
        'uncomfortable', 'indecent proposal', 'stalking at work'
      ];
      
      const hasWorkplace = workplaceKeywords.some(word => text.includes(word));
      const hasHarassment = harassmentKeywords.some(word => text.includes(word));
      
      return hasWorkplace && hasHarassment;
    },
    sections: ['POSH Act 2', 'IPC 354A', 'IPC 509'],
    weight: 9,
    reasoning: 'Sexual harassment at workplace under POSH Act (Prevention of Sexual Harassment Act)'
  },

  // ============ CYBERSTALKING & DOXXING ============

  // Rule: Cyberstalking & Online Privacy Violations
  {
    id: 'CYBERSTALKING_DOXXING',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const stalkingKeywords = [
        'stalking', 'cyberstalking', 'following online', 'tracking',
        'monitoring', 'watching', 'spying', 'doxxing', 'doxing',
        'personal information leaked', 'private photos shared',
        'revenge porn', 'intimate images', 'voyeurism',
        'secretly recording', 'hidden camera', 'peeping'
      ];
      
      const onlineContext = text.includes('online') || text.includes('social media') ||
                           text.includes('internet') || text.includes('whatsapp') ||
                           text.includes('facebook') || text.includes('instagram');
      
      const hasStalkingKeyword = stalkingKeywords.some(word => text.includes(word));
      
      return hasStalkingKeyword || (onlineContext && 
        (text.includes('stalk') || text.includes('harass') || 
         text.includes('private') || text.includes('personal information')));
    },
    sections: ['IPC 354D', 'IT Act 66E', 'IPC 354C', 'IPC 509'],
    weight: 8,
    reasoning: 'Cyberstalking, doxxing, or privacy violations including voyeurism and intimate image sharing'
  },

  // ============ COPYRIGHT & TRADEMARK VIOLATIONS ============

  // Rule: Intellectual Property Violations
  {
    id: 'COPYRIGHT_TRADEMARK_VIOLATION',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const ipKeywords = [
        'copyright', 'trademark', 'patent', 'piracy', 'pirated',
        'counterfeit', 'fake brand', 'duplicate', 'copy',
        'intellectual property', 'plagiarism', 'stolen content',
        'unauthorized use', 'infringement', 'copied design',
        'fake logo', 'brand violation', 'bootleg', 'knock-off'
      ];
      
      const contentKeywords = [
        'movie', 'music', 'software', 'book', 'song', 'video',
        'product', 'brand', 'logo', 'design', 'artwork'
      ];
      
      const hasIPKeyword = ipKeywords.some(word => text.includes(word));
      const hasContent = contentKeywords.some(word => text.includes(word));
      
      return hasIPKeyword || (hasContent && 
        (text.includes('copy') || text.includes('fake') || 
         text.includes('duplicate') || text.includes('stolen')));
    },
    sections: ['Copyright Act 63', 'Trademarks Act 103', 'IPC 420'],
    weight: 7,
    reasoning: 'Copyright infringement, trademark violation, or intellectual property theft'
  },

  // ============ TAX EVASION ============

  // Rule: Tax Evasion & Financial Fraud
  {
    id: 'TAX_EVASION',
    category: 'general',
    conditions: (parsed) => {
      const text = parsed.normalizedText;
      
      const taxKeywords = [
        'tax evasion', 'income tax', 'gst', 'tax fraud', 'tax avoidance',
        'black money', 'undeclared income', 'hiding income',
        'fake bills', 'bogus invoices', 'tax scam', 'evading tax',
        'not paying tax', 'tax theft', 'revenue fraud'
      ];
      
      const hasTaxKeyword = taxKeywords.some(word => text.includes(word));
      const hasTaxContext = text.includes('tax') && 
        (text.includes('evad') || text.includes('fraud') || 
         text.includes('hiding') || text.includes('not paying'));
      
      return hasTaxKeyword || hasTaxContext;
    },
    sections: ['IT Act 276C', 'IT Act 277', 'CGST Act 132'],
    weight: 7,
    reasoning: 'Tax evasion, income concealment, or GST fraud under Income Tax Act and GST Act'
  },
  
  // ============ FAMILY / MARRIAGE OFFENCES ============
  
  // Rule: Dowry harassment
  {
    id: 'FAMILY_DOWRY_HARASSMENT',
    category: 'family',
    conditions: (parsed) => {
      return (
        parsed.familyElement &&
        parsed.normalizedText.includes('dowry') &&
        !parsed.deathOrInjury
      );
    },
    sections: ['IPC 498A'],
    weight: 9,
    reasoning: 'Cruelty by husband or relatives'
  },
  
  // Rule: Dowry death
  {
    id: 'FAMILY_DOWRY_DEATH',
    category: 'family',
    conditions: (parsed) => {
      return (
        parsed.familyElement &&
        parsed.normalizedText.includes('dowry') &&
        parsed.deathOrInjury === 'death'
      );
    },
    sections: ['IPC 304B', 'IPC 498A'],
    weight: 10,
    reasoning: 'Death within 7 years of marriage due to dowry'
  },
  
  // Rule: Bigamy
  {
    id: 'FAMILY_BIGAMY',
    category: 'family',
    conditions: (parsed) => {
      return (
        parsed.normalizedText.includes('second marriage') ||
        parsed.normalizedText.includes('married twice') ||
        parsed.normalizedText.includes('bigamy') ||
        parsed.normalizedText.includes('two wives') ||
        parsed.normalizedText.includes('two husbands')
      );
    },
    sections: ['IPC 494'],
    weight: 9,
    reasoning: 'Marriage during lifetime of spouse'
  },
  
  // ============ KIDNAPPING / ABDUCTION ============
  
  // Rule: Kidnapping (general)
  {
    id: 'KIDNAP_GENERAL',
    category: 'person',
    conditions: (parsed) => {
      return (
        parsed.normalizedText.includes('kidnap') ||
        parsed.normalizedText.includes('abduct') ||
        parsed.normalizedText.includes('taken away') ||
        parsed.normalizedText.includes('missing child')
      );
    },
    sections: ['IPC 363'],
    weight: 9,
    reasoning: 'Kidnapping from lawful guardianship'
  },
  
  // Rule: Kidnapping for marriage
  {
    id: 'KIDNAP_MARRIAGE',
    category: 'person',
    conditions: (parsed) => {
      return (
        (parsed.normalizedText.includes('kidnap') || parsed.normalizedText.includes('abduct')) &&
        (parsed.normalizedText.includes('marriage') || parsed.normalizedText.includes('marry'))
      );
    },
    sections: ['IPC 366', 'IPC 363'],
    weight: 10,
    reasoning: 'Kidnapping to compel marriage'
  },
  
  // ============ PROPERTY DAMAGE ============
  
  // Rule: Mischief / Vandalism
  {
    id: 'DAMAGE_MISCHIEF',
    category: 'property',
    conditions: (parsed) => {
      return (
        parsed.actions.damage.length > 0 ||
        parsed.normalizedText.includes('vandal') ||
        parsed.normalizedText.includes('broke my') ||
        parsed.normalizedText.includes('destroyed my')
      );
    },
    sections: ['IPC 427'],
    weight: 7,
    reasoning: 'Intentional damage to property'
  },
  
  // Rule: House trespass
  {
    id: 'TRESPASS_HOUSE',
    category: 'property',
    conditions: (parsed) => {
      return (
        parsed.location === 'home' &&
        (parsed.normalizedText.includes('entered') ||
         parsed.normalizedText.includes('broke in') ||
         parsed.normalizedText.includes('trespass'))
      );
    },
    sections: ['IPC 452'],
    weight: 8,
    reasoning: 'Entering property with intent to harm'
  },
  
  // ============ EVIDENCE TAMPERING ============
  
  // Rule: Destroying evidence
  {
    id: 'EVIDENCE_TAMPERING',
    category: 'evidence',
    conditions: (parsed) => {
      return (
        parsed.evidenceTampering ||
        parsed.actions.evidence.length > 0
      );
    },
    sections: ['IPC 201'],
    weight: 8,
    reasoning: 'Destroying or concealing evidence of crime'
  },
  
  // ============ ORGANIZED CRIME ============
  
  // Rule: Criminal conspiracy
  {
    id: 'CONSPIRACY',
    category: 'general',
    conditions: (parsed) => {
      return (
        parsed.normalizedText.includes('conspiracy') ||
        parsed.normalizedText.includes('planned together') ||
        parsed.normalizedText.includes('gang') ||
        parsed.normalizedText.includes('group of')
      );
    },
    sections: ['IPC 120B'],
    weight: 8,
    reasoning: 'Agreement to commit illegal act'
  },
  
  // Rule: Dacoity (gang robbery)
  {
    id: 'DACOITY',
    category: 'property',
    conditions: (parsed) => {
      return (
        parsed.offenceCategory === 'property' &&
        (parsed.normalizedText.includes('gang') ||
         parsed.normalizedText.includes('group') ||
         parsed.normalizedText.includes('five or more'))
      );
    },
    sections: ['IPC 395'],
    weight: 9,
    reasoning: 'Robbery by five or more persons'
  },
  
  // ============ INSULT / PROVOCATION ============
  
  // Rule: Intentional insult
  {
    id: 'INSULT_PROVOCATION',
    category: 'general',
    conditions: (parsed) => {
      return (
        parsed.normalizedText.includes('insult') ||
        parsed.normalizedText.includes('abusive') ||
        parsed.normalizedText.includes('provoke')
      );
    },
    sections: ['IPC 504'],
    weight: 6,
    reasoning: 'Insult with intent to provoke breach of peace'
  }
];

/**
 * Apply legal rules to parsed input
 * 
 * @param {Object} parsed - Structured input from AI parser
 * @returns {Array} - Matched sections with weights and reasoning
 */
function applyRules(parsed) {
  const matches = [];
  
  // CRITICAL: Ensure normalizedText exists and is normalized
  if (!parsed.normalizedText) {
    console.warn('⚠️  No normalizedText found in parsed input');
    return matches;
  }
  
  // Test each rule
  LEGAL_RULES.forEach(rule => {
    try {
      // Check if rule conditions are satisfied
      if (rule.conditions(parsed)) {
        // Add all sections from this rule
        rule.sections.forEach(sectionCode => {
          matches.push({
            code: sectionCode,
            weight: rule.weight,
            ruleId: rule.id,
            reasoning: rule.reasoning
          });
        });
      }
    } catch (error) {
      console.error(`Error applying rule ${rule.id}:`, error.message);
    }
  });
  
  return matches;
}

/**
 * Get rule explanation for debugging
 * 
 * @param {string} ruleId - Rule ID
 * @returns {Object} - Rule details
 */
function getRuleDetails(ruleId) {
  const rule = LEGAL_RULES.find(r => r.id === ruleId);
  return rule || null;
}

module.exports = {
  applyRules,
  getRuleDetails,
  LEGAL_RULES
};
