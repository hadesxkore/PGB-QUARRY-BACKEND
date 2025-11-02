import mongoose from 'mongoose';

const TruckLogSchema = new mongoose.Schema({
  truck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    required: [true, 'Please add a truck reference'],
  },
  plateNumber: {
    type: String,
    required: [true, 'Please add a plate number'],
    trim: true,
    uppercase: true,
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please add a company'],
    trim: true,
  },
  logType: {
    type: String,
    enum: ['IN', 'OUT'],
    required: [true, 'Please specify log type (IN or OUT)'],
  },
  logDate: {
    type: Date,
    required: [true, 'Please add a log date'],
  },
  logTime: {
    type: String,
    required: [true, 'Please add a log time'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user reference'],
  },
}, {
  timestamps: true,
});

// Index for faster queries
TruckLogSchema.index({ logDate: 1, logType: 1 });
TruckLogSchema.index({ truck: 1, logDate: 1 });

export default mongoose.model('TruckLog', TruckLogSchema);
