import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Resources.css";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8081/api/resources")
      .then((res) => {
        console.log(res.data);

        const data = res.data._embedded?.resourceDTOList || [];
        setResources(data);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resources:", err);
        setLoading(false);
      });
  }, []);

  // FILTER
  const filteredResources = resources.filter((res) =>
    res.name?.toLowerCase().includes(search.toLowerCase().toString())
  );

  return (
    <section className="resources-page">
      <div className="container">

        {/* HEADER */}
        <div className="resources-header">
          <h2 className="page-title">Resources Catalogue</h2>

          <div className="header-actions">
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="add-btn">+ Add Resource</button>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="loading">Loading resources...</p>
        ) : filteredResources.length === 0 ? (
          <div className="no-results">
            <h3>No resources found 😕</h3>
            <p>Try searching with a different name</p>
          </div>
        ) : (
          <div className="resources-grid">
            {filteredResources.map((res) => (
              <div key={res.id} className="resource-card">

                {/* TOP */}
                <div className="card-top">
                  <h3>{res.name}</h3>
                  <span className={res.status === "ACTIVE" ? "status active" : "status inactive"}>
                    {res.status}
                  </span>
                </div>

                {/* BODY */}
                <div className="card-body">
                  <p><strong>Type :</strong> {res.type}</p>
                  <p><strong>Capacity :</strong> {res.capacity}</p>
                  <p><strong>Location :</strong> {res.location}</p>
                  <p><strong>Available From :</strong> {res.availableFrom}</p>
                  <p><strong>Available To :</strong> {res.availableTo}</p>
                </div>

                {/* BUTTONS */}
                <div className="card-buttons">
                  <button className="book-btn">Book</button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Resources;