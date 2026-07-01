const express = require('express');
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  uploadDocument,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my', protect, authorize('patient'), getMyAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.post('/:id/documents', protect, upload.single('document'), uploadDocument);

module.exports = router;
