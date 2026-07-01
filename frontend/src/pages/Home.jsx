import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-text">
          <h1>Find and book the right doctor, in minutes.</h1>
          <p>
            Book a Doctor connects patients with trusted healthcare providers. Browse doctors, schedule
            appointments, upload medical documents securely, and get notified every step of the way.
          </p>
          <div className="hero-actions">
            <Link to="/doctors" className="btn btn-primary btn-lg">
              Find a Doctor
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🔎 Browse Doctors</h3>
          <p>Search verified doctors by specialization, experience, and clinic location.</p>
        </div>
        <div className="feature-card">
          <h3>📅 Easy Scheduling</h3>
          <p>Pick an available slot and book instantly. Manage or cancel appointments anytime.</p>
        </div>
        <div className="feature-card">
          <h3>📄 Secure Documents</h3>
          <p>Upload and share reports or prescriptions directly within your appointment.</p>
        </div>
        <div className="feature-card">
          <h3>🔔 Stay Notified</h3>
          <p>Get real-time updates when appointments are confirmed, completed, or cancelled.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
