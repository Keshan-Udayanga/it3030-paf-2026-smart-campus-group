package smart_campus.back_end.booking.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart_campus.back_end.booking.dto.BookingResponse;
import smart_campus.back_end.booking.dto.CreateBookingRequest;
import smart_campus.back_end.booking.dto.ReviewBookingRequest;
import smart_campus.back_end.booking.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(request));
    }

    // ================= GET BOOKINGS (ADMIN + USER) =================
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
            @RequestParam(required = false) String userId
    ) {
        return ResponseEntity.ok(bookingService.getBookings(userId));
    }

    // ================= GET MY BOOKINGS =================
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @RequestParam String userId
    ) {
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    // ================= REVIEW (ADMIN ONLY LOGIC LATER SECURE කරන්න) =================
    @PatchMapping("/{id}/review")
    public ResponseEntity<BookingResponse> reviewBooking(
            @PathVariable String id,
            @Valid @RequestBody ReviewBookingRequest request
    ) {
        return ResponseEntity.ok(bookingService.reviewBooking(id, request));
    }

    // ================= CANCEL =================
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}