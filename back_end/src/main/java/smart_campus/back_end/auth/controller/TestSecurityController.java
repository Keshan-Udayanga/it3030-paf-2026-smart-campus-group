package smart_campus.back_end.auth.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/secure")
public class TestSecurityController {

    @GetMapping("/student")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public String studentAccess() {
        return "Student endpoint accessed";
    }

    @GetMapping("/technician")
    @PreAuthorize("hasAuthority('ROLE_TECHNICIAN')")
    public String technicianAccess() {
        return "Technician endpoint accessed";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String adminAccess() {
        return "Admin endpoint accessed";
    }

    // Optional: show logged-in user's roles
    @GetMapping("/me")
    public String currentUser(@AuthenticationPrincipal OAuth2User user) {
        return "Logged in as: " + user.getAttribute("email") +
                " | Roles: " + user.getAuthorities();
    }
}
