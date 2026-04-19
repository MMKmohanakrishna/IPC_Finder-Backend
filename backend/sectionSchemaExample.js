/**
 * ================================================
 * MONGOOSE SCHEMA - IPC Section
 * ================================================
 * 
 * Simple schema with 5 required fields:
 * - code: IPC section code (e.g., "IPC 378")
 * - name: Section name
 * - purpose: What this section is for
 * - punishment: Penalty/punishment details
 * - firPossible: Can FIR be filed?
 */

const mongoose = require('mongoose');

// Define the schema
const sectionSchema = new mongoose.Schema({
  
  // IPC Section Code (e.g., "IPC 378", "IPC 420")
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Section Name (e.g., "Theft", "Cheating")
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Purpose - What is this section for?
  purpose: {
    type: String,
    required: true
  },
  
  // Punishment - What is the penalty?
  punishment: {
    type: String,
    required: true
  },
  
  // Can FIR be filed? (Yes/No/Depends)
  firPossible: {
    type: String,
    required: true,
    enum: ['Yes', 'No', 'Depends'],
    default: 'Yes'
  }
  
}, {
  timestamps: true  // Adds createdAt and updatedAt
});

// Create the model
const Section = mongoose.model('Section', sectionSchema);

// Export
module.exports = Section;

// ================================================
// USAGE EXAMPLES
// ================================================

/*

// Example 1: Create a new section
const section = new Section({
  code: 'IPC 378',
  name: 'Theft',
  purpose: 'Dishonestly taking movable property without consent',
  punishment: 'Imprisonment up to 3 years, or fine, or both',
  firPossible: 'Yes'
});

await section.save();


// Example 2: Find by code
const section = await Section.findOne({ code: 'IPC 378' });


// Example 3: Find all sections where FIR is possible
const sections = await Section.find({ firPossible: 'Yes' });


// Example 4: Update a section
await Section.updateOne(
  { code: 'IPC 378' },
  { punishment: 'Updated punishment details' }
);


// Example 5: Get all sections
const allSections = await Section.find({}).sort({ code: 1 });

*/
