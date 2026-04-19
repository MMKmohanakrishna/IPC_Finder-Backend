/**
 * Add missing IPC sections for additional crime categories
 */

const mongoose = require('mongoose');
const Section = require('./models/Section');
require('dotenv').config();

const DB_URL = process.env.MONGODB_URI || 'mongodb+srv://IPCfinder:UhMJn8T9bSRwU3aN@ipcfinder.dbnlevh.mongodb.net/ipc-finder?appName=IPCFinder';

const ADDITIONAL_SECTIONS = [
  {
    code: 'IPC 120B',
    name: 'Criminal conspiracy',
    simpleMeaning: 'Agreement between two or more persons to commit an illegal act',
    punishment: 'Same as punishment for the offence which is the object of conspiracy',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 294A',
    name: 'Keeping lottery office',
    simpleMeaning: 'Running lottery, gambling or betting operations',
    punishment: 'Imprisonment up to 6 months, or fine, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 304A',
    name: 'Causing death by negligence',
    simpleMeaning: 'Death caused by rash or negligent act (not amounting to culpable homicide)',
    punishment: 'Imprisonment up to 2 years, or fine, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 384',
    name: 'Punishment for extortion',
    simpleMeaning: 'Intentionally putting someone in fear to dishonestly obtain property or valuable security',
    punishment: 'Imprisonment up to 3 years, or fine, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 385',
    name: 'Putting person in fear of injury to commit extortion',
    simpleMeaning: 'Threatening someone with injury to commit extortion',
    punishment: 'Imprisonment up to 2 years, or fine, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 386',
    name: 'Extortion by putting a person in fear of death or grievous hurt',
    simpleMeaning: 'Extortion by threatening death or serious injury',
    punishment: 'Imprisonment up to 10 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 387',
    name: 'Putting person in fear of death or grievous hurt to commit extortion',
    simpleMeaning: 'Threatening someone with death or grievous hurt to extort',
    punishment: 'Imprisonment up to 7 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 468',
    name: 'Forgery for purpose of cheating',
    simpleMeaning: 'Creating fake documents with intent to cheat',
    punishment: 'Imprisonment up to 7 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 499',
    name: 'Defamation',
    simpleMeaning: 'Making or publishing any statement that harms reputation of another person',
    punishment: 'Imprisonment up to 2 years, or fine, or both',
    firPossible: 'No'
  },
  {
    code: 'IPC 500',
    name: 'Punishment for defamation',
    simpleMeaning: 'Punishment for harming someones reputation by words or publications',
    punishment: 'Imprisonment up to 2 years, or fine, or both',
    firPossible: 'No'
  },
  {
    code: 'IPC 507',
    name: 'Criminal intimidation by an anonymous communication',
    simpleMeaning: 'Threatening someone anonymously (anonymous calls, messages, letters)',
    punishment: 'Imprisonment up to 2 years in addition to punishment for criminal intimidation',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 67',
    name: 'Publishing obscene material in electronic form (IT Act)',
    simpleMeaning: 'Publishing or transmitting obscene material online or electronically',
    punishment: 'Imprisonment up to 3 years and fine up to Rs. 5 lakh',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 138',
    name: 'Dishonor of cheque (Negotiable Instruments Act)',
    simpleMeaning: 'Cheque bounce due to insufficient funds or other reasons',
    punishment: 'Imprisonment up to 2 years, or fine up to twice the cheque amount, or both',
    firPossible: 'No'
  }
];

async function addAdditionalSections() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(DB_URL);
    console.log('✅ Connected to MongoDB\n');

    let added = 0;
    let existing = 0;

    for (const sectionData of ADDITIONAL_SECTIONS) {
      const found = await Section.findOne({ code: sectionData.code });
      
      if (found) {
        console.log(`✓ ${sectionData.code} exists:`, found.name);
        existing++;
      } else {
        console.log(`⚠️  ${sectionData.code} NOT FOUND - Adding it...`);
        const newSection = new Section(sectionData);
        await newSection.save();
        console.log(`✅ Added ${sectionData.code}: ${sectionData.name}`);
        added++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Section verification complete`);
    console.log(`   Existing: ${existing}`);
    console.log(`   Added: ${added}`);
    console.log(`   Total: ${existing + added}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

addAdditionalSections();
