package com.jobsite.jobsite.controller;

import com.jobsite.jobsite.model.dto.AuthRequest;
import com.jobsite.jobsite.model.dto.AuthResponse;
import com.jobsite.jobsite.model.dto.RegisterRequest;
import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.service.AuthService;
import com.jobsite.jobsite.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    // Authentication endpoints
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

   @PostMapping("/refresh")
public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> body) {
    String token = body.get("token");

    if (token == null || token.isBlank()) {
        return ResponseEntity.badRequest().build();
    }

    AuthResponse response = authService.refreshToken(token);
    return ResponseEntity.ok(response);
}


    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = Map.of("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    // Profile endpoints (moved from separate controller for convenience)
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getCurrentUser() {
        User user = userService.getCurrentUserOrThrow();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody Map<String, String> passwordRequest) {
        String currentPassword = passwordRequest.get("currentPassword");
        String newPassword = passwordRequest.get("newPassword");
        
        userService.changePassword(currentPassword, newPassword);
        
        Map<String, String> response = Map.of("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmailAvailability(
            @RequestParam String email) {
        boolean exists = userService.userExistsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}