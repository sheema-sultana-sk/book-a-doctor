const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');

const notify = async (userId, title, message, type = 'appointment', relatedAppointment = null) => {
  try {
    await Notification.create({ user: userId, title, message, type, relatedAppointment });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (patient)
const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'doctorId, date and timeSlot are required' });
    }

    const doctor = await Doctor.findById(doctorId).populate('user', 'name');
    if (!doctor || !doctor.isApproved) {
      return res.status(404).json({ message: 'Doctor not found or not available for booking' });
    }

    const clash = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (clash) {
      return res.status(400).json({ message: 'This time slot is already booked. Please choose another.' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      reason,
    });

    await notify(
      doctor.user._id,
      'New appointment request',
      `${req.user.name} requested an appointment on ${new Date(date).toDateString()} at ${timeSlot}.`,
      'appointment',
      appointment._id
    );

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments for the logged-in patient
// @route   GET /api/appointments/my
// @access  Private (patient)
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email phone' } })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments for the logged-in doctor
// @route   GET /api/appointments/doctor
// @access  Private (doctor)
const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (confirm / complete / cancel) + notes
// @route   PUT /api/appointments/:id/status
// @access  Private (doctor, patient-for-cancel, admin)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, notes, cancelReason } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name' },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isOwningDoctor = req.user.role === 'doctor' && appointment.doctor.user._id.toString() === req.user._id.toString();
    const isOwningPatient = req.user.role === 'patient' && appointment.patient.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwningDoctor && !isOwningPatient && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Patients may only cancel; doctors/admins may set any valid status
    if (isOwningPatient && status && status !== 'cancelled') {
      return res.status(403).json({ message: 'Patients can only cancel appointments' });
    }

    if (status) appointment.status = status;
    if (notes !== undefined && (isOwningDoctor || isAdmin)) appointment.notes = notes;
    if (cancelReason !== undefined) appointment.cancelReason = cancelReason;

    await appointment.save();

    const notifyTarget = isOwningDoctor ? appointment.patient : appointment.doctor.user._id;
    await notify(
      notifyTarget,
      'Appointment updated',
      `Your appointment on ${appointment.date.toDateString()} at ${appointment.timeSlot} is now "${appointment.status}".`,
      'appointment',
      appointment._id
    );

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload a document to an appointment (e.g. lab report, prescription)
// @route   POST /api/appointments/:id/documents
// @access  Private (patient or doctor on that appointment)
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const appointment = await Appointment.findById(req.params.id).populate('doctor');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isOwningPatient = appointment.patient.toString() === req.user._id.toString();
    const isOwningDoctor = req.user.role === 'doctor' && appointment.doctor.user.toString() === req.user._id.toString();

    if (!isOwningPatient && !isOwningDoctor) {
      return res.status(403).json({ message: 'Not authorized to upload documents to this appointment' });
    }

    appointment.documents.push({
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  uploadDocument,
};
