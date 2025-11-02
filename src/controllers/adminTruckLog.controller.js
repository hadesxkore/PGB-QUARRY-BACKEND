import AdminTruckLog from '../models/AdminTruckLog.model.js';
import Quarry from '../models/Quarry.model.js';

// @desc    Get all admin truck logs
// @route   GET /api/admin-truck-logs
// @access  Private (Admin only)
export const getAdminTruckLogs = async (req, res, next) => {
  try {
    const { logType, quarryId, startDate, endDate } = req.query;
    
    let query = {};
    
    // Filter by log type (in/out)
    if (logType) {
      query.logType = logType;
    }
    
    // Filter by quarry
    if (quarryId) {
      query.quarryId = quarryId;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.logDate = {};
      if (startDate) query.logDate.$gte = new Date(startDate);
      if (endDate) query.logDate.$lte = new Date(endDate);
    }
    
    const logs = await AdminTruckLog.find(query)
      .populate('quarryId', 'name location quarryOwner')
      .populate('loggedBy', 'name username')
      .sort({ logDate: -1 });
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single admin truck log
// @route   GET /api/admin-truck-logs/:id
// @access  Private (Admin only)
export const getAdminTruckLog = async (req, res, next) => {
  try {
    const log = await AdminTruckLog.findById(req.params.id)
      .populate('quarryId', 'name location quarryOwner operator')
      .populate('loggedBy', 'name username');
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Admin truck log not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new admin truck log
// @route   POST /api/admin-truck-logs
// @access  Private (Admin only)
export const createAdminTruckLog = async (req, res, next) => {
  try {
    const { quarryId, logType, truckCount, notes, logDate } = req.body;
    
    // Verify quarry exists
    const quarry = await Quarry.findById(quarryId);
    if (!quarry) {
      return res.status(404).json({
        success: false,
        message: 'Quarry not found'
      });
    }
    
    // Create log
    const log = await AdminTruckLog.create({
      quarryId,
      logType,
      truckCount,
      notes,
      logDate: logDate || Date.now(),
      loggedBy: req.user.id
    });
    
    // Populate before sending response
    await log.populate('quarryId', 'name location quarryOwner');
    await log.populate('loggedBy', 'name username');
    
    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('adminTruckLog:created', log);
    }
    
    res.status(201).json({
      success: true,
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin truck log
// @route   PUT /api/admin-truck-logs/:id
// @access  Private (Admin only)
export const updateAdminTruckLog = async (req, res, next) => {
  try {
    let log = await AdminTruckLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Admin truck log not found'
      });
    }
    
    const { truckCount, notes, logDate } = req.body;
    
    log = await AdminTruckLog.findByIdAndUpdate(
      req.params.id,
      { truckCount, notes, logDate },
      { new: true, runValidators: true }
    )
      .populate('quarryId', 'name location quarryOwner')
      .populate('loggedBy', 'name username');
    
    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('adminTruckLog:updated', log);
    }
    
    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete admin truck log
// @route   DELETE /api/admin-truck-logs/:id
// @access  Private (Admin only)
export const deleteAdminTruckLog = async (req, res, next) => {
  try {
    const log = await AdminTruckLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Admin truck log not found'
      });
    }
    
    await log.deleteOne();
    
    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('adminTruckLog:deleted', { id: req.params.id });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get statistics for admin truck logs
// @route   GET /api/admin-truck-logs/stats
// @access  Private (Admin only)
export const getAdminTruckLogStats = async (req, res, next) => {
  try {
    const { startDate, endDate, quarryId } = req.query;
    
    let matchQuery = {};
    if (quarryId) matchQuery.quarryId = mongoose.Types.ObjectId(quarryId);
    if (startDate || endDate) {
      matchQuery.logDate = {};
      if (startDate) matchQuery.logDate.$gte = new Date(startDate);
      if (endDate) matchQuery.logDate.$lte = new Date(endDate);
    }
    
    const stats = await AdminTruckLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$logType',
          totalTrucks: { $sum: '$truckCount' },
          totalLogs: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
