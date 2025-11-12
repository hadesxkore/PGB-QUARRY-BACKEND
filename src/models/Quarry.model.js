import mongoose from 'mongoose';

const QuarrySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    trim: true
  },
  operator: {
    type: String,
    trim: true
  },
  permitNumber: {
    type: String,
    required: [true, 'Please provide permit number'],
    unique: true,
    trim: true
  },
  dateOfIssuance: {
    type: Date
  },
  dateOfExpiration: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active'
  },
  proponent: {
    type: String,
    required: [true, 'Please provide proponent name'],
    trim: true
  },
  area: {
    type: Number,
    min: [0, 'Area must be a positive number']
  },
  contactNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Philippine phone number: 11 digits, starts with 09
        return !v || /^09\d{9}$/.test(v);
      },
      message: 'Contact number must be a valid Philippine mobile number (11 digits starting with 09)'
    }
  },
  description: {
    type: String,
    trim: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Quarry', QuarrySchema);
