import mongoose from 'mongoose';

const adminTruckLogSchema = new mongoose.Schema({
  quarryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quarry',
    required: [true, 'Please provide quarry ID']
  },
  logType: {
    type: String,
    enum: ['in', 'out'],
    required: [true, 'Please specify log type (in/out)']
  },
  truckCount: {
    type: Number,
    required: [true, 'Please provide truck count'],
    min: [1, 'Truck count must be at least 1']
  },
  notes: {
    type: String,
    trim: true
  },
  loggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  logDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
adminTruckLogSchema.index({ quarryId: 1, logType: 1, logDate: -1 });
adminTruckLogSchema.index({ loggedBy: 1 });

const AdminTruckLog = mongoose.model('AdminTruckLog', adminTruckLogSchema);

export default AdminTruckLog;
