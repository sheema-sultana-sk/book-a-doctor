import { useEffect, useState } from 'react';
import api from '../api/axios';
import AppointmentCard from '../components/AppointmentCard';

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState('appointments');
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments/doctor');
      setAppointments(data);
    } catch (err) {
      setMessage('Could not load your appointments.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setProfile(data.doctorProfile);
      setProfileForm(data.doctorProfile);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchProfile();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleUpload = async (id, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('document', file);
    try {
      await api.post(`/appointments/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Document uploaded successfully.');
      fetchAppointments();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed.');
    }
  };

  const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage('');
    try {
      const { data } = await api.put('/doctors/me', profileForm);
      setProfile(data);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="dashboard-page container">
      <h1>Doctor Dashboard</h1>
      {message && <div className="alert alert-info">{message}</div>}

      {profile && !profile.isApproved && (
        <div className="alert alert-warning">
          Your doctor profile is pending admin approval. You won&apos;t appear in patient search results until
          approved, but you can still update your profile below.
        </div>
      )}

      <div className="filter-tabs">
        <button className={`filter-tab ${tab === 'appointments' ? 'active' : ''}`} onClick={() => setTab('appointments')}>
          Appointments
        </button>
        <button className={`filter-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
          My Profile
        </button>
      </div>

      {tab === 'appointments' && (
        <>
          <div className="filter-tabs">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {loading && <p>Loading...</p>}
          {!loading && filtered.length === 0 && <p>No appointments in this category yet.</p>}

          <div className="appointment-list">
            {filtered.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appointment={appt}
                viewer="doctor"
                onAction={handleAction}
                onUpload={handleUpload}
              />
            ))}
          </div>
        </>
      )}

      {tab === 'profile' && profileForm && (
        <form className="profile-form" onSubmit={handleProfileSave}>
          <label>
            Specialization
            <input
              type="text"
              name="specialization"
              value={profileForm.specialization || ''}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Qualifications
            <input
              type="text"
              name="qualifications"
              value={profileForm.qualifications || ''}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Experience (years)
            <input
              type="number"
              name="experienceYears"
              min="0"
              value={profileForm.experienceYears || 0}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Consultation Fee (₹)
            <input
              type="number"
              name="consultationFee"
              min="0"
              value={profileForm.consultationFee || 0}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Clinic Address
            <input
              type="text"
              name="clinicAddress"
              value={profileForm.clinicAddress || ''}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            About
            <textarea name="about" rows={4} value={profileForm.about || ''} onChange={handleProfileChange} />
          </label>

          <button type="submit" className="btn btn-primary" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}
    </div>
  );
};

export default DoctorDashboard;
