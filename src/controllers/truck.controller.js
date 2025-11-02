import Truck from '../models/Truck.model.js';

// @desc    Get all trucks
// @route   GET /api/trucks
// @access  Private
export const getTrucks = async (req, res, next) => {
  try {
    const { currentStatus } = req.query;
    
    // Build query - filter by owner
    const query = { owner: req.user.id };
    
    // Add status filter if provided
    if (currentStatus) {
      query.currentStatus = currentStatus;
    }
    
    const trucks = await Truck.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trucks.length,
      data: trucks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single truck
// @route   GET /api/trucks/:id
// @access  Private
export const getTruck = async (req, res, next) => {
  try {
    const truck = await Truck.findById(req.params.id);

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Truck not found'
      });
    }

    res.status(200).json({
      success: true,
      data: truck
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new truck
// @route   POST /api/trucks
// @access  Private
export const createTruck = async (req, res, next) => {
  try {
    const { plateNumber, brand, model, capacity, company, status } = req.body;

    // Check if truck with same plate number exists
    const truckExists = await Truck.findOne({ 
      plateNumber: plateNumber.toUpperCase() 
    });
    
    if (truckExists) {
      return res.status(400).json({
        success: false,
        message: 'Truck with this plate number already exists'
      });
    }

    // Create truck
    const truck = await Truck.create({
      plateNumber: plateNumber.toUpperCase(),
      brand,
      model,
      capacity,
      company,
      owner: req.user.id,
      status: status || 'Active'
    });

    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('truck:created', truck);
    }

    res.status(201).json({
      success: true,
      data: truck
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update truck
// @route   PUT /api/trucks/:id
// @access  Private
export const updateTruck = async (req, res, next) => {
  try {
    let truck = await Truck.findById(req.params.id);

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Truck not found'
      });
    }

    // If updating plate number, check if it's unique
    if (req.body.plateNumber && req.body.plateNumber !== truck.plateNumber) {
      const plateExists = await Truck.findOne({ 
        plateNumber: req.body.plateNumber.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (plateExists) {
        return res.status(400).json({
          success: false,
          message: 'Truck with this plate number already exists'
        });
      }
      req.body.plateNumber = req.body.plateNumber.toUpperCase();
    }

    truck = await Truck.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('truck:updated', truck);
    }

    res.status(200).json({
      success: true,
      data: truck
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trucks from all users (Admin only)
// @route   GET /api/trucks/all
// @access  Private (Admin)
export const getAllTrucks = async (req, res, next) => {
  try {
    // Get all trucks from all users - NO owner filter
    const trucks = await Truck.find({})
      .populate('owner', 'name username company')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trucks.length,
      data: trucks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete truck
// @route   DELETE /api/trucks/:id
// @access  Private
export const deleteTruck = async (req, res, next) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Truck not found'
      });
    }

    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('truck:deleted', req.params.id);
    }

    res.status(200).json({
      success: true,
      message: 'Truck deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
