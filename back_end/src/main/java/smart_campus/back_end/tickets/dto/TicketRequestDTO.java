package smart_campus.back_end.tickets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketRequestDTO {
    private String title;
    private String description;
    private String category;
    private String priority;
    private String location;
    private String resourceName;
    private String preferredContactName;
    private String preferredContactEmail;
    private String preferredContactPhone;
}
