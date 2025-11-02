import mongoose from 'mongoose';

const TruckSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: [true, 'Please add a plate number'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Please add a model'],
    trim: true,
  },
  capacity: {
    type: String,
    required: [true, 'Please add capacity'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please add a company'],
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add an owner'],
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  currentStatus: {
    type: String,
    enum: ['IN', 'OUT', 'AVAILABLE'],
    default: 'AVAILABLE',
  },
  lastLogTime: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Truck', TruckSchema);
