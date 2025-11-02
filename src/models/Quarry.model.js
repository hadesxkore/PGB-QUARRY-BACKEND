import mongoose from 'mongoose';

const QuarrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide quarry name'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    trim: true
  },
  operator: {
    type: String,
    required: [true, 'Please provide operator name'],
    trim: true
  },
  permitNumber: {
    type: String,
    required: [true, 'Please provide permit number'],
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active'
  },
  quarryOwner: {
    type: String,
    required: [true, 'Please provide quarry owner name'],
    trim: true
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
