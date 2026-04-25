import React, { useEffect, useState } from "react";
import "./AdminBookings.css";
import axios from "axios";
import Swal from "sweetalert2";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState({});
  const [rejectReasons, setRejectReasons] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");   // 🔥 NEW
  const userId = localStorage.getItem("userId");   // 🔥 NEW

  // ---------------- DATE FIX ----------------
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d - offset).toISOString().split("T")[0];
  };

  const formatTimePart = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---------------- LOAD BOOKINGS ----------------
  const loadBookings = async () => {
    try {
      let url = "http://localhost:8080/api/bookings";

      // 👤 USER → only own bookings
      if (userRole !== "ROLE_ADMIN") {
        url += `?userId=${userId}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data || []);
    } catch (err) {
      console.log("Booking load error", err);
    }
  };

  // ---------------- LOAD RESOURCES ----------------
  const loadResources = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const map = {};
      (res.data || []).forEach((item) => {
        const r = item.content || item;
        map[r.id] = r.name;
      });

      setResources(map);
    } catch (err) {
      console.log("Resource error", err);
    }
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    setLoading(true);
    Promise.all([loadBookings(), loadResources()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // ---------------- FILTER ----------------
  const filteredBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  // ---------------- ACTIONS ----------------
  const handleApprove = async (id) => {
    await axios.patch(
      `http://localhost:8080/api/bookings/${id}/review`,
      { decision: "APPROVED" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadBookings();
  };

  const handleReject = async (id) => {
    const reason = rejectReasons[id] || "No reason provided";

    await axios.patch(
      `http://localhost:8080/api/bookings/${id}/review`,
      {
        decision: "REJECTED",
        adminReason: reason,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadBookings();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadBookings();
  };

  const handleReasonChange = (id, value) => {
    setRejectReasons((prev) => ({
      ...prev,
      [id]: value,
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

  // ---------------- UI ----------------
  return (
    <div className="admin-bookings-page">
      <div className="admin-bookings-container">

        <h2 className="title">
          {userRole === "ROLE_ADMIN"
            ? "🛠️ Admin Booking Review"
            : "📋 My Bookings"}
        </h2>

        {/* 🔥 FILTER BUTTONS */}
        <div className="filter-buttons">

          <button className={filter === "ALL" ? "active-filter" : ""} onClick={() => setFilter("ALL")}>
            All
          </button>

          <button className={filter === "PENDING" ? "active-filter" : ""} onClick={() => setFilter("PENDING")}>
            Pending
          </button>

          <button className={filter === "APPROVED" ? "active-filter" : ""} onClick={() => setFilter("APPROVED")}>
            Approved
          </button>

          <button className={filter === "REJECTED" ? "active-filter" : ""} onClick={() => setFilter("REJECTED")}>
            Rejected
          </button>

        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="admin-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Resource</th>
                <th>User</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Purpose</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((b, i) => (
                <React.Fragment key={b.id || i}>

                  <tr className="main-row">
                    <td>{i + 1}</td>
                    <td>{resources[b.resourceId] || "Loading..."}</td>
                    <td>{b.userId}</td>
                    <td>{formatDate(b.bookingDate)}</td>
                    <td>{formatTimePart(b.startDateTime)}</td>
                    <td>{formatTimePart(b.endDateTime)}</td>
                    <td>{b.purpose}</td>
                  </tr>

                  <tr className="detail-row">
                    <td colSpan="7">

                      <div className="detail-box">

                        <div>
                          <strong>Status:</strong>{" "}
                          <span className={`status-badge ${getStatusClass(b.status)}`}>
                            {b.status}
                          </span>
                        </div>

                        <div>
                          <strong>Reason:</strong>{" "}
                          {b.status === "PENDING" ? (
                            <input
                              value={rejectReasons[b.id] || ""}
                              onChange={(e) =>
                                handleReasonChange(b.id, e.target.value)
                              }
                              placeholder="Reject reason"
                            />
                          ) : (
                            b.adminReason || "-"
                          )}
                        </div>

                        {/* 🔥 ROLE BASED ACTIONS */}
                        {userRole === "ROLE_ADMIN" && (
                          <div className="admin-actions">

                            {b.status === "PENDING" ? (
                              <>
                                <button className="approve-btn" onClick={() => handleApprove(b.id)}>
                                  Approve
                                </button>

                                <button className="reject-btn" onClick={() => handleReject(b.id)}>
                                  Reject
                                </button>
                              </>
                            ) : (
                              <button className="delete-btn" onClick={() => handleDelete(b.id)}>
                                Delete
                              </button>
                            )}

                          </div>
                        )}

                      </div>

                    </td>
                  </tr>

                </React.Fragment>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}

export default AdminBookings;