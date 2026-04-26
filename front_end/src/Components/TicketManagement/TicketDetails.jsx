import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentSection from "./CommentSection";
import "./TicketDetails.css";

function TicketDetails() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/tickets/${id}`);
            setTicket(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching ticket:", err);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading ticket details...</div>;
    if (!ticket) return <div className="error">Ticket not found.</div>;

    return (
        <div className="ticket-details-container">
            <h1>Incident Ticket Details</h1>
            
            <div className="header-actions">
                <button className="back-btn-outline" onClick={() => navigate("/tickets")}>
                    Back To My Tickets
                </button>
                <button className="create-another-btn" onClick={() => navigate("/tickets/create")}>
                    Create Another
                </button>
            </div>

            <div className="details-card-main">
                <div className="card-header-row">
                    <h2 className="ticket-id-title">{ticket.ticketCode}</h2>
                    <div className="badge-row">
                        <span className={`status-pill-solid ${ticket.status}`}>
                            {ticket.status}
                        </span>
                        <span className={`priority-pill-solid ${ticket.priority}`}>
                            {ticket.priority}
                        </span>
                    </div>
                </div>

                <div className="info-grid">
                    <div className="info-box">
                        <label>CATEGORY</label>
                        <p>{ticket.category}</p>
                    </div>
                    <div className="info-box">
                        <label>LOCATION</label>
                        <p>{ticket.location}</p>
                    </div>
                    <div className="info-box">
                        <label>RESOURCE</label>
                        <p>{ticket.resourceName || "N/A"}</p>
                    </div>
                    <div className="info-box">
                        <label>CREATED AT</label>
                        <p>{new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="info-box">
                        <label>PREFERRED CONTACT</label>
                        <div className="contact-details">
                            <p>{ticket.preferredContactName}</p>
                            <p className="sub-text">{ticket.preferredContactEmail}</p>
                            <p className="sub-text">{ticket.preferredContactPhone}</p>
                        </div>
                    </div>
                    <div className="info-box">
                        <label>ASSIGNED TECHNICIAN</label>
                        <p>{ticket.assignedTechnician || "Not assigned yet"}</p>
                    </div>
                    <div className="info-box full-width">
                        <label>DESCRIPTION</label>
                        <p>{ticket.description}</p>
                    </div>

                    {ticket.status === "REJECTED" && (
                        <div className="info-box full-width rejected-reason">
                            <label>REJECTION REASON</label>
                            <p>{ticket.rejectionReason}</p>
                        </div>
                    )}
                </div>

                {ticket.attachmentIds && ticket.attachmentIds.length > 0 && (
                    <div className="attachments-footer">
                        <label>ATTACHMENTS</label>
                        <div className="attachment-chips">
                            {ticket.attachmentIds.map((aid, i) => (
                                <a 
                                    key={aid} 
                                    href={`http://localhost:8080/api/v1/tickets/attachments/${aid}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="attachment-chip"
                                >
                                    📎 View Attachment {i + 1}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="comments-section-wrapper">
                <CommentSection ticketId={id} />
            </div>
        </div>
    );
}

export default TicketDetails;
