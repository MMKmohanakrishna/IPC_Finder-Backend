const mongoose = require('mongoose');

/**
 * Section Model
 * Represents an IPC section with all its details
 */
const sectionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // Example: "IPC 420"
  },
  name: {
    type: String,
    required: true,
    trim: true,
    // Example: "Cheating and dishonestly inducing delivery of property"
  },
  simpleMeaning: {
    type: String,
    required: true,
    // Simple explanation in plain language
  },
  usedWhen: [{
    type: String,
    // Array of scenarios when this section is used
  }],
  examples: [{
    type: String,
    // Real-life examples of when this section applies
  }],
  punishment: {
    type: String,
    required: true,
    // Description of punishment/penalty
  },
  firPossible: {
    type: String,
    enum: ['Yes', 'No', 'Depends'],
    required: true,
    // Whether FIR can be filed under this section
  },
  keywords: [{
    type: String,
    lowercase: true,
    // Keywords for text matching (e.g., "fraud", "cheat", "deceive")
  }]
}, {
  timestamps: true
});

// Create text index for search functionality
sectionSchema.index({ code: 'text', name: 'text', keywords: 'text' });

module.exports = mongoose.model('Section', sectionSchema);
