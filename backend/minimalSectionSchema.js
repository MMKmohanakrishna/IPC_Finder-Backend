/**
 * ================================================
 * MINIMAL MONGOOSE SCHEMA - IPC Section
 * ================================================
 */

const mongoose = require('mongoose');

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
    enum: ['Yes', 'No', 'Depends']
  }
  
});

module.exports = mongoose.model('Section', sectionSchema);
