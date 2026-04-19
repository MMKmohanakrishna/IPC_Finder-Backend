/**
 * Verify that IPC 415 and 420 exist in the database
 * If missing, add them
 */

const mongoose = require('mongoose');
const Section = require('./models/Section');
require('dotenv').config();

const DB_URL = process.env.MONGODB_URI || 'mongodb+srv://IPCfinder:UhMJn8T9bSRwU3aN@ipcfinder.dbnlevh.mongodb.net/ipc-finder?appName=IPCFinder';

// IPC sections for job fraud
const JOB_FRAUD_SECTIONS = [
  {
    code: 'IPC 415',
    name: 'Cheating',
    purpose: 'Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property',
    punishment: 'Imprisonment up to 1 year, or fine, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 420',
    name: 'Cheating and dishonestly inducing delivery of property',
    purpose: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property or to make, alter or destroy the whole or any part of a valuable security',
    punishment: 'Imprisonment up to 7 years and fine',
    firPossible: 'Yes'
  }
];

async function verifyAndAddSections() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(DB_URL);
    console.log('✅ Connected to MongoDB\n');

    for (const sectionData of JOB_FRAUD_SECTIONS) {
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
    console.log('✅ Job fraud sections verified successfully');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test job fraud detection
    console.log('🧪 Testing job fraud rule...\n');
    
    const testInputs = [
      'I paid Rs 5000 for a job interview but they never called',
      'Fake recruitment agency took joining fee of ₹10000',
      'Work from home job scam took training fee',
      'Consultancy asked money for placement but disappeared'
    ];

    for (const text of testInputs) {
      console.log(`Input: "${text}"`);
      
      // Simple test - check if money and job keywords are present
      const moneyRegex = /₹|rs\.?|inr|money|amount|paid|sent|took|fee|payment|rupees|cash/i;
      const jobKeywords = ['job', 'employment', 'recruitment', 'interview', 'placement', 'consultancy', 'joining fee', 'training fee', 'work from home'];
      
      const hasMoney = moneyRegex.test(text);
      const hasJob = jobKeywords.some(word => text.toLowerCase().includes(word));
      
      console.log(`  Money detected: ${hasMoney ? '✅' : '❌'}`);
      console.log(`  Job keyword: ${hasJob ? '✅' : '❌'}`);
      console.log(`  Rule should fire: ${hasMoney && hasJob ? '✅ YES' : '❌ NO'}\n`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

verifyAndAddSections();
