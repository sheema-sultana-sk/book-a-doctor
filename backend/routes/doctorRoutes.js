const express = require('express');
const {
  getDoctors,
  getDoctorById,
  updateMyDoctorProfile,
  getSpecializations,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDoctors);
router.get('/specializations/list', getSpecializations);
router.put('/me', protect, authorize('doctor'), updateMyDoctorProfile);
router.get('/:id', getDoctorById);

module.exports = router;
