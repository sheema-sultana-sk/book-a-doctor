import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [message, setMessage] = useState('');

  const fetchAll = async () => {
    try {
      const [statsRes, doctorsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/doctors'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setDoctors(doctorsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setMessage('Could not load admin data.');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const toggleDoctorApproval = async (id, isApproved) => {
    try {
      await api.put(`/admin/doctors/${id}/approve`, { isApproved: !isApproved });
      fetchAll();
    } catch (err) {
      setMessage('Could not update doctor approval.');
    }
  };

  const toggleUserStatus = async (id, isActive) => {
    try {
      await api.put(`/admin/users/${id}/status`, { isActive: !isActive });
      fetchAll();
    } catch (err) {
      setMessage('Could not update user status.');
    }
  };

  return (
    <div className="dashboard-page container">
      <h1>Admin Dashboard</h1>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="filter-tabs">
        <button className={`filter-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          Overview
        </button>
        <button className={`filter-tab ${tab === 'doctors' ? 'active' : ''}`} onClick={() => setTab('doctors')}>
          Doctors
        </button>
        <button className={`filter-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
          Users
        </button>
      </div>

      {tab === 'overview' && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalPatients}</h3>
            <p>Patients</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalDoctors}</h3>
            <p>Approved Doctors</p>
          </div>
          <div className="stat-card">
            <h3>{stats.pendingDoctors}</h3>
            <p>Pending Doctor Approvals</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
          <div className="stat-card">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>
      )}

      {tab === 'doctors' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d._id}>
                <td>{d.user?.name}</td>
                <td>{d.specialization}</td>
                <td>₹{d.consultationFee}</td>
                <td>{d.isApproved ? 'Approved' : 'Pending'}</td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => toggleDoctorApproval(d._id, d.isApproved)}>
                    {d.isApproved ? 'Revoke' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'users' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? 'Active' : 'Deactivated'}</td>
                <td>
                  {u.role !== 'admin' && (
                    <button className="btn btn-sm btn-outline" onClick={() => toggleUserStatus(u._id, u.isActive)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
