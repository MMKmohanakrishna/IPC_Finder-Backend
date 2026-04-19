const mongoose = require('mongoose');

/**
 * Query Model
 * Stores user queries for analytics and improvements
 */
const querySchema = new mongoose.Schema({
  userText: {
    type: String,
    required: true,
    // The original problem description from the user
  },
  matchedSections: [{
    sectionCode: {
      type: String,
      // IPC section that was matched
    },
    score: {
      type: Number,
      // Confidence score of the match
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    // Timestamp of the query
  }
});

// Index for analytics queries
querySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Query', querySchema);
