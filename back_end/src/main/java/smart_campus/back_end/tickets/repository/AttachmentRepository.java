package smart_campus.back_end.tickets.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smart_campus.back_end.tickets.entity.Attachment;
import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByTicketId(Long ticketId);
}