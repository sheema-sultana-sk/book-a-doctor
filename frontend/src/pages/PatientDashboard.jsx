import { useEffect, useState } from 'react';
import api from '../api/axios';
import AppointmentCard from '../components/AppointmentCard';

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data);
    } catch (err) {
      setMessage('Could not load your appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
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

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="dashboard-page container">
      <h1>My Appointments</h1>
      {message && <div className="alert alert-info">{message}</div>}

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
            viewer="patient"
            onAction={handleAction}
            onUpload={handleUpload}
          />
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
