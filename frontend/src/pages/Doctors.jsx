import { useEffect, useState } from 'react';
import api from '../api/axios';
import DoctorCard from '../components/DoctorCard';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/doctors', { params: { search, specialization } });
      setDoctors(data);
    } catch (err) {
      setError('Could not load doctors right now. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api
      .get('/doctors/specializations/list')
      .then(({ data }) => setSpecializations(data))
      .catch(() => setSpecializations([]));
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="doctors-page container">
      <h1>Find a Doctor</h1>

      <form className="doctor-filters" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or specialization"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">All specializations</option>
          {specializations.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {loading && <p>Loading doctors...</p>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && doctors.length === 0 && <p>No doctors found matching your criteria.</p>}

      <div className="doctor-grid">
        {doctors.map((doc) => (
          <DoctorCard key={doc._id} doctor={doc} />
        ))}
      </div>
    </div>
  );
};

export default Doctors;
