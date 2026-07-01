import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath =
    user?.role === 'admin' ? '/admin' : user?.role === 'doctor' ? '/doctor-dashboard' : '/dashboard';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">🩺</span> Book a Doctor
        </Link>

        <nav className="nav-links">
          <Link to="/doctors">Find Doctors</Link>
          {user && <Link to={dashboardPath}>Dashboard</Link>}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <NotificationBell />
              <span className="nav-user">Hi, {user.name?.split(' ')[0]}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
