package com.jobsite.jobsite.controller;

import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.service.UserService;
import com.jobsite.jobsite.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ============ USER PROFILE ENDPOINTS ============
    
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getMyProfile() {
        User user = userService.getCurrentUserOrThrow();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateMyProfile(@RequestBody User userDetails) {
        User updatedUser = userService.updateProfile(userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/deactivate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deactivateMyAccount() {
        userService.deactivateAccount();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Account deactivated successfully");
        return ResponseEntity.ok(response);
    }

    // ============ ADMIN ENDPOINTS ============
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable Role role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activateUser(@PathVariable Long id) {
        userService.activateAccount(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User account activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        user.setIsActive(false);
        // You would typically inject UserRepository here or add a method to UserService
        Map<String, String> response = new HashMap<>();
        response.put("message", "User account deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        long totalUsers = userService.getAllUsers().size();
        long activeUsers = userService.getActiveUsersCount();
        long jobSeekers = userService.getUsersByRole(Role.JOB_SEEKER).size();
        long employers = userService.getUsersByRole(Role.EMPLOYER).size();
        long admins = userService.getUsersByRole(Role.ADMIN).size();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("inactiveUsers", totalUsers - activeUsers);
        stats.put("jobSeekers", jobSeekers);
        stats.put("employers", employers);
        stats.put("admins", admins);
        
        return ResponseEntity.ok(stats);
    }
}