import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddResource.css";

const AddResource = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "LECTURE_HALL",
    capacity: "",
    location: "",
    status: "ACTIVE",
    availableFrom: "",
    availableTo: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // 👉 later: axios.post(...)
    alert("Resource Added Successfully!");

    navigate("/");
  };

  return (
    <section className="add-resource-page">
      <div className="form-container">

        <div className="form-header">
          <h2>Add New Resource</h2>
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="resource-form">
          <div className="form-grid">

            {/* NAME */}
            <div className="form-group">
              <label>Resource Name</label>
              <input
                name="name"
                placeholder="Lecture Hall A"
                onChange={handleChange}
                required
              />
            </div>

            {/* TYPE */}
            <div className="form-group">
              <label>Type</label>
              <select name="type" onChange={handleChange}>
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Lab</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>

            {/* CAPACITY */}
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                placeholder="e.g. 120"
                onChange={handleChange}
                required
              />
            </div>

            {/* LOCATION */}
            <div className="form-group">
              <label>Location</label>
              <select name="location" onChange={handleChange}>
                <option>Building A</option>
                <option>Building B</option>
                <option>Building C</option>
                <option>Main Hall</option>
              </select>
            </div>

            {/* STATUS */}
            <div className="form-group full-width">
              <label>Status</label>
              <select name="status" onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>

          </div>

          <button type="submit" className="btn-submit">
            Add Resource
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddResource;