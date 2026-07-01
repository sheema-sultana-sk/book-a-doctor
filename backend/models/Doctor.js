const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true }, // "17:00"
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    qualifications: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
      default: '',
    },
    clinicAddress: {
      type: String,
      default: '',
    },
    availability: [availabilitySlotSchema],
    isApproved: {
      type: Boolean,
      default: false, // admin must approve new doctor profiles
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
