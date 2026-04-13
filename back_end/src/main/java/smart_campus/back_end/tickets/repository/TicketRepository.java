package smart_campus.back_end.tickets.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smart_campus.back_end.tickets.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}