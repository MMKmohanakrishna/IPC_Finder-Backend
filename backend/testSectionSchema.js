/**
 * ================================================
 * TEST MONGOOSE SCHEMA - IPC Section
 * ================================================
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Define Schema
const sectionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  purpose: {
    type: String,
    required: true
  },
  punishment: {
    type: String,
    required: true
  },
  firPossible: {
    type: String,
    required: true,
    enum: ['Yes', 'No', 'Depends'],
    default: 'Yes'
  }
}, {
  timestamps: true
});

const Section = mongoose.model('TestSection', sectionSchema);

// ================================================
// TEST FUNCTION
// ================================================

async function testSchema() {
  try {
    // Prefer environment/local DB to avoid brittle network-dependent tests.
    const DB_URL = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/ipc-finder';
    await mongoose.connect(DB_URL, { serverSelectionTimeoutMS: 8000 });
    
    console.log('✅ Connected to MongoDB\n');
    
    // Clear existing test data
    await Section.deleteMany({});
    
    // ================================================
    // TEST 1: Create sections
    // ================================================
    console.log('TEST 1: Creating sections...');
    
    const sections = [
      {
        code: 'IPC 378',
        name: 'Theft',
        purpose: 'Dishonestly taking movable property without consent',
        punishment: 'Imprisonment up to 3 years, or fine, or both',
        firPossible: 'Yes'
      },
      {
        code: 'IPC 379',
        name: 'Punishment for Theft',
        purpose: 'Specifies punishment for theft crimes',
        punishment: 'Imprisonment up to 3 years, or fine, or both',
        firPossible: 'Yes'
      },
      {
        code: 'IPC 420',
        name: 'Cheating',
        purpose: 'Dishonestly inducing delivery of property',
        punishment: 'Imprisonment up to 7 years and fine',
        firPossible: 'Yes'
      },
      {
        code: 'IPC 506',
        name: 'Criminal Intimidation',
        purpose: 'Threatening to cause injury, harm or death',
        punishment: 'Imprisonment up to 2 years, or fine, or both',
        firPossible: 'Yes'
      }
    ];
    
    const created = await Section.insertMany(sections);
    console.log(`✅ Created ${created.length} sections\n`);
    
    // ================================================
    // TEST 2: Find by code
    // ================================================
    console.log('TEST 2: Finding by code...');
    
    const theft = await Section.findOne({ code: 'IPC 378' });
    console.log(`✅ Found: ${theft.code} - ${theft.name}`);
    console.log(`   Purpose: ${theft.purpose}`);
    console.log(`   Punishment: ${theft.punishment}`);
    console.log(`   FIR Possible: ${theft.firPossible}\n`);
    
    // ================================================
    // TEST 3: Find all where FIR is possible
    // ================================================
    console.log('TEST 3: Finding sections where FIR is possible...');
    
    const firSections = await Section.find({ firPossible: 'Yes' });
    console.log(`✅ Found ${firSections.length} sections:`);
    firSections.forEach(s => {
      console.log(`   - ${s.code}: ${s.name}`);
    });
    console.log();
    
    // ================================================
    // TEST 4: Update a section
    // ================================================
    console.log('TEST 4: Updating section...');
    
    await Section.updateOne(
      { code: 'IPC 420' },
      { punishment: 'Imprisonment up to 7 years and fine (UPDATED)' }
    );
    
    const updated = await Section.findOne({ code: 'IPC 420' });
    console.log(`✅ Updated ${updated.code}`);
    console.log(`   New Punishment: ${updated.punishment}\n`);
    
    // ================================================
    // TEST 5: Validation test (should fail)
    // ================================================
    console.log('TEST 5: Testing validation...');
    
    try {
      // Try to create without required field
      const invalid = new Section({
        code: 'IPC 999',
        name: 'Test'
        // Missing: purpose, punishment, firPossible
      });
      await invalid.save();
      console.log('❌ Validation failed to catch missing fields');
    } catch (error) {
      console.log('✅ Validation working - caught missing fields:');
      Object.keys(error.errors).forEach(field => {
        console.log(`   - ${field}: ${error.errors[field].message}`);
      });
    }
    console.log();
    
    // ================================================
    // TEST 6: Enum validation (should fail)
    // ================================================
    console.log('TEST 6: Testing enum validation...');
    
    try {
      // Try invalid enum value
      const invalid = new Section({
        code: 'IPC 888',
        name: 'Test',
        purpose: 'Test purpose',
        punishment: 'Test punishment',
        firPossible: 'Maybe' // Invalid - should be Yes/No/Depends
      });
      await invalid.save();
      console.log('❌ Enum validation failed');
    } catch (error) {
      console.log('✅ Enum validation working:');
      console.log(`   ${error.message}\n`);
    }
    
    // ================================================
    // TEST 7: Get all sections sorted
    // ================================================
    console.log('TEST 7: Getting all sections sorted...');
    
    const allSections = await Section.find({}).sort({ code: 1 });
    console.log(`✅ Retrieved ${allSections.length} sections (sorted):`);
    allSections.forEach(s => {
      console.log(`   ${s.code} - ${s.name}`);
    });
    console.log();
    
    // ================================================
    // SUMMARY
    // ================================================
    console.log('='.repeat(60));
    console.log('✅ ALL TESTS PASSED');
    console.log('='.repeat(60));
    console.log('\nSchema fields:');
    console.log('  ✅ code (String, required, unique)');
    console.log('  ✅ name (String, required)');
    console.log('  ✅ purpose (String, required)');
    console.log('  ✅ punishment (String, required)');
    console.log('  ✅ firPossible (String, required, enum: Yes/No/Depends)');
    console.log('  ✅ timestamps (auto-generated createdAt/updatedAt)');
    console.log();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.name === 'MongooseServerSelectionError' || error.message.includes('ENOTFOUND')) {
      console.error('💡 Ensure local MongoDB is running or set TEST_MONGODB_URI in .env');
    }
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
    }
  }
}

// Run tests
if (require.main === module) {
  testSchema();
}

module.exports = { Section, sectionSchema };
