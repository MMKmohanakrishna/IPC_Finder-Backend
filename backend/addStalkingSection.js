const mongoose = require('mongoose');
const Section = require('./models/Section');

const MONGODB_URI = 'mongodb+srv://IPCfinder:UhMJn8T9bSRwU3aN@ipcfinder.dbnlevh.mongodb.net/ipc-finder';

const stalkingSection = {
  code: 'IPC 354D',
  name: 'Stalking',
  simpleMeaning: 'Following, contacting, or attempting to contact a person repeatedly despite clear indication of disinterest, causing fear',
  punishment: 'First offense: Up to 3 years and fine. Subsequent offense: Up to 5 years and fine',
  firPossible: 'Yes'
};

async function addSection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Section.findOne({ code: stalkingSection.code });
    if (existing) {
      console.log(`⏭️  Section already exists: ${stalkingSection.code}`);
    } else {
      await Section.create(stalkingSection);
      console.log(`✅ Added ${stalkingSection.code}: ${stalkingSection.name}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

addSection();
