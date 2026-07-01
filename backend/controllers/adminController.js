const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get platform-wide stats for the admin dashboard
// @route   GET /api/admin/stats
// @access  Private (admin)
const getStats = async (req, res, next) => {
  try {
    const [totalPatients, totalDoctors, pendingDoctors, totalAppointments, upcomingAppointments] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      Doctor.countDocuments({ isApproved: true }),
      Doctor.countDocuments({ isApproved: false }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: { $in: ['pending', 'confirmed'] }, date: { $gte: new Date() } }),
    ]);

    res.json({ totalPatients, totalDoctors, pendingDoctors, totalAppointments, upcomingAppointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all doctors, including unapproved ones
// @route   GET /api/admin/doctors
// @access  Private (admin)
const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email phone isActive');
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a doctor profile
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (admin)
const setDoctorApproval = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    doctor.isApproved = !!isApproved;
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (patients + doctors)
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Activate / deactivate a user account
// @route   PUT /api/admin/users/:id/status
// @access  Private (admin)
const setUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isActive = !!isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get every appointment on the platform
// @route   GET /api/admin/appointments
// @access  Private (admin)
const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getAllDoctors,
  setDoctorApproval,
  getAllUsers,
  setUserStatus,
  getAllAppointments,
};
