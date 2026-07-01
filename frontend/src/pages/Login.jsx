import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      const redirect =
        location.state?.from ||
        (data.role === 'admin' ? '/admin' : data.role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="muted">Log in to manage your appointments.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label>
          Email
          <input type="email" name="email" required value={form.email} onChange={handleChange} />
        </label>

        <label>
          Password
          <input type="password" name="password" required value={form.password} onChange={handleChange} />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>

        <div className="demo-creds">
          <strong>Demo accounts</strong>
          <p>Admin: admin@bookadoctor.com / Admin@123</p>
          <p>Patient: patient@bookadoctor.com / Patient@123</p>
          <p>Doctor: aisha.kapoor@bookadoctor.com / Doctor@123</p>
        </div>
      </form>
    </div>
  );
};

export default Login;
