import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    window.history.replaceState({}, document.title, "/admin-dashboard");

    axios.get("http://localhost:8080/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/";
    });


  }, []);

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>

      {user && <p>Welcome, {user.name}</p>}

      <div className="row mt-4">

        {/* USERS CARD */}
        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h5>Total Users</h5>
            <h3>120</h3>
            <p>Manage system users</p>
          </div>
        </div>

        {/* RESOURCES CARD */}
        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h5>Resources</h5>
            <h3>45</h3>
            <p>Manage campus resources</p>
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h5>System Status</h5>
            <h3>Active</h3>
            <p>All systems running</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;