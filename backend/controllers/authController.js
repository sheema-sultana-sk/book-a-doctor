const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @desc    Register a new user (patient or doctor)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, specialization, consultationFee } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Only allow self-registration as patient or doctor; admins are seeded/promoted separately
    const allowedRole = role === 'doctor' ? 'doctor' : 'patient';

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: allowedRole,
    });

    if (allowedRole === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization: specialization || 'General Physician',
        consultationFee: consultationFee || 0,
        isApproved: false,
      });
    }

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact support.' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }
    res.json({ user, doctorProfile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateMe };
