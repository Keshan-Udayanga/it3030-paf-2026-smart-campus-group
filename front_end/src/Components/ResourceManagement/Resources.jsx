import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Resources.css";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");

  const navigate = useNavigate();

  // 🔥 HARD CODED BOOKINGS
  const bookings = [
    {
      resourceId: "69c7a35aae7c851b593884ce",
      start: "2026-04-20T10:00",
      end: "2026-04-20T12:00",
    },
    {
      resourceId: "69d3c3bbbf8608375f26c30b",
      start: "2026-04-20T14:00",
      end: "2026-04-20T16:00",
    },
  ];

  const isAvailable = (resourceId, userFrom, userTo) => {
    if (!userFrom || !userTo) return true;

    const from = new Date(userFrom);
    const to = new Date(userTo);

    const resourceBookings = bookings.filter(
      (b) => b.resourceId === resourceId
    );

    for (let booking of resourceBookings) {
      const bStart = new Date(booking.start);
      const bEnd = new Date(booking.end);

      const overlap = from < bEnd && to > bStart;
      if (overlap) return false;
    }

    return true;
  };

  const fetchResources = () => {
    setLoading(true);

    axios
      .get("http://localhost:8082/api/resources")
      .then((res) => {
        setResources(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resources:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.location.toLowerCase().includes(searchTerm.toLowerCase());

    const available = isAvailable(res.id, timeFrom, timeTo);

    return matchesSearch && available;
  });

  return (
    <section className="resources-page">
      <div className="container">
        <div className="header-actions">
          <h2 className="page-title">Resources Catalogue</h2>

          {/* 🔥 NAVIGATION BUTTON */}
          <button
            className="btn-primary"
            onClick={() => navigate("/add-resource")}
          >
            + Add New Resource
          </button>
        </div>

        {/* FILTER */}
        <div className="filter-card">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="datetime-local"
            value={timeFrom}
            onChange={(e) => setTimeFrom(e.target.value)}
          />

          <input
            type="datetime-local"
            value={timeTo}
            onChange={(e) => setTimeTo(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="table-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="resources-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredResources.map((res) => (
                  <tr key={res.id}>
                    <td>{res.name}</td>
                    <td>{res.type}</td>
                    <td>{res.capacity}</td>
                    <td>{res.location}</td>
                    <td>
                      <span
                        className={`status-pill ${res.status.toLowerCase()}`}
                      >
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default Resources;