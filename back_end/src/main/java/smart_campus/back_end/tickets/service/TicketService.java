package smart_campus.back_end.tickets.service;

import smart_campus.back_end.tickets.dto.TicketRequestDTO;
import smart_campus.back_end.tickets.entity.Ticket;

public interface TicketService {

    Ticket createTicket(TicketRequestDTO ticketRequestDTO);
}