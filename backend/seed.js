require('dotenv').config();
const mongoose = require('mongoose');
const Section = require('./models/Section');
const Mapping = require('./models/Mapping');

/**
 * Seed Script for IPC Finder
 * Populates the database with sample IPC sections and mappings
 */

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ipc-finder';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ Connected to MongoDB'))
.catch(err => {
  console.error('✗ MongoDB connection error:', err);
  process.exit(1);
});

// Sample IPC Sections Data
const sections = [
  {
    code: 'IPC 302',
    name: 'Punishment for Murder',
    simpleMeaning: 'This section deals with the punishment for intentionally causing someone\'s death (murder).',
    usedWhen: [
      'When someone intentionally kills another person',
      'When death is caused with premeditation and planning',
      'When there is clear intent to cause death'
    ],
    examples: [
      'A person shoots someone with the intention to kill',
      'Poisoning someone to cause their death',
      'Stabbing someone multiple times with intent to kill'
    ],
    punishment: 'Death penalty or life imprisonment, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['murder', 'kill', 'death', 'intentional killing', 'homicide', 'killed', 'murdered']
  },
  {
    code: 'IPC 304',
    name: 'Punishment for Culpable Homicide Not Amounting to Murder',
    simpleMeaning: 'This section deals with causing death without the intention to murder, but with knowledge that the act could cause death.',
    usedWhen: [
      'When death is caused without premeditation',
      'When the act was done with knowledge it could cause death but without intent to murder',
      'Sudden fights or acts done in the heat of passion'
    ],
    examples: [
      'During a fight, hitting someone who falls and dies from head injury',
      'Pushing someone in anger who falls from height and dies',
      'Rash driving causing death without intent to kill'
    ],
    punishment: 'Imprisonment for life, or imprisonment of either description for a term up to 10 years, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['culpable homicide', 'unintentional death', 'manslaughter', 'accidental death', 'negligent death']
  },
  {
    code: 'IPC 307',
    name: 'Attempt to Murder',
    simpleMeaning: 'This section deals with attempting to commit murder but the victim survives.',
    usedWhen: [
      'When someone tries to kill another person but fails',
      'When an act is done with intent to cause death but death doesn\'t occur',
      'Attack with deadly weapons with intent to kill'
    ],
    examples: [
      'Shooting at someone but missing or causing non-fatal injury',
      'Stabbing someone who survives after medical treatment',
      'Pushing someone from height but they survive'
    ],
    punishment: 'Imprisonment for a term which may extend to 10 years, and shall also be liable to fine. If hurt is caused, imprisonment for life',
    firPossible: 'Yes',
    keywords: ['attempt to murder', 'attempted murder', 'tried to kill', 'assault', 'attack with intent']
  },
  {
    code: 'IPC 323',
    name: 'Punishment for Voluntarily Causing Hurt',
    simpleMeaning: 'This section deals with voluntarily causing physical hurt to another person.',
    usedWhen: [
      'When someone intentionally hurts another person',
      'Physical assault causing pain or injury',
      'Simple hurt without grievous injuries'
    ],
    examples: [
      'Slapping someone causing pain',
      'Pushing or shoving causing minor injuries',
      'Hitting someone with hand or fist'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 1 year, or with fine up to Rs. 1,000, or with both',
    firPossible: 'Yes',
    keywords: ['hurt', 'assault', 'physical violence', 'beating', 'hitting', 'attacked', 'beat up']
  },
  {
    code: 'IPC 324',
    name: 'Voluntarily Causing Hurt by Dangerous Weapons or Means',
    simpleMeaning: 'This section deals with causing hurt using dangerous weapons or means.',
    usedWhen: [
      'When hurt is caused using weapons like knife, gun, stick',
      'Using fire, heated substances, poison, or corrosive substances',
      'Attack with any dangerous weapon or means'
    ],
    examples: [
      'Attacking someone with a knife causing injury',
      'Hitting with iron rod or baseball bat',
      'Throwing acid or hot liquid on someone'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 3 years, or with fine, or with both',
    firPossible: 'Yes',
    keywords: ['weapon attack', 'knife attack', 'dangerous weapon', 'acid attack', 'armed assault']
  },
  {
    code: 'IPC 354',
    name: 'Assault or Criminal Force to Woman with Intent to Outrage her Modesty',
    simpleMeaning: 'This section deals with assault or use of criminal force against a woman with intent to outrage her modesty.',
    usedWhen: [
      'When a woman\'s modesty is outraged through assault or force',
      'Unwanted touching or physical contact with sexual intent',
      'Any act intending to disrespect a woman\'s dignity'
    ],
    examples: [
      'Inappropriate touching without consent',
      'Forcefully trying to remove clothing',
      'Physical advances despite clear rejection'
    ],
    punishment: 'Imprisonment of either description for a term which shall not be less than 1 year but may extend to 5 years, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['molestation', 'sexual assault', 'harassment', 'modesty', 'unwanted touch', 'inappropriate touch']
  },
  {
    code: 'IPC 376',
    name: 'Punishment for Rape',
    simpleMeaning: 'This section deals with the punishment for rape and sexual assault.',
    usedWhen: [
      'When sexual intercourse occurs without consent',
      'When consent is obtained through force, fraud, or intimidation',
      'Sexual assault against will'
    ],
    examples: [
      'Forcing someone into sexual intercourse against their will',
      'Sexual intercourse with someone unconscious or unable to consent',
      'Using threats or violence to force sexual act'
    ],
    punishment: 'Rigorous imprisonment for a term which shall not be less than 10 years but may extend to life imprisonment, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['rape', 'sexual assault', 'forced intercourse', 'sexual violence', 'non-consensual']
  },
  {
    code: 'IPC 379',
    name: 'Punishment for Theft',
    simpleMeaning: 'This section deals with the punishment for theft - dishonestly taking someone\'s property without consent.',
    usedWhen: [
      'When someone takes another person\'s movable property without permission',
      'Dishonestly removing property with intent to keep it',
      'Taking property without the owner\'s knowledge or consent'
    ],
    examples: [
      'Stealing a mobile phone from someone\'s pocket',
      'Taking money from a purse without permission',
      'Shoplifting items from a store'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 3 years, or with fine, or with both',
    firPossible: 'Yes',
    keywords: ['theft', 'stealing', 'stole', 'stolen', 'robbery', 'took my property', 'pickpocket']
  },
  {
    code: 'IPC 420',
    name: 'Cheating and Dishonestly Inducing Delivery of Property',
    simpleMeaning: 'This section deals with cheating someone and fraudulently obtaining their property or valuables.',
    usedWhen: [
      'When someone deceives another to obtain property or money',
      'Fraud in business transactions',
      'False promises to take money or property'
    ],
    examples: [
      'Selling fake products as genuine',
      'Taking money by promising fake investment returns',
      'Online fraud and scams',
      'Impersonating someone to obtain money'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 7 years, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['cheating', 'fraud', 'scam', 'deception', 'fake', 'counterfeit', 'cheat', 'deceive', 'fraudulent']
  },
  {
    code: 'IPC 406',
    name: 'Punishment for Criminal Breach of Trust',
    simpleMeaning: 'This section deals with criminal breach of trust - when someone entrusted with property dishonestly misappropriates or uses it.',
    usedWhen: [
      'When someone in a position of trust misuses property',
      'Employees or agents misappropriating funds',
      'Dishonestly converting entrusted property to own use'
    ],
    examples: [
      'A cashier stealing from the company cash',
      'A lawyer misappropriating client funds',
      'An agent selling property without owner permission and keeping money'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 3 years, or with fine, or with both',
    firPossible: 'Yes',
    keywords: ['breach of trust', 'misappropriation', 'embezzlement', 'trust violation', 'misused funds']
  },
  {
    code: 'IPC 503',
    name: 'Criminal Intimidation',
    simpleMeaning: 'This section deals with threatening someone to cause alarm or force them to do/not do something.',
    usedWhen: [
      'When someone threatens another person',
      'Threats to cause injury to person, reputation, or property',
      'Intimidation to force someone into action or inaction'
    ],
    examples: [
      'Threatening to harm someone or their family',
      'Threatening to damage someone\'s property',
      'Threatening to harm reputation unless demands are met'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 2 years, or with fine, or with both',
    firPossible: 'Yes',
    keywords: ['threat', 'intimidation', 'threatening', 'threatened', 'blackmail', 'coercion']
  },
  {
    code: 'IPC 504',
    name: 'Intentional Insult with Intent to Provoke Breach of Peace',
    simpleMeaning: 'This section deals with intentionally insulting someone to provoke them to break public peace.',
    usedWhen: [
      'When someone intentionally insults another to provoke violence',
      'Verbal abuse intended to cause a fight',
      'Insulting words meant to disturb peace'
    ],
    examples: [
      'Using abusive language to provoke someone into fighting',
      'Public insults intended to humiliate and provoke',
      'Caste-based or communal insults to create conflict'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 2 years, or with fine, or with both',
    firPossible: 'Yes',
    keywords: ['insult', 'abuse', 'verbal abuse', 'provocation', 'offensive language', 'abusive words']
  },
  {
    code: 'IPC 506',
    name: 'Punishment for Criminal Intimidation',
    simpleMeaning: 'This section provides the punishment for criminal intimidation defined in section 503.',
    usedWhen: [
      'When someone commits criminal intimidation',
      'Serious threats causing fear',
      'Threats to cause grievous harm or death'
    ],
    examples: [
      'Threatening to kill or cause serious injury',
      'Death threats via phone or messages',
      'Threatening with weapons'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 2 years, or with fine, or with both. If threat is to cause death or grievous hurt: imprisonment up to 7 years, or fine, or both',
    firPossible: 'Yes',
    keywords: ['criminal intimidation', 'serious threat', 'death threat', 'grievous threat']
  },
  {
    code: 'IPC 509',
    name: 'Word, Gesture or Act Intended to Insult the Modesty of a Woman',
    simpleMeaning: 'This section deals with using words, gestures, or acts intended to insult a woman\'s modesty.',
    usedWhen: [
      'When words, sounds, or gestures insult a woman\'s modesty',
      'Verbal harassment of women',
      'Obscene gestures or actions directed at women'
    ],
    examples: [
      'Making lewd comments or catcalling',
      'Obscene gestures towards women',
      'Sending obscene messages or content'
    ],
    punishment: 'Simple imprisonment for a term which may extend to 3 years, and also with fine',
    firPossible: 'Yes',
    keywords: ['eve teasing', 'catcalling', 'obscene gesture', 'verbal harassment', 'lewd comment', 'harassment']
  },
  {
    code: 'IPC 411',
    name: 'Dishonestly Receiving Stolen Property',
    simpleMeaning: 'This section deals with knowingly receiving or retaining stolen property.',
    usedWhen: [
      'When someone receives property knowing it is stolen',
      'Retaining stolen goods',
      'Helping to hide or dispose of stolen property'
    ],
    examples: [
      'Buying a stolen mobile phone knowing it was stolen',
      'Receiving stolen jewelry from a thief',
      'Hiding stolen goods for someone'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 3 years, or with fine, or with both',
    firPossible: 'Yes',
    keywords: ['receiving stolen property', 'stolen goods', 'harboring stolen items', 'buying stolen']
  },
  {
    code: 'IPC 498A',
    name: 'Husband or Relative of Husband Subjecting Woman to Cruelty',
    simpleMeaning: 'This section deals with cruelty by husband or his relatives towards a married woman.',
    usedWhen: [
      'When a woman faces cruelty from husband or in-laws',
      'Harassment for dowry demands',
      'Mental or physical torture in marriage'
    ],
    examples: [
      'Husband or in-laws demanding additional dowry and harassing the wife',
      'Physical or mental torture by husband or his family',
      'Forcing wife to meet unlawful demands'
    ],
    punishment: 'Imprisonment up to 3 years and fine',
    firPossible: 'Yes',
    keywords: ['dowry harassment', 'marital cruelty', 'in-laws torture', 'dowry', 'husband cruelty', 'domestic violence', 'torture']
  },
  {
    code: 'IPC 304B',
    name: 'Dowry Death',
    simpleMeaning: 'This section deals with death of a woman within seven years of marriage due to dowry-related harassment.',
    usedWhen: [
      'When a woman dies within 7 years of marriage under suspicious circumstances',
      'Death linked to dowry harassment',
      'Unnatural death related to dowry demands'
    ],
    examples: [
      'Woman dies by suicide or burns due to dowry harassment',
      'Suspicious death following persistent dowry demands',
      'Death within 7 years of marriage linked to cruelty for dowry'
    ],
    punishment: 'Imprisonment for not less than 7 years but may extend to life imprisonment',
    firPossible: 'Yes',
    keywords: ['dowry death', 'bride burning', 'dowry', 'wife death', 'marital death', 'suspicious death']
  },
  {
    code: 'IPC 363',
    name: 'Punishment for Kidnapping',
    simpleMeaning: 'This section deals with kidnapping a person from lawful guardianship.',
    usedWhen: [
      'When someone kidnaps a minor or person of unsound mind',
      'Taking someone from lawful guardian without consent',
      'Abducting children'
    ],
    examples: [
      'Taking a child away from parents without permission',
      'Kidnapping a minor for ransom',
      'Abducting someone from legal custody'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 7 years, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['kidnapping', 'kidnapped', 'abduction', 'abducted', 'child abduction', 'missing', 'taken away']
  },
  {
    code: 'IPC 366',
    name: 'Kidnapping, Abducting or Inducing Woman to Compel Her Marriage',
    simpleMeaning: 'This section deals with kidnapping or abducting a woman to force her into marriage.',
    usedWhen: [
      'When a woman is kidnapped to force her into marriage',
      'Abducting a woman against her will for marriage',
      'Compelling marriage through kidnapping'
    ],
    examples: [
      'Abducting a woman to force marriage against her will',
      'Kidnapping a girl for forced marriage',
      'Taking a woman away to compel her to marry'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 10 years, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['forced marriage', 'abduction for marriage', 'kidnapping for marriage', 'compelled marriage']
  },
  {
    code: 'IPC 120B',
    name: 'Punishment of Criminal Conspiracy',
    simpleMeaning: 'This section deals with the punishment for criminal conspiracy - when two or more persons agree to commit an illegal act.',
    usedWhen: [
      'When two or more people plan to commit a crime',
      'Agreement to do an illegal act or legal act by illegal means',
      'Conspiracy to commit an offense'
    ],
    examples: [
      'Group of people planning a robbery together',
      'Plotting to commit fraud or murder',
      'Conspirators agreeing to cheat or harm someone'
    ],
    punishment: 'Same as punishment for the offense which is the object of conspiracy. If no punishment specified, imprisonment up to 6 months, or fine, or both',
    firPossible: 'Yes',
    keywords: ['conspiracy', 'criminal conspiracy', 'plot', 'planning crime', 'planned together', 'gang']
  },
  {
    code: 'IPC 395',
    name: 'Punishment for Dacoity',
    simpleMeaning: 'This section deals with dacoity - robbery committed by five or more persons acting together.',
    usedWhen: [
      'When five or more persons commit robbery together',
      'Gang robbery with violence',
      'Organized group theft with force'
    ],
    examples: [
      'Gang of robbers attacking and looting a house',
      'Group robbery on highway or public place',
      'Multiple attackers robbing victims together'
    ],
    punishment: 'Imprisonment for life, or rigorous imprisonment for a term which may extend to 10 years, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['dacoity', 'gang robbery', 'group robbery', 'organized robbery', 'gang theft', 'looters']
  },
  {
    code: 'IPC 427',
    name: 'Mischief Causing Damage',
    simpleMeaning: 'This section deals with intentionally causing damage to property to cause wrongful loss.',
    usedWhen: [
      'When someone intentionally damages property',
      'Destruction of property to cause loss',
      'Vandalism causing damage worth Rs. 50 or more'
    ],
    examples: [
      'Breaking someone\'s car windows intentionally',
      'Destroying crops or property out of spite',
      'Vandalizing public or private property'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 2 years, or with fine, or with both',
    firPossible: 'Yes',
    keywords: ['mischief', 'vandalism', 'property damage', 'damage', 'destruction', 'destroyed property']
  },
  {
    code: 'IPC 452',
    name: 'House-trespass After Preparation for Hurt, Assault or Wrongful Restraint',
    simpleMeaning: 'This section deals with entering someone\'s property after preparing to cause hurt, assault, or restrain them.',
    usedWhen: [
      'When someone enters property with preparation to commit assault',
      'Trespassing with weapons or intent to harm',
      'Entering premises after making preparations for wrongful act'
    ],
    examples: [
      'Entering someone\'s house armed with weapons to assault',
      'Trespassing with intent to cause hurt to occupants',
      'Breaking into property with preparation for assault'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 7 years, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['trespass', 'house trespass', 'breaking in', 'entered property', 'intrusion', 'break-in']
  },
  {
    code: 'IPC 467',
    name: 'Forgery of Valuable Security, Will, etc.',
    simpleMeaning: 'This section deals with forging valuable security documents like checks, wills, or certificates.',
    usedWhen: [
      'When someone forges a check, promissory note, or will',
      'Creating fake valuable documents',
      'Forging documents of financial value'
    ],
    examples: [
      'Forging someone\'s signature on a check',
      'Creating a fake will or property deed',
      'Forging bank documents or securities'
    ],
    punishment: 'Imprisonment for life, or imprisonment of either description for a term which may extend to 10 years, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['forgery', 'forged document', 'fake document', 'forged signature', 'fake will', 'counterfeit document']
  },
  {
    code: 'IPC 471',
    name: 'Using as Genuine a Forged Document',
    simpleMeaning: 'This section deals with knowingly using a forged document as if it were genuine.',
    usedWhen: [
      'When someone uses a fake document knowing it is forged',
      'Presenting forged documents as real',
      'Using counterfeit certificates or documents'
    ],
    examples: [
      'Using a fake degree certificate for a job',
      'Presenting a forged check at a bank',
      'Submitting fake documents for official purposes'
    ],
    punishment: 'Same as for forgery - depends on the type of document forged',
    firPossible: 'Yes',
    keywords: ['using forged', 'fake certificate', 'counterfeit', 'false document', 'forged paper']
  },
  {
    code: 'IPC 494',
    name: 'Marrying Again During Lifetime of Husband or Wife',
    simpleMeaning: 'This section deals with bigamy - marrying another person while the first marriage is still valid.',
    usedWhen: [
      'When someone marries while already married',
      'Second marriage without divorce from first spouse',
      'Polygamy cases'
    ],
    examples: [
      'Marrying another person without divorcing current spouse',
      'Hiding first marriage and marrying again',
      'Having two spouses at the same time'
    ],
    punishment: 'Imprisonment of either description for a term which may extend to 7 years, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['bigamy', 'second marriage', 'married twice', 'polygamy', 'double marriage', 'two wives', 'two husbands']
  },
  {
    code: 'IPC 201',
    name: 'Causing Disappearance of Evidence or Giving False Information',
    simpleMeaning: 'This section deals with destroying evidence or providing false information to screen an offender.',
    usedWhen: [
      'When someone destroys or hides evidence of a crime',
      'Providing false information to protect an offender',
      'Tampering with evidence'
    ],
    examples: [
      'Destroying CCTV footage of a crime',
      'Hiding murder weapon or evidence',
      'Giving false information to police to protect someone'
    ],
    punishment: 'If offense carries death penalty: imprisonment up to 7 years and fine. Other cases: imprisonment up to 3 years and fine',
    firPossible: 'Yes',
    keywords: ['destroying evidence', 'tampering evidence', 'hiding evidence', 'false information', 'cover up', 'concealing evidence']
  },
  {
    code: 'IPC 354A',
    name: 'Sexual Harassment',
    simpleMeaning: 'This section deals with sexual harassment including unwelcome physical contact, sexual advances, or demands for sexual favors.',
    usedWhen: [
      'Unwelcome physical contact or advances',
      'Demand or request for sexual favors',
      'Making sexually colored remarks',
      'Showing pornography against someone\'s will'
    ],
    examples: [
      'Workplace sexual harassment',
      'Unwanted physical advances or touching',
      'Making obscene remarks or gestures',
      'Demanding sexual favors in exchange for something'
    ],
    punishment: 'Rigorous imprisonment up to 3 years, or with fine, or with both',
    firPossible: 'Yes',
    keywords: ['sexual harassment', 'workplace harassment', 'unwanted advances', 'sexual favor', 'obscene remarks']
  },
  {
    code: 'IPC 354B',
    name: 'Assault or Use of Criminal Force to Woman with Intent to Disrobe',
    simpleMeaning: 'This section deals with assault on a woman with intent to disrobe or compel her to be naked.',
    usedWhen: [
      'Assault with intent to remove woman\'s clothing',
      'Forcing a woman to disrobe',
      'Attempting to strip a woman'
    ],
    examples: [
      'Forcefully trying to remove a woman\'s clothes',
      'Attacking a woman with intent to disrobe her',
      'Compelling a woman to undress against her will'
    ],
    punishment: 'Imprisonment of either description for a term which shall not be less than 3 years but may extend to 7 years, and shall also be liable to fine',
    firPossible: 'Yes',
    keywords: ['disrobe', 'stripping', 'removing clothes', 'forced nakedness', 'assault to disrobe']
  },
  {
    code: 'IPC 354C',
    name: 'Voyeurism',
    simpleMeaning: 'This section deals with watching or capturing images of a woman in private without her consent.',
    usedWhen: [
      'Watching a woman engaged in private act without consent',
      'Recording or photographing private acts without permission',
      'Distributing private images without consent'
    ],
    examples: [
      'Recording someone in bathroom or changing room',
      'Taking photos of someone in private without consent',
      'Installing hidden cameras in private spaces'
    ],
    punishment: 'First conviction: imprisonment up to 3 years and fine. Subsequent conviction: imprisonment up to 7 years and fine',
    firPossible: 'Yes',
    keywords: ['voyeurism', 'hidden camera', 'peeping', 'privacy invasion', 'secret recording', 'spy camera']
  },
  {
    code: 'IPC 354D',
    name: 'Stalking',
    simpleMeaning: 'This section deals with following, contacting, or monitoring a woman despite clear indication of disinterest.',
    usedWhen: [
      'Following or contacting a woman persistently despite her disinterest',
      'Monitoring someone\'s activities without consent',
      'Persistent unwanted contact'
    ],
    examples: [
      'Following a woman repeatedly despite her objections',
      'Sending persistent unwanted messages or calls',
      'Monitoring someone\'s movements or online activities',
      'Showing up at someone\'s workplace or home repeatedly'
    ],
    punishment: 'First conviction: imprisonment up to 3 years and fine. Subsequent conviction: imprisonment up to 5 years and fine',
    firPossible: 'Yes',
    keywords: ['stalking', 'following', 'persistent contact', 'harassment', 'unwanted attention', 'tracking']
  }
];

// Sample Mappings Data (connecting keywords to sections)
const mappings = [
  // Murder related - added individual keywords with overlapping terms for related sections
  { sectionCode: 'IPC 302', patterns: ['murder', 'killed', 'death', 'intentional death', 'premeditated killing', 'shot dead', 'murdered', 'shot', 'gun', 'shooting', 'kill', 'homicide', 'fatal', 'died', 'dead', 'pistol', 'revolver', 'bullet', 'stabbed to death', 'poisoned'], weight: 10 },
  { sectionCode: 'IPC 304', patterns: ['accidental death', 'unintentional death', 'culpable homicide', 'died in fight', 'sudden death', 'negligence', 'rash', 'negligent', 'death', 'died', 'fatal', 'killed', 'killing'], weight: 7 },
  { sectionCode: 'IPC 307', patterns: ['attempt to murder', 'tried to kill', 'attempted murder', 'shot at', 'stabbed but survived', 'survived', 'attempt', 'tried', 'shot', 'shooting', 'gun', 'stabbed', 'attacked'], weight: 8 },
  
  // Assault related - overlapping keywords to show both possibilities
  { sectionCode: 'IPC 323', patterns: ['hurt', 'beaten', 'slapped', 'physical assault', 'hit me', 'punched', 'kicked', 'beat', 'assault', 'violence', 'attacked', 'injured', 'wound', 'harm'], weight: 6 },
  { sectionCode: 'IPC 324', patterns: ['weapon', 'knife attack', 'acid attack', 'dangerous weapon', 'attacked with', 'iron rod', 'knife', 'sword', 'stick', 'rod', 'sharp', 'assault', 'attacked', 'hurt', 'injured', 'wounded'], weight: 8 },
  
  // Women related offenses - overlapping keywords for related crimes
  { sectionCode: 'IPC 354', patterns: ['molestation', 'inappropriate touch', 'sexual harassment', 'modesty', 'unwanted touch', 'molest', 'groped', 'groping', 'touched inappropriately', 'forced touch'], weight: 9 },
  { sectionCode: 'IPC 376', patterns: ['rape', 'sexual assault', 'forced intercourse', 'sexual violence', 'raped', 'forced sex', 'non-consensual', 'sexual abuse', 'violated'], weight: 10 },
  { sectionCode: 'IPC 509', patterns: ['eve teasing', 'catcalling', 'lewd comment', 'obscene gesture', 'harassment', 'harass', 'verbal harassment', 'teasing', 'dirty comment', 'whistled', 'whistling', 'comments about body', 'body shaming', 'passed comment', 'vulgar', 'obscene', 'insult modesty', 'uncomfortable', 'sent video', 'shared video', 'embarrass', 'humiliate', 'reputation', 'video', 'sent', 'mom', 'mother', 'parent', 'family'], weight: 7 },
  
  // Property related - overlapping for theft and fraud cases
  { sectionCode: 'IPC 379', patterns: ['theft', 'stolen', 'stole', 'robbed', 'pickpocket', 'shoplifting', 'took my', 'steal', 'rob', 'burglary', 'burglar', 'property taken', 'missing property'], weight: 8 },
  { sectionCode: 'IPC 420', patterns: ['fraud', 'cheating', 'scam', 'fake', 'deceived', 'cheated', 'counterfeit', 'false promise', 'cheat', 'deceive', 'fraudulent', 'scammed', 'tricked', 'conned', 'duped'], weight: 9 },
  { sectionCode: 'IPC 406', patterns: ['breach of trust', 'embezzlement', 'misappropriation', 'trusted', 'misused funds', 'embezzle', 'misappropriate', 'trust', 'entrusted'], weight: 8 },
  { sectionCode: 'IPC 411', patterns: ['stolen property', 'receiving stolen', 'bought stolen', 'stolen goods', 'receive stolen', 'harboring stolen'], weight: 7 },
  
  // Threat and intimidation - overlapping to show related sections
  { sectionCode: 'IPC 503', patterns: ['threat', 'threatened', 'intimidation', 'blackmail', 'extortion', 'threaten', 'intimidate', 'coerce', 'coercion', 'threatening', 'video threat', 'using video', 'will share', 'will send', 'video', 'sent'], weight: 7 },
  { sectionCode: 'IPC 506', patterns: ['death threat', 'serious threat', 'threatened to kill', 'criminal intimidation', 'life threat', 'threat', 'threatened', 'intimidation'], weight: 8 },
  { sectionCode: 'IPC 504', patterns: ['insult', 'verbal abuse', 'abusive', 'provoked', 'offensive language', 'abuse', 'provoke', 'offend', 'insulted', 'intentional insult', 'sent to embarrass', 'sent to family', 'damage reputation', 'sent', 'video', 'mom', 'mother', 'parent'], weight: 6 },
  
  // Dowry and marriage related - overlapping for related cases
  { sectionCode: 'IPC 498A', patterns: ['dowry', 'dowry harassment', 'in-laws', 'husband cruelty', 'marital cruelty', 'domestic violence', 'torture', 'wife harassment', 'marital', 'marriage'], weight: 9 },
  { sectionCode: 'IPC 304B', patterns: ['dowry death', 'bride burning', 'wife death', 'suspicious death', 'marital death', 'dowry', 'death', 'died', 'killed'], weight: 10 },
  { sectionCode: 'IPC 494', patterns: ['bigamy', 'second marriage', 'married twice', 'two wives', 'two husbands', 'polygamy', 'double marriage', 'already married'], weight: 8 },
  
  // Kidnapping and abduction - overlapping keywords
  { sectionCode: 'IPC 363', patterns: ['kidnapping', 'kidnapped', 'abduction', 'abducted', 'child abduction', 'missing', 'taken away', 'child missing', 'forcibly taken'], weight: 9 },
  { sectionCode: 'IPC 366', patterns: ['forced marriage', 'abduction for marriage', 'kidnapping for marriage', 'compelled marriage', 'marry against will', 'kidnapping', 'abduction', 'forced'], weight: 9 },
  
  // Organized crime
  { sectionCode: 'IPC 120B', patterns: ['conspiracy', 'criminal conspiracy', 'plot', 'planned crime', 'gang', 'group planning', 'plotted'], weight: 8 },
  { sectionCode: 'IPC 395', patterns: ['dacoity', 'gang robbery', 'group robbery', 'organized robbery', 'gang theft', 'looters', 'multiple robbers'], weight: 9 },
  
  // Property and document crimes
  { sectionCode: 'IPC 427', patterns: ['mischief', 'vandalism', 'property damage', 'damage', 'destruction', 'destroyed', 'vandalize'], weight: 7 },
  { sectionCode: 'IPC 452', patterns: ['trespass', 'house trespass', 'breaking in', 'break-in', 'intrusion', 'entered property', 'broke in'], weight: 8 },
  { sectionCode: 'IPC 467', patterns: ['forgery', 'forged', 'fake document', 'forged signature', 'fake will', 'counterfeit', 'forged certificate'], weight: 8 },
  { sectionCode: 'IPC 471', patterns: ['using forged', 'fake certificate', 'false document', 'forged paper', 'submitted fake'], weight: 7 },
  
  // Evidence and cover-up
  { sectionCode: 'IPC 201', patterns: ['destroying evidence', 'tampered evidence', 'hiding evidence', 'false information', 'cover up', 'concealed evidence', 'destroyed proof', 'hid', 'removed', 'accident', 'vehicle', 'number plate', 'avoid police', 'hiding', 'tampering', 'destroyed', 'concealed', 'escape'], weight: 8 },
  
  // Women safety (additional)
  { sectionCode: 'IPC 354A', patterns: ['sexual harassment', 'workplace harassment', 'unwanted advances', 'sexual favor', 'obscene remarks', 'harass sexually', 'sexually colored', 'dirty comment', 'lewd'], weight: 9 },
  { sectionCode: 'IPC 354B', patterns: ['disrobe', 'stripping', 'removing clothes', 'forced nakedness', 'strip', 'undress forcefully'], weight: 9 },
  { sectionCode: 'IPC 354C', patterns: ['voyeurism', 'hidden camera', 'peeping', 'privacy invasion', 'secret recording', 'spy camera', 'recorded without consent', 'video without permission', 'shared video', 'private video', 'recorded secretly', 'video', 'recording', 'dancing', 'couple'], weight: 9 },
  { sectionCode: 'IPC 354D', patterns: ['stalking', 'stalker', 'following', 'persistent contact', 'unwanted attention', 'tracking', 'followed me', 'keeps following', 'watching me'], weight: 9 }
];

// Seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Section.deleteMany({});
    await Mapping.deleteMany({});
    console.log('✓ Existing data cleared\n');
    
    // Insert sections
    console.log('📝 Inserting IPC sections...');
    const insertedSections = await Section.insertMany(sections);
    console.log(`✓ Inserted ${insertedSections.length} IPC sections\n`);
    
    // Insert mappings
    console.log('🔗 Inserting keyword mappings...');
    const insertedMappings = await Mapping.insertMany(mappings);
    console.log(`✓ Inserted ${insertedMappings.length} keyword mappings\n`);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Database seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\nSummary:`);
    console.log(`  • ${insertedSections.length} IPC sections`);
    console.log(`  • ${insertedMappings.length} keyword mappings`);
    console.log(`\nYou can now start the server with: npm start`);
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
