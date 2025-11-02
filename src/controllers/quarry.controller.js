import Quarry from '../models/Quarry.model.js';

// @desc    Get all quarries
// @route   GET /api/quarries
// @access  Private
export const getQuarries = async (req, res, next) => {
  try {
    const quarries = await Quarry.find({})
      .populate('addedBy', 'name username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quarries.length,
      data: quarries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quarry
// @route   GET /api/quarries/:id
// @access  Private
export const getQuarry = async (req, res, next) => {
  try {
    const quarry = await Quarry.findById(req.params.id)
      .populate('addedBy', 'name username email');

    if (!quarry) {
      return res.status(404).json({
        success: false,
        message: 'Quarry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quarry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new quarry
// @route   POST /api/quarries
// @access  Private (Admin only)
export const createQuarry = async (req, res, next) => {
  try {
    const { name, location, operator, permitNumber, status, quarryOwner, contactNumber, description } = req.body;

    // Check if permit number already exists
    const permitExists = await Quarry.findOne({ permitNumber });
    
    if (permitExists) {
      return res.status(400).json({
        success: false,
        message: 'Quarry with this permit number already exists'
      });
    }

    // Create quarry
    const quarry = await Quarry.create({
      name,
      location,
      operator,
      permitNumber,
      status: status || 'Active',
      quarryOwner,
      contactNumber,
      description,
      addedBy: req.user.id
    });

    // Populate addedBy before sending response
    await quarry.populate('addedBy', 'name username');

    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('quarry:created', quarry);
    }

    res.status(201).json({
      success: true,
      data: quarry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quarry
// @route   PUT /api/quarries/:id
// @access  Private (Admin only)
export const updateQuarry = async (req, res, next) => {
  try {
    let quarry = await Quarry.findById(req.params.id);

    if (!quarry) {
      return res.status(404).json({
        success: false,
        message: 'Quarry not found'
      });
    }

    // If updating permit number, check if it's unique
    if (req.body.permitNumber && req.body.permitNumber !== quarry.permitNumber) {
      const permitExists = await Quarry.findOne({ 
        permitNumber: req.body.permitNumber,
        _id: { $ne: req.params.id }
      });
      
      if (permitExists) {
        return res.status(400).json({
          success: false,
          message: 'Quarry with this permit number already exists'
        });
      }
    }

    quarry = await Quarry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('addedBy', 'name username');

    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('quarry:updated', quarry);
    }

    res.status(200).json({
      success: true,
      data: quarry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quarry
// @route   DELETE /api/quarries/:id
// @access  Private (Admin only)
export const deleteQuarry = async (req, res, next) => {
  try {
    const quarry = await Quarry.findByIdAndDelete(req.params.id);

    if (!quarry) {
      return res.status(404).json({
        success: false,
        message: 'Quarry not found'
      });
    }

    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('quarry:deleted', req.params.id);
    }

    res.status(200).json({
      success: true,
      message: 'Quarry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
