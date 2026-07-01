const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'], // e.g. "10:30 AM"
    },
    reason: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    documents: [
      {
        fileName: String,
        filePath: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    notes: {
      type: String, // doctor's private notes after consultation
      default: '',
    },
    cancelReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
