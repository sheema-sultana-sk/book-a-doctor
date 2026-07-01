import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'patient',
    specialization: '',
    consultationFee: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form);
      navigate(data.role === 'doctor' ? '/doctor-dashboard' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p className="muted">Join as a patient to book appointments, or a doctor to offer them.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label>
          I am a
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>

        <label>
          Full Name
          <input type="text" name="name" required value={form.name} onChange={handleChange} />
        </label>

        <label>
          Email
          <input type="email" name="email" required value={form.email} onChange={handleChange} />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
        </label>

        {form.role === 'doctor' && (
          <>
            <label>
              Specialization
              <input
                type="text"
                name="specialization"
                placeholder="e.g. Cardiologist"
                value={form.specialization}
                onChange={handleChange}
              />
            </label>
            <label>
              Consultation Fee (₹)
              <input
                type="number"
                name="consultationFee"
                min="0"
                value={form.consultationFee}
                onChange={handleChange}
              />
            </label>
            <p className="hint">
              Note: new doctor profiles require admin approval before appearing in search results.
            </p>
          </>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
