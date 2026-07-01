const express = require('express');
const {
  getStats,
  getAllDoctors,
  setDoctorApproval,
  getAllUsers,
  setUserStatus,
  getAllAppointments,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', setDoctorApproval);
router.get('/users', getAllUsers);
router.put('/users/:id/status', setUserStatus);
router.get('/appointments', getAllAppointments);

module.exports = router;
