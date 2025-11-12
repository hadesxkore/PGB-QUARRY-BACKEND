import User from '../models/User.model.js';

// @desc    Create new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  try {
    const { username, name, email, password, contactNumber, location, company, role } = req.body;

    // Check if user exists - only check email if it's provided
    const query = { username: username.toLowerCase() };
    if (email && email.trim() !== '') {
      const userExists = await User.findOne({ 
        $or: [{ email }, { username: username.toLowerCase() }] 
      });
      
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }
    } else {
      // Only check username if no email provided
      const userExists = await User.findOne({ username: username.toLowerCase() });
      
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
    }

    // Create user - only include email if provided
    const userData = {
      username: username.toLowerCase(),
      password,
      role: role || 'user'
    };
    
    // Add optional fields only if they have values
    if (name) userData.name = name;
    if (email && email.trim() !== '') userData.email = email;
    if (contactNumber) userData.contactNumber = contactNumber;
    if (location) userData.location = location;
    if (company) userData.company = company;
    
    const user = await User.create(userData);

    // Return user without password
    const userResponse = await User.findById(user._id).select('-password');

    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    // Users can only update their own profile unless they're admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // If password is being updated, hash it first
    if (req.body.password) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      user.password = req.body.password;
      await user.save();
      
      const updatedUser = await User.findById(req.params.id).select('-password');
      return res.status(200).json({
        success: true,
        data: updatedUser
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
