/**
 * Add missing IPC sections for new fraud types
 */

const mongoose = require('mongoose');
const Section = require('./models/Section');
require('dotenv').config();

const DB_URL = process.env.MONGODB_URI || 'mongodb+srv://IPCfinder:UhMJn8T9bSRwU3aN@ipcfinder.dbnlevh.mongodb.net/ipc-finder?appName=IPCFinder';

const NEW_SECTIONS = [
  {
    code: 'IPC 170',
    name: 'Personating a public servant',
    simpleMeaning: 'Pretending to be a police officer, government official, or other public servant',
    punishment: 'Imprisonment up to 2 years, or fine, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 171',
    name: 'Wearing garb or carrying token used by public servant with fraudulent intent',
    simpleMeaning: 'Wearing police uniform or carrying fake ID to impersonate government official',
    punishment: 'Imprisonment up to 3 months, or fine up to Rs. 200, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 417',
    name: 'Punishment for cheating',
    simpleMeaning: 'General cheating and deception to cause wrongful gain or loss',
    punishment: 'Imprisonment up to 1 year, or fine, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 419',
    name: 'Punishment for cheating by personation',
    simpleMeaning: 'Cheating by pretending to be someone else or using fake identity',
    punishment: 'Imprisonment up to 3 years, or fine, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 66C',
    name: 'Punishment for identity theft (IT Act)',
    simpleMeaning: 'Fraudulently using someone elses password, OTP, or electronic signature',
    punishment: 'Imprisonment up to 3 years and fine up to Rs. 1 lakh',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 66D',
    name: 'Punishment for cheating by personation using computer resource (IT Act)',
    simpleMeaning: 'Online fraud by impersonating someone else using computer or phone',
    punishment: 'Imprisonment up to 3 years and fine up to Rs. 1 lakh',
    firPossible: 'Yes'
  }
];

async function addNewSections() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(DB_URL);
    console.log('✅ Connected to MongoDB\n');

    for (const sectionData of NEW_SECTIONS) {
      const existing = await Section.findOne({ code: sectionData.code });
      
      if (existing) {
        console.log(`✓ ${sectionData.code} exists:`, existing.name);
      } else {
        console.log(`⚠️  ${sectionData.code} NOT FOUND - Adding it...`);
        const newSection = new Section(sectionData);
        await newSection.save();
        console.log(`✅ Added ${sectionData.code}: ${sectionData.name}`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All fraud sections verified successfully');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

addNewSections();
