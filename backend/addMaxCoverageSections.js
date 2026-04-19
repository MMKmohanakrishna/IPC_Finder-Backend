const mongoose = require('mongoose');
const Section = require('./models/Section');

const MONGODB_URI = 'mongodb+srv://IPCfinder:UhMJn8T9bSRwU3aN@ipcfinder.dbnlevh.mongodb.net/ipc-finder';

const newSections = [
  // Domestic Violence
  {
    code: 'IPC 498A',
    name: 'Husband or Relative of Husband Subjecting Woman to Cruelty',
    simpleMeaning: 'Cruelty by husband or his relatives towards a woman, including harassment for dowry',
    punishment: 'Imprisonment up to 3 years and fine. Non-bailable and cognizable offense',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 323',
    name: 'Punishment for Voluntarily Causing Hurt',
    simpleMeaning: 'Voluntarily causing hurt to any person (simple assault causing pain, illness or infirmity)',
    punishment: 'Imprisonment up to 1 year, or fine up to ₹1000, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 325',
    name: 'Punishment for Voluntarily Causing Grievous Hurt',
    simpleMeaning: 'Voluntarily causing grievous hurt (serious injury like fracture, permanent disfigurement, loss of sight/hearing)',
    punishment: 'Imprisonment up to 7 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 326',
    name: 'Voluntarily Causing Grievous Hurt by Dangerous Weapons or Means',
    simpleMeaning: 'Causing grievous hurt using dangerous weapons like knife, acid, fire, or poison',
    punishment: 'Imprisonment for life, or up to 10 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'DV Act 3',
    name: 'Definition of Domestic Violence',
    simpleMeaning: 'Any act of abuse (physical, sexual, verbal, emotional, economic) that harms or causes danger to woman in domestic relationship',
    punishment: 'Protection orders, residence orders, monetary relief, custody orders. Violation: Up to 1 year and/or ₹20,000 fine',
    firPossible: 'Yes'
  },

  // Workplace Sexual Harassment
  {
    code: 'POSH Act 2',
    name: 'Sexual Harassment at Workplace',
    simpleMeaning: 'Unwelcome sexual advances, requests for sexual favors, or other verbal/physical conduct of sexual nature at workplace',
    punishment: 'Deduction from salary, warning, termination. Criminal complaint: Imprisonment up to 3 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 354A',
    name: 'Sexual Harassment',
    simpleMeaning: 'Sexual harassment including physical contact and advances, demand for sexual favors, showing pornography, making sexually colored remarks',
    punishment: 'Up to 3 years imprisonment and/or fine',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 509',
    name: 'Word, Gesture or Act Intended to Insult the Modesty of a Woman',
    simpleMeaning: 'Using words, gestures, or acts intended to insult the modesty of a woman',
    punishment: 'Imprisonment up to 3 years and/or fine',
    firPossible: 'Yes'
  },

  // Cyberstalking & Privacy
  {
    code: 'IPC 354D',
    name: 'Stalking',
    simpleMeaning: 'Following, contacting, or attempting to contact a person repeatedly despite clear indication of disinterest, causing fear',
    punishment: 'First offense: Up to 3 years and fine. Subsequent offense: Up to 5 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'IT Act 66E',
    name: 'Punishment for Violation of Privacy',
    simpleMeaning: 'Intentionally capturing, publishing, or transmitting private images without consent in violation of privacy',
    punishment: 'Imprisonment up to 3 years or fine up to ₹2 lakh, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 354C',
    name: 'Voyeurism',
    simpleMeaning: 'Watching or capturing image of a woman in private act without consent (including hidden cameras)',
    punishment: 'First offense: Up to 3 years and fine. Subsequent: Up to 7 years and fine',
    firPossible: 'Yes'
  },

  // Copyright & Trademark
  {
    code: 'Copyright Act 63',
    name: 'Offence of Infringement of Copyright',
    simpleMeaning: 'Knowingly infringing or abetting infringement of copyright in any work',
    punishment: 'Imprisonment from 6 months to 3 years and fine ₹50,000 to ₹2 lakh',
    firPossible: 'Yes'
  },
  {
    code: 'Trademarks Act 103',
    name: 'Penalty for Applying False Trademarks, Trade Descriptions',
    simpleMeaning: 'Applying false trademarks or selling goods with false trademarks (counterfeiting)',
    punishment: 'Imprisonment from 6 months to 3 years and fine ₹50,000 to ₹2 lakh',
    firPossible: 'Yes'
  },

  // Tax Evasion
  {
    code: 'IT Act 276C',
    name: 'Willful Attempt to Evade Tax',
    simpleMeaning: 'Willfully attempting to evade income tax, penalty, or interest by concealing income or furnishing inaccurate particulars',
    punishment: 'Imprisonment from 6 months to 7 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'IT Act 277',
    name: 'False Statement in Verification',
    simpleMeaning: 'Making false statement in verification or delivering false account or statement in income tax returns',
    punishment: 'Imprisonment from 6 months to 7 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'CGST Act 132',
    name: 'Punishment for Certain Offences',
    simpleMeaning: 'GST fraud including issuing fake invoices, tax evasion, obtaining refund fraudulently, suppressing turnover',
    punishment: 'Imprisonment up to 5 years and fine. If amount exceeds ₹5 crore: Up to 5 years imprisonment',
    firPossible: 'Yes'
  }
];

async function addSections() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let existingCount = 0;
    let addedCount = 0;

    for (const sectionData of newSections) {
      const existing = await Section.findOne({ code: sectionData.code });
      
      if (existing) {
        console.log(`⏭️  Already exists: ${sectionData.code}`);
        existingCount++;
      } else {
        await Section.create(sectionData);
        console.log(`✅ Added ${sectionData.code}: ${sectionData.name}`);
        addedCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Existing: ${existingCount}`);
    console.log(`   Added: ${addedCount}`);
    console.log(`   Total: ${newSections.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

addSections();
