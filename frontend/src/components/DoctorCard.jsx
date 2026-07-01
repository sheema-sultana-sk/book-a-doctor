import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-card-avatar">{doctor.user?.name?.charAt(0) || 'D'}</div>
      <div className="doctor-card-body">
        <h3>{doctor.user?.name}</h3>
        <p className="doctor-specialization">{doctor.specialization}</p>
        <p className="doctor-meta">
          {doctor.experienceYears} yrs experience &middot; ₹{doctor.consultationFee} fee
        </p>
        {doctor.clinicAddress && <p className="doctor-address">📍 {doctor.clinicAddress}</p>}
        <Link to={`/doctors/${doctor._id}`} className="btn btn-primary btn-block">
          View Profile & Book
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
