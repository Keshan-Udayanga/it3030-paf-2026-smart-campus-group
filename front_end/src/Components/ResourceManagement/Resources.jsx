import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Resources.css";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔍 Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");

  // 🔥 TEMP BOOKINGS
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
    {
      resourceId: "69c7a35aae7c851b593884ce",
      start: "2026-04-25T15:00",
      end: "2026-04-25T17:00",
    },
  ];

  // 🔥 CHECK AVAILABILITY
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

      if (from < bEnd && to > bStart) {
        return false;
      }
    }

    return true;
  };

  // 🔥 FETCH RESOURCES
  const fetchResources = () => {
    setLoading(true);

    axios
      .get("http://localhost:8080/api/resources")
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

  // 🔥 FILTER
  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.type.toLowerCase().includes(searchTerm.toLowerCase());

    const available = isAvailable(res.id, timeFrom, timeTo);

    return matchesSearch && available;
  });

  return (
    <section className="resources-page">
      <div className="container">

        <h2 className="page-title">Resources Catalogue</h2>

        {/* SEARCH */}
        <div className="filter-card">
          <input
            type="text"
            placeholder="Search resource name or type ..."
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
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredResources.map((res) => {
                  const available = isAvailable(res.id, timeFrom, timeTo);

                  return (
                    <tr key={res.id}>
                      <td>{res.name}</td>
                      <td>{res.type}</td>
                      <td>{res.capacity}</td>
                      <td>{res.location}</td>
                      <td>{res.status}</td>

                      <td>
                        <button disabled={!available}>
                          Book
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          )}

        </div>

      </div>
    </section>
  );
};

export default Resources;