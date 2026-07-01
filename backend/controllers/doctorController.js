const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all approved doctors (with optional filters)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { specialization, search } = req.query;
    const query = { isApproved: true };

    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }

    let doctors = await Doctor.find(query).populate('user', 'name email phone avatar');

    if (search) {
      const re = new RegExp(search, 'i');
      doctors = doctors.filter((d) => re.test(d.user.name) || re.test(d.specialization));
    }

    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by id
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone avatar');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Update own doctor profile (specialization, fee, availability, about)
// @route   PUT /api/doctors/me
// @access  Private (doctor)
const updateMyDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const fields = [
      'specialization',
      'qualifications',
      'experienceYears',
      'consultationFee',
      'about',
      'clinicAddress',
      'availability',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of distinct specializations (for filter dropdown)
// @route   GET /api/doctors/specializations/list
// @access  Public
const getSpecializations = async (req, res, next) => {
  try {
    const specializations = await Doctor.distinct('specialization', { isApproved: true });
    res.json(specializations);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDoctors, getDoctorById, updateMyDoctorProfile, getSpecializations };
