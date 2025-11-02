import TruckLog from '../models/TruckLog.model.js';
import Truck from '../models/Truck.model.js';

// @desc    Create truck logs (bulk)
// @route   POST /api/truck-logs
// @access  Private
export const createTruckLogs = async (req, res, next) => {
  try {
    const { logs, logType, logDate, logTime } = req.body;

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide logs array'
      });
    }

    if (!logType || !['IN', 'OUT'].includes(logType)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid log type (IN or OUT)'
      });
    }

    // Create logs for each truck
    const createdLogs = [];
    
    for (const log of logs) {
      if (log.count > 0) {
        // Get truck details
        const truck = await Truck.findById(log.truckId);
        
        if (!truck) {
          continue; // Skip if truck not found
        }

        // Create log entry
        const truckLog = await TruckLog.create({
          truck: truck._id,
          plateNumber: truck.plateNumber,
          brand: truck.brand,
          company: truck.company,
          logType,
          logDate: logDate || new Date(),
          logTime: logTime || new Date().toLocaleTimeString('en-US', { hour12: true }),
          user: req.user.id,
        });

        // Update truck's current status
        await Truck.findByIdAndUpdate(truck._id, {
          currentStatus: logType, // 'IN' or 'OUT'
          lastLogTime: new Date(),
        });

        createdLogs.push(truckLog);
      }
    }

    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('truckLog:created', {
        logs: createdLogs,
        logType,
        logDate
      });
    }

    res.status(201).json({
      success: true,
      count: createdLogs.length,
      data: createdLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all truck logs
// @route   GET /api/truck-logs
// @access  Private
export const getTruckLogs = async (req, res, next) => {
  try {
    const { logType, startDate, endDate, truckId } = req.query;

    // Build query
    const query = {};
    
    if (logType) {
      query.logType = logType;
    }

    if (startDate || endDate) {
      query.logDate = {};
      if (startDate) {
        query.logDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.logDate.$lte = new Date(endDate);
      }
    }

    if (truckId) {
      query.truck = truckId;
    }

    const logs = await TruckLog.find(query)
      .populate('truck', 'plateNumber brand model capacity')
      .populate('user', 'name username')
      .sort({ logDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get truck log statistics
// @route   GET /api/truck-logs/stats
// @access  Private
export const getTruckLogStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.logDate = {};
      if (startDate) {
        matchStage.logDate.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.logDate.$lte = new Date(endDate);
      }
    }

    const stats = await TruckLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$logDate' } },
            logType: '$logType'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all truck logs from all users (Admin only)
// @route   GET /api/truck-logs/all
// @access  Private (Admin only)
export const getAllTruckLogs = async (req, res, next) => {
  try {
    const { logType, startDate, endDate, truckId } = req.query;

    // Build query - NO user filter for admin
    const query = {};
    
    if (logType) {
      query.logType = logType;
    }

    if (startDate || endDate) {
      query.logDate = {};
      if (startDate) {
        query.logDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.logDate.$lte = new Date(endDate);
      }
    }

    if (truckId) {
      query.truck = truckId;
    }

    const logs = await TruckLog.find(query)
      .populate('truck', 'plateNumber brand model capacity')
      .populate('user', 'name username')
      .sort({ logDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete truck log
// @route   DELETE /api/truck-logs/:id
// @access  Private (Admin only)
export const deleteTruckLog = async (req, res, next) => {
  try {
    const log = await TruckLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Truck log not found'
      });
    }

    await log.deleteOne();

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('truckLog:deleted', req.params.id);
    }

    res.status(200).json({
      success: true,
      message: 'Truck log deleted'
    });
  } catch (error) {
    next(error);
  }
};
