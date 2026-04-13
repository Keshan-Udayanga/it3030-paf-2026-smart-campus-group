package smart_campus.back_end.tickets.dto;

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

    public TicketRequestDTO() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getPreferredContactName() {
        return preferredContactName;
    }

    public void setPreferredContactName(String preferredContactName) {
        this.preferredContactName = preferredContactName;
    }

    public String getPreferredContactEmail() {
        return preferredContactEmail;
    }

    public void setPreferredContactEmail(String preferredContactEmail) {
        this.preferredContactEmail = preferredContactEmail;
    }

    public String getPreferredContactPhone() {
        return preferredContactPhone;
    }

    public void setPreferredContactPhone(String preferredContactPhone) {
        this.preferredContactPhone = preferredContactPhone;
    }
}