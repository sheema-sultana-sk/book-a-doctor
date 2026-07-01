import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      // Silently ignore - notifications are non-critical
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="notification-bell" ref={ref}>
      <button className="bell-btn" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        🔔
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>
      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <strong>Notifications</strong>
            {unreadCount > 0 && (
              <button className="link-btn" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 && <p className="notification-empty">No notifications yet.</p>}
          <ul className="notification-list">
            {notifications.map((n) => (
              <li key={n._id} className={n.isRead ? 'read' : 'unread'}>
                <p className="notification-title">{n.title}</p>
                <p className="notification-message">{n.message}</p>
                <span className="notification-time">{new Date(n.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
