import { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationPage.css";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const [filter, setFilter] = useState("ALL");
  const [preferences, setPreferences] = useState({
    bookingEnabled: true,
    ticketEnabled: true,
    commentEnabled: true,
    roleChangedEnabled: true
  });

  const filteredNotifications = notifications.filter(n => {
        if (filter === "UNREAD") return !n.isRead;
        return true;
    });

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, []);

  const fetchNotifications = () => {
    axios.get("http://localhost:8080/api/v1/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setNotifications(res.data))
    .catch(err => console.error(err));
  };

  const markAsRead = (id) => {
    axios.put(
      `http://localhost:8080/api/v1/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => fetchNotifications())
    .catch(err => console.error(err));
  };

  const fetchPreferences = () => {
    axios.get("http://localhost:8080/api/v1/notifications/preferences", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPreferences(res.data))
    .catch(err => console.error(err));
  };

  const handleToggle = (field) => {
    const updated = {
      ...preferences,
      [field]: !preferences[field]
    };

    setPreferences(updated);

    axios.put(
      "http://localhost:8080/api/v1/notifications/preferences",
      updated,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .catch(err => console.error(err));
  };

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      <div className="preferences-panel">
        <h3>Notification Settings</h3>

        <label>
          <input
            type="checkbox"
            checked={preferences.bookingEnabled}
            onChange={() => handleToggle("bookingEnabled")}
          />
          Booking
        </label>

        <label>
          <input
            type="checkbox"
            checked={preferences.ticketEnabled}
            onChange={() => handleToggle("ticketEnabled")}
          />
          Ticket Updates
        </label>

        <label>
          <input
            type="checkbox"
            checked={preferences.commentEnabled}
            onChange={() => handleToggle("commentEnabled")}
          />
          Comments
        </label>

        <label>
          <input
            type="checkbox"
            checked={preferences.roleChangedEnabled}
            onChange={() => handleToggle("roleChangedEnabled")}
          />
          Role Changes
        </label>
      </div>

      <div className="notification-filters">
        <button 
            className={filter === "ALL" ? "active" : ""}
            onClick={() => setFilter("ALL")}
        >
            All
        </button>

        <button 
            className={filter === "UNREAD" ? "active" : ""}
            onClick={() => setFilter("UNREAD")}
        >
            Unread
        </button>
        </div>

      {filteredNotifications.length === 0 && (
        <p className="empty">No {filter === "UNREAD" ? "unread" : ""} notifications</p>
        )}

      <div className="notifications-list">
        {filteredNotifications.map(n => (
          <div 
            key={n.id} 
            className={`notification-card ${n.isRead ? "read" : "unread"}`}
          >
            <div className="notification-content">
              <p>{n.message}</p>
              <span className="time">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>

            {!n.isRead && (
              <button onClick={() => markAsRead(n.id)}>
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;