import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BookingForm.css";

// LOCAL DATE (Sri Lanka fix)
const getLocalDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now - offset).toISOString().split("T")[0];
};

function BookingForm() {
    const { id } = useParams();
    const userId = "USER001";

    const today = getLocalDate();

    const initialState = {
        resourceId: id || "",
        userId: userId,
        bookingDate: today,
        startDateTime: "",
        endDateTime: "",
        purpose: "",
        expectedAttendees: "" // ✅ OPTIONAL (NOT REQUIRED)
    };

    const [formData, setFormData] = useState(initialState);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ---------------- HANDLE CHANGE ----------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // ---------------- RESET ----------------
    const resetForm = () => {
        setFormData(initialState);
        setMessage("");
        setError("");
    };

    // ---------------- SUBMIT ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const now = new Date();

            const start = new Date(formData.startDateTime);
            const end = new Date(formData.endDateTime);

            // ❌ past date restriction
            if (start < now) {
                setError("Start date/time cannot be in the past");
                setLoading(false);
                return;
            }

            if (end < now) {
                setError("End date/time cannot be in the past");
                setLoading(false);
                return;
            }

            const payload = {
                resourceId: id,
                userId: userId,
                bookingDate: formData.startDateTime.split("T")[0],
                startDateTime: formData.startDateTime,
                endDateTime: formData.endDateTime,
                purpose: formData.purpose,
                expectedAttendees: formData.expectedAttendees
                    ? Number(formData.expectedAttendees)
                    : null // ✅ optional now
            };

            await axios.post(
                "http://localhost:8080/api/bookings",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            setMessage("🎉 Booking created successfully!");
            setFormData(initialState);

        } catch (err) {
            setError(err.response?.data?.message || "Booking failed");
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

                        <div className="form-group">
                            <label>Resource ID</label>
                            <input value={formData.resourceId} readOnly />
                        </div>

                        <div className="form-group">
                            <label>User ID</label>
                            <input value={formData.userId} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Booking Date</label>
                            <input type="date" value={formData.bookingDate} readOnly />
                        </div>

                        {/* ❌ past disable via min */}
                        <div className="form-group">
                            <label>Start Date & Time</label>
                            <input
                                type="datetime-local"
                                name="startDateTime"
                                value={formData.startDateTime}
                                onChange={handleChange}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>

                        <div className="form-group">
                            <label>End Date & Time</label>
                            <input
                                type="datetime-local"
                                name="endDateTime"
                                value={formData.endDateTime}
                                onChange={handleChange}
                                min={formData.startDateTime || new Date().toISOString().slice(0, 16)}
                            />
                        </div>

                        {/* ✅ expectedAttendees NOW OPTIONAL */}
                        <div className="form-group">
                            <label>Expected Attendees</label>
                            <input
                                type="number"
                                name="expectedAttendees"
                                value={formData.expectedAttendees}
                                onChange={handleChange}
                                placeholder="Optional"
                                required={false}
                            />
                        </div>

                    </div>

                    <div className="booking-full-width">
                        <label>Purpose</label>
                        <textarea
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                        />
                    </div>

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