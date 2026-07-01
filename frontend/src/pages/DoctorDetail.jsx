import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [booking, setBooking] = useState({ date: '', timeSlot: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/doctors/${id}`)
      .then(({ data }) => setDoctor(data))
      .catch(() => setError('Doctor not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setBooking({ ...booking, [e.target.name]: e.target.value });

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      navigate('/login', { state: { from: `/doctors/${id}` } });
      return;
    }

    if (user.role !== 'patient') {
      setError('Only patient accounts can book appointments.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/appointments', {
        doctorId: id,
        date: booking.date,
        timeSlot: booking.timeSlot,
        reason: booking.reason,
      });
      setSuccess('Appointment requested! You can track its status from your dashboard.');
      setBooking({ date: '', timeSlot: '', reason: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not book appointment. Please try another slot.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="container">Loading doctor profile...</p>;
  if (error && !doctor) return <p className="container alert alert-error">{error}</p>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="doctor-detail-page container">
      <div className="doctor-detail-header">
        <div className="doctor-card-avatar large">{doctor.user?.name?.charAt(0) || 'D'}</div>
        <div>
          <h1>{doctor.user?.name}</h1>
          <p className="doctor-specialization">{doctor.specialization}</p>
          <p className="muted">
            {doctor.qualifications} &middot; {doctor.experienceYears} yrs experience
          </p>
          <p className="muted">Consultation Fee: ₹{doctor.consultationFee}</p>
          {doctor.clinicAddress && <p className="muted">📍 {doctor.clinicAddress}</p>}
        </div>
      </div>

      {doctor.about && (
        <section className="doctor-about">
          <h3>About</h3>
          <p>{doctor.about}</p>
        </section>
      )}

      {doctor.availability?.length > 0 && (
        <section className="doctor-availability">
          <h3>Weekly Availability</h3>
          <ul>
            {doctor.availability.map((slot, idx) => (
              <li key={idx}>
                {slot.day}: {slot.startTime} - {slot.endTime}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="booking-section">
        <h3>Book an Appointment</h3>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form className="booking-form" onSubmit={handleBook}>
          <label>
            Date
            <input type="date" name="date" required min={today} value={booking.date} onChange={handleChange} />
          </label>

          <label>
            Time Slot
            <select name="timeSlot" required value={booking.timeSlot} onChange={handleChange}>
              <option value="">Select a time</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>

          <label>
            Reason for visit (optional)
            <textarea name="reason" rows={3} value={booking.reason} onChange={handleChange} />
          </label>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default DoctorDetail;
