package smart_campus.back_end.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import smart_campus.back_end.booking.model.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private String id;
    private String resourceId;
    private String userId;

    private LocalDate bookingDate;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    private String purpose;
    private Integer expectedAttendees;

    private BookingStatus status;
    private String adminReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}