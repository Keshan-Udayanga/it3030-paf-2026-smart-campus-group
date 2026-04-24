import React, { useEffect, useState } from "react";
import "./AdminBookings.css";
import { getAllBookings, reviewBooking } from "./BookingAPI";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rejectReasons, setRejectReasons] = useState({});

  const loadBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load all bookings.");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleApprove = async (id) => {
    setMessage("");
    setError("");

    try {
      await reviewBooking(id, { decision: "APPROVED" });
      setMessage("Booking approved successfully.");
      loadBookings();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to approve booking.");
    }
  };

  const handleReject = async (id) => {
    setMessage("");
    setError("");

    try {
      await reviewBooking(id, {
        decision: "REJECTED",
        adminReason: rejectReasons[id] || "Rejected by admin"
      });
      setMessage("Booking rejected successfully.");
      loadBookings();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to reject booking.");
    }
  };

  const handleReasonChange = (id, value) => {
    setRejectReasons((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "APPROVED":
        return "status-approved";
      case "REJECTED":
        return "status-rejected";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="admin-bookings-page">
      <div className="admin-bookings-container">
        <div className="admin-bookings-header">
          <h2>🛠️ Admin Booking Review</h2>
          <button onClick={loadBookings}>Refresh</button>
        </div>

        {message && <div className="admin-success">{message}</div>}
        {error && <div className="admin-error">{error}</div>}

        <div className="admin-bookings-table-wrapper">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Resource ID</th>
                <th>User ID</th>
                <th>Booking Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Purpose</th>
                <th>Attendees</th>
                <th>Status</th>
                <th>Reject Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.resourceId}</td>
                  <td>{booking.userId}</td>
                  <td>{booking.bookingDate}</td>
                  <td>{booking.startDateTime}</td>
                  <td>{booking.endDateTime}</td>
                  <td>{booking.purpose}</td>
                  <td>{booking.expectedAttendees}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === "PENDING" ? (
                      <input
                        type="text"
                        placeholder="Enter reject reason"
                        value={rejectReasons[booking.id] || ""}
                        onChange={(e) => handleReasonChange(booking.id, e.target.value)}
                      />
                    ) : (
                      booking.adminReason || "-"
                    )}
                  </td>
                  <td>
                    {booking.status === "PENDING" ? (
                      <div className="admin-actions">
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(booking.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleReject(booking.id)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>No actions</span>
                    )}
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan="11" className="no-bookings-cell">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBookings;