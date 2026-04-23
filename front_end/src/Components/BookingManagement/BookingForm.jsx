import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./BookingForm.css";
import { createBooking } from "./BookingAPI";

// ✅ LOCAL DATE (Sri Lanka fix)
const getLocalDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().split("T")[0];
};

const getLocalDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 16);
};

function BookingForm() {

  const { id } = useParams(); // 🔥 resourceId from URL
  const userId = "USER001";   // 🔥 replace with login later

  const today = getLocalDate();
  const nowDateTime = getLocalDateTime();

  const initialState = {
    resourceId: id || "",
    userId: userId,
    bookingDate: today,
    startDateTime: "",
    endDateTime: "",
    purpose: "",
    expectedAttendees: ""
  };

  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // ---------------- VALIDATE FIELD ----------------
  const validateField = useCallback((name, value) => {
    switch (name) {

      case "expectedAttendees":
        if (value && (Number(value) < 1 || Number(value) > 1000)) {
          return "Attendees must be between 1 and 1000";
        }
        return "";

      case "startDateTime":
        if (value) {
          const selected = new Date(value);
          const now = new Date(getLocalDateTime());
          if (selected < now) {
            return "Start time cannot be in the past";
          }
        }
        return "";

      case "endDateTime":
        if (formData.startDateTime && value) {
          if (new Date(formData.startDateTime) >= new Date(value)) {
            return "End time must be after start time";
          }
        }
        return "";

      default:
        return "";
    }
  }, [formData.startDateTime]);

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [fieldErrors]);

  // ---------------- BLUR VALIDATION ----------------
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);

    if (err) {
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  }, [validateField]);

  // ---------------- FULL VALIDATION ----------------
  const validateForm = useCallback(() => {
    const errors = {};

    const requiredFields = [
      "resourceId",
      "userId",
      "bookingDate",
      "startDateTime",
      "endDateTime",
      "purpose",
      "expectedAttendees"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field} is required`;
      }
    });

    const now = new Date(getLocalDateTime());

    if (formData.startDateTime) {
      if (new Date(formData.startDateTime) < now) {
        errors.startDateTime = "Start time cannot be in the past";
      }
    }

    if (formData.startDateTime && formData.endDateTime) {
      if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
        errors.endDateTime = "End time must be after start time";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;

  }, [formData]);

  // ---------------- RESET ----------------
  const resetForm = useCallback(() => {
    setFormData(initialState);
    setFieldErrors({});
    setMessage("");
    setError("");
  }, [initialState]);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!validateForm()) {
      setError("Please fix errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const payload = {
  resourceId: formData.resourceId,
  userId: formData.userId,
  bookingDate: formData.startDateTime.split("T")[0],
  startTime: formData.startDateTime.split("T")[1] + ":00",
  endTime: formData.endDateTime.split("T")[1] + ":00",
  purpose: formData.purpose,
  expectedAttendees: Number(formData.expectedAttendees)
};

      await createBooking(payload);

      setMessage("🎉 Booking created successfully!");
      resetForm();

    } catch (err) {
      console.error(err);
      setError("Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="booking-form-page">
      <div className="booking-form-card">

        <div className="form-header">
          <h2>📅 Book a Resource</h2>
          <p className="booking-subtitle">Submit booking request</p>
        </div>

        {message && <div className="booking-success">{message}</div>}
        {error && <div className="booking-error">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">

          <div className="booking-grid">

            {/* Resource ID */}
            <div className="form-group">
              <label>Resource ID *</label>
              <input value={formData.resourceId} readOnly />
            </div>

            {/* User ID */}
            <div className="form-group">
              <label>User ID *</label>
              <input value={formData.userId} readOnly />
            </div>

            {/* Booking Date */}
            <div className="form-group">
              <label>Booking Date *</label>
              <input type="date" value={formData.bookingDate} readOnly />
            </div>

            {/* Attendees */}
            <div className="form-group">
              <label>Expected Attendees *</label>
              <input
                type="number"
                name="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={handleChange}
                min="1"
              />
            </div>

            {/* Start */}
            <div className="form-group">
              <label>Start Date & Time *</label>
              <input
                type="datetime-local"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
                onBlur={handleBlur}
                min={nowDateTime}
              />
            </div>

            {/* End */}
            <div className="form-group">
              <label>End Date & Time *</label>
              <input
                type="datetime-local"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleChange}
                onBlur={handleBlur}
                min={formData.startDateTime || nowDateTime}
              />
            </div>

          </div>

          {/* Purpose */}
          <div className="booking-full-width">
            <label>Purpose *</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            />
          </div>

          {/* BUTTONS FIX */}
          <div className="booking-form-actions">
            <button
              type="button"
              className="booking-reset-btn"
              onClick={resetForm}
              disabled={loading}
            >
              Reset Form
            </button>

            <button
              type="submit"
              className="booking-submit-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Booking"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default BookingForm;