package com.jobsite.jobsite.service;

import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.repository.UserRepository;
import com.jobsite.jobsite.util.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Get the currently authenticated user
     */
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email);
    }

    /**
     * Get current user or throw exception if not found
     */
    public User getCurrentUserOrThrow() {
        return getCurrentUser()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));
    }

    /**
     * Update user profile - basic user information
     */
    public User updateProfile(User userDetails) {
        User currentUser = getCurrentUserOrThrow();

        // Update allowed fields - only fields that exist in User entity
        // Note: The User entity in your code only has:
        // - email, password, role, isActive, createdAt, updatedAt

        // You can update isActive if needed
        if (userDetails.getIsActive() != null) {
            currentUser.setIsActive(userDetails.getIsActive());
        }

        // Important: Do NOT allow updating email, password, or role here
        // Those should have separate endpoints with proper validation

        return userRepository.save(currentUser);
    }

    /**
     * Deactivate current user account
     */
    public void deactivateAccount() {
        User currentUser = getCurrentUserOrThrow();
        currentUser.setIsActive(false);
        userRepository.save(currentUser);
    }

    /**
     * Activate user account (admin only)
     */
    public void activateAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setIsActive(true);
        userRepository.save(user);
    }

    /**
     * Get user by ID
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    /**
     * Get user by email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    /**
     * Check if user exists by email
     */
    public boolean userExistsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Get all users (admin only)
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get users by role
     */
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    /**
     * Get active users count
     */
    public long getActiveUsersCount() {
        return userRepository.countByIsActive(true);
    }

    /**
     * Change user password (with proper encryption)
     */
    public void changePassword(String currentPassword, String newPassword) {
        User currentUser = getCurrentUserOrThrow();

        if (!passwordEncoder.matches(currentPassword, currentUser.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        currentUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(currentUser);
    }

    /**
     * Update user email (with verification)
     */
    public void updateEmail(String newEmail) {
        User currentUser = getCurrentUserOrThrow();

        // Check if email already exists
        if (userRepository.existsByEmail(newEmail)) {
            throw new RuntimeException("Email already in use");
        }

        currentUser.setEmail(newEmail);
        userRepository.save(currentUser);

        // In production, you should send verification email first
    }

    /**
     * Get user statistics (admin only)
     */
    public UserStatistics getUserStatistics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActive(true);
        long jobSeekers = userRepository.findByRole(Role.JOB_SEEKER).size();
        long employers = userRepository.findByRole(Role.EMPLOYER).size();
        long admins = userRepository.findByRole(Role.ADMIN).size();

        return new UserStatistics(totalUsers, activeUsers, jobSeekers, employers, admins);
    }

    /**
     * Inner class for user statistics
     */
    public static class UserStatistics {
        private final long totalUsers;
        private final long activeUsers;
        private final long jobSeekers;
        private final long employers;
        private final long admins;

        public UserStatistics(long totalUsers, long activeUsers,
                long jobSeekers, long employers, long admins) {
            this.totalUsers = totalUsers;
            this.activeUsers = activeUsers;
            this.jobSeekers = jobSeekers;
            this.employers = employers;
            this.admins = admins;
        }

        // Getters
        public long getTotalUsers() {
            return totalUsers;
        }

        public long getActiveUsers() {
            return activeUsers;
        }

        public long getJobSeekers() {
            return jobSeekers;
        }

        public long getEmployers() {
            return employers;
        }

        public long getAdmins() {
            return admins;
        }

        public long getInactiveUsers() {
            return totalUsers - activeUsers;
        }
    }
}