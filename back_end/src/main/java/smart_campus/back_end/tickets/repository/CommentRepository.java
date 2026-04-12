package smart_campus.back_end.tickets.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smart_campus.back_end.tickets.entity.Comment;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTicketId(Long ticketId);
}