/**
 * Seed script - populates the database with demo data:
 * - 1 admin
 * - 3 approved doctors (with availability)
 * - 1 patient
 *
 * Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing Users and Doctors...');
  await User.deleteMany();
  await Doctor.deleteMany();

  console.log('Creating admin...');
  await User.create({
    name: 'Platform Admin',
    email: 'admin@bookadoctor.com',
    password: 'Admin@123',
    role: 'admin',
  });

  console.log('Creating patient...');
  await User.create({
    name: 'Jane Patient',
    email: 'patient@bookadoctor.com',
    password: 'Patient@123',
    role: 'patient',
    phone: '9876543210',
  });

  console.log('Creating doctors...');
  const doctorsData = [
    {
      name: 'Dr. Aisha Kapoor',
      email: 'aisha.kapoor@bookadoctor.com',
      specialization: 'Cardiologist',
      qualifications: 'MBBS, MD (Cardiology)',
      experienceYears: 12,
      consultationFee: 800,
      about: 'Specializes in preventive cardiology and heart failure management.',
      clinicAddress: '221B Heart Street, Springfield',
    },
    {
      name: 'Dr. Rohan Mehta',
      email: 'rohan.mehta@bookadoctor.com',
      specialization: 'Dermatologist',
      qualifications: 'MBBS, MD (Dermatology)',
      experienceYears: 8,
      consultationFee: 600,
      about: 'Focuses on skin allergies, acne treatment, and cosmetic dermatology.',
      clinicAddress: '45 Skin Care Ave, Springfield',
    },
    {
      name: 'Dr. Emily Chen',
      email: 'emily.chen@bookadoctor.com',
      specialization: 'Pediatrician',
      qualifications: 'MBBS, DCH',
      experienceYears: 15,
      consultationFee: 700,
      about: 'Experienced pediatrician dedicated to child wellness and vaccination care.',
      clinicAddress: '10 Kids Health Blvd, Springfield',
    },
  ];

  for (const d of doctorsData) {
    const user = await User.create({
      name: d.name,
      email: d.email,
      password: 'Doctor@123',
      role: 'doctor',
      phone: '9123456780',
    });

    await Doctor.create({
      user: user._id,
      specialization: d.specialization,
      qualifications: d.qualifications,
      experienceYears: d.experienceYears,
      consultationFee: d.consultationFee,
      about: d.about,
      clinicAddress: d.clinicAddress,
      isApproved: true,
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '13:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '13:00' },
        { day: 'Friday', startTime: '14:00', endTime: '18:00' },
      ],
    });
  }

  console.log('Seed complete!');
  console.log('----------------------------------------');
  console.log('Admin login:   admin@bookadoctor.com / Admin@123');
  console.log('Patient login: patient@bookadoctor.com / Patient@123');
  console.log('Doctor login:  aisha.kapoor@bookadoctor.com / Doctor@123');
  console.log('----------------------------------------');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
