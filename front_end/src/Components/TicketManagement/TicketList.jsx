import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TicketList.css";

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [technician, setTechnician] = useState("");
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/tickets")
            .then((res) => {
                setTickets(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handleEdit = (ticket) => {
        setSelectedTicket(ticket);
        setTechnician(ticket.assignedTechnician || "");
        setStatus(ticket.status || "");
        setNotes(ticket.resolutionNotes || "");
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:8080/api/v1/tickets/${selectedTicket.id}`,
                {
                    assignedTechnician: technician,
                    status: status,
                    resolutionNotes: notes
                }
            );

            alert("Ticket Updated!");
            window.location.reload();

        } catch (error) {
            console.error(error);
            alert("Update failed");
        }
    };

    return (
        <div className="ticket-list-container">
            <h2>All Tickets (Admin)</h2>

            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Contact</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {tickets.map((t) => (
                        <tr key={t.id}>
                            <td>{t.ticketCode}</td>
                            <td>{t.title}</td>
                            <td>{t.category}</td>
                            <td>{t.priority}</td>
                            <td>{t.status}</td>
                            <td>{t.preferredContactName}</td>
                            <td>
                                <button onClick={() => handleEdit(t)}>Assign</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedTicket && (
                <div className="popup">
                    <h3>Assign Technician</h3>

                    <input
                        placeholder="Technician Name"
                        value={technician}
                        onChange={(e) => setTechnician(e.target.value)}
                    />

                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Select Status</option>
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>

                    <textarea
                        placeholder="Resolution Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />

                    <button onClick={handleUpdate}>Update</button>
                    <button className="cancel-btn" onClick={() => setSelectedTicket(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default TicketList;