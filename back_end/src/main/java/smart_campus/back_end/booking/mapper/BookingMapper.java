package smart_campus.back_end.booking.mapper;

import smart_campus.back_end.booking.dto.BookingResponse;
import smart_campus.back_end.booking.model.Booking;

public class BookingMapper {

    private BookingMapper() {
    }

    public static BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .resourceId(booking.getResourceId())
                .userId(booking.getUserId())
                .bookingDate(booking.getBookingDate())
                .startDateTime(booking.getStartDateTime())
                .endDateTime(booking.getEndDateTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .adminReason(booking.getAdminReason())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}