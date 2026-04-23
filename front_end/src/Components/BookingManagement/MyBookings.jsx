import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";
import { cancelBooking, deleteBooking, getMyBookings } from "./BookingAPI";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔥 Auto load bookings (no search bar)
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getMyBookings("USER001"); // 👉 change if needed
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings.");
    }
  };

  const handleCancel = async (id) => {
    await cancelBooking(id);
    loadBookings();
  };

  const handleDelete = async (id) => {
    await deleteBooking(id);
    loadBookings();
  };

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === "PENDING").length,
      approved: bookings.filter(b => b.status === "APPROVED").length,
      rejected: bookings.filter(b => b.status === "REJECTED").length
    };
  }, [bookings]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString();

  const formatTime = (start, end) => {
    const s = new Date(start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const e = new Date(end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${s} - ${e}`;
  };

  return (
    <div className="my-bookings-page-v2">
      <div className="my-bookings-wrapper">

        <div className="my-bookings-top">
          <div>
            <h1>My Bookings</h1>
            <p>View and manage all your resource bookings</p>
          </div>

          <button onClick={() => navigate("/create-booking")} className="new-booking-btn">
            + New Booking
          </button>
        </div>

        {/* ✅ Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="circle total-circle"><span>{stats.total}</span></div>
            <p>Total</p>
          </div>
          <div className="stat-card">
            <div className="circle pending-circle"><span>{stats.pending}</span></div>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <div className="circle approved-circle"><span>{stats.approved}</span></div>
            <p>Approved</p>
          </div>
          <div className="stat-card">
            <div className="circle rejected-circle"><span>{stats.rejected}</span></div>
            <p>Rejected</p>
          </div>
        </div>

        {/* ✅ TABLE */}
        <div className="booking-table-card">
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>RESOURCE</th>
                <th>USER</th>
                <th>BOOKING DATE</th>
                <th>Starting</th>
                <th>Ending</th>
                <th>PURPOSE</th>
                <th>ATTENDEES</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id}>
                  <td>#{i + 1}</td>
                  <td>{b.resourceId}</td>
                  <td>{b.userId}</td>
                  <td>{formatDate(b.bookingDate)}</td>
                  <td>{formatDate(b.startDateTime)}</td>
                  <td>{formatTime(b.startDateTime, b.endDateTime)}</td>
                  <td>{b.purpose}</td>
                  <td>{b.expectedAttendees}</td>
                  <td>
                    <span className={`table-status status-${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === "APPROVED" && (
                      <button className="cancel-action" onClick={() => handleCancel(b.id)}>Cancel</button>
                    )}
                    {b.status === "PENDING" && (
                      <button className="delete-action" onClick={() => handleDelete(b.id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default MyBookings;