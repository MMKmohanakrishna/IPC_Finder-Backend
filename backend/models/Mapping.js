const mongoose = require('mongoose');

/**
 * Mapping Model
 * Maps keywords/patterns to IPC sections with weights
 * Used for classification logic
 */
const mappingSchema = new mongoose.Schema({
  sectionCode: {
    type: String,
    required: true,
    ref: 'Section',
    // Reference to the IPC section code
  },
  patterns: [{
    type: String,
    lowercase: true,
    // Keywords or phrases that trigger this section
    // Examples: "fraud", "stolen property", "physical assault"
  }],
  weight: {
    type: Number,
    default: 1,
    min: 0,
    max: 10,
    // Importance/relevance weight (higher = more important match)
  }
}, {
  timestamps: true
});

// Index for faster pattern matching
mappingSchema.index({ patterns: 1, sectionCode: 1 });

module.exports = mongoose.model('Mapping', mappingSchema);
