const statusColors = {
  pending: '#e0a106',
  confirmed: '#2f6f5e',
  completed: '#4b6cb7',
  cancelled: '#c0392b',
};

const AppointmentCard = ({ appointment, viewer, onAction, onUpload }) => {
  const { doctor, patient, date, timeSlot, status, reason, notes, documents } = appointment;

  return (
    <div className="appointment-card">
      <div className="appointment-card-top">
        <div>
          <h4>{viewer === 'patient' ? doctor?.user?.name : patient?.name}</h4>
          {viewer === 'patient' && <p className="muted">{doctor?.specialization}</p>}
        </div>
        <span className="status-pill" style={{ backgroundColor: statusColors[status] || '#888' }}>
          {status}
        </span>
      </div>

      <div className="appointment-card-details">
        <p>
          <strong>Date:</strong> {new Date(date).toDateString()}
        </p>
        <p>
          <strong>Time:</strong> {timeSlot}
        </p>
        {reason && (
          <p>
            <strong>Reason:</strong> {reason}
          </p>
        )}
        {notes && (
          <p>
            <strong>Doctor notes:</strong> {notes}
          </p>
        )}
        {documents?.length > 0 && (
          <div className="documents-list">
            <strong>Documents:</strong>
            <ul>
              {documents.map((doc, idx) => (
                <li key={idx}>
                  <a
                    href={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '')}${doc.filePath}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {doc.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="appointment-card-actions">
        {viewer === 'doctor' && status === 'pending' && (
          <button className="btn btn-sm btn-primary" onClick={() => onAction(appointment._id, 'confirmed')}>
            Confirm
          </button>
        )}
        {viewer === 'doctor' && status === 'confirmed' && (
          <button className="btn btn-sm btn-primary" onClick={() => onAction(appointment._id, 'completed')}>
            Mark Completed
          </button>
        )}
        {['pending', 'confirmed'].includes(status) && (
          <button className="btn btn-sm btn-outline" onClick={() => onAction(appointment._id, 'cancelled')}>
            Cancel
          </button>
        )}
        {onUpload && (
          <label className="btn btn-sm btn-outline upload-label">
            Upload Document
            <input type="file" hidden onChange={(e) => onUpload(appointment._id, e.target.files[0])} />
          </label>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
