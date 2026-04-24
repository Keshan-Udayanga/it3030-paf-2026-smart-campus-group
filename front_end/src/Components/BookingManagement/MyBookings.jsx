import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyBookings.css";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ---------------- LOAD BOOKINGS ----------------
  const loadBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/bookings/my?email=USER001"
      );

      console.log("BOOKINGS API RESPONSE:", response.data);

      setBookings(response.data);

    } catch (err) {
      console.error("LOAD ERROR:", err);
      setError("Failed to load bookings.");
    }
  };

  // Auto load
  useEffect(() => {
    loadBookings();
  }, []);

  // ---------------- ACTIONS ----------------
  const handleCancel = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/cancel/${id}`);
      loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/bookings/${id}`);
      loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- STATS ----------------
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === "PENDING").length,
      approved: bookings.filter(b => b.status === "APPROVED").length,
      rejected: bookings.filter(b => b.status === "REJECTED").length
    };
  }, [bookings]);

  // ---------------- FORMAT ----------------
  const formatDateTime = (dt) => {
    if (!dt) return "-";
    return new Date(dt).toLocaleString();
  };

  // ---------------- UI ----------------
  return (
    <div className="my-bookings-page-v2">
      <div className="my-bookings-wrapper">

        <div className="my-bookings-top">
          <div>
            <h1>My Bookings</h1>
            <p>View and manage all your resource bookings</p>
          </div>

          <button
            onClick={() => navigate("/create-booking")}
            className="new-booking-btn"
          >
            + New Booking
          </button>
        </div>

        {/* ERROR */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="circle total-circle">{stats.total}</div>
            <p>Total</p>
          </div>
          <div className="stat-card">
            <div className="circle pending-circle">{stats.pending}</div>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <div className="circle approved-circle">{stats.approved}</div>
            <p>Approved</p>
          </div>
          <div className="stat-card">
            <div className="circle rejected-circle">{stats.rejected}</div>
            <p>Rejected</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="booking-table-card">
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>RESOURCE</th>
                <th>USER</th>
                <th>BOOKING DATE</th>
                <th>START</th>
                <th>END</th>
                <th>PURPOSE</th>
                <th>ATTENDEES</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="10">No bookings found</td>
                </tr>
              ) : (
                bookings.map((b, i) => (
                  <tr key={b.id}>
                    <td>#{i + 1}</td>
                    <td>{b.resourceId}</td>
                    <td>{b.userId}</td>
                    <td>{formatDateTime(b.bookingDate)}</td>
                    <td>{formatDateTime(b.startDateTime)}</td>
                    <td>{formatDateTime(b.endDateTime)}</td>
                    <td>{b.purpose}</td>
                    <td>{b.expectedAttendees ?? "-"}</td>
                    <td>
                      <span className={`status-${(b.status || "").toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === "APPROVED" && (
                        <button onClick={() => handleCancel(b.id)}>
                          Cancel
                        </button>
                      )}

                      {b.status === "PENDING" && (
                        <button onClick={() => handleDelete(b.id)}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default MyBookings;