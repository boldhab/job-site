package com.jobsite.jobsite.service;

import com.jobsite.jobsite.model.entity.Employer;
import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.model.entity.JobModerationLog;
import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.repository.ApplicationRepository;
import com.jobsite.jobsite.repository.EmployerRepository;
import com.jobsite.jobsite.repository.JobModerationLogRepository;
import com.jobsite.jobsite.repository.JobRepository;
import com.jobsite.jobsite.repository.UserRepository;
import com.jobsite.jobsite.util.ModerationAction;
import com.jobsite.jobsite.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final EmployerRepository employerRepository;
    private final JobRepository jobRepository;
    private final JobModerationLogRepository moderationLogRepository;
    private final ApplicationRepository applicationRepository;
    private final UserService userService;
    private final JobService jobService;

    /**
     * Approve employer account
     */
    public Employer approveEmployer(Long employerId) {
        validateAdminAccess();
        
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer not found with id: " + employerId));
        
        employer.setIsApproved(true);
        return employerRepository.save(employer);
    }

    /**
     * Reject employer account
     */
    public Employer rejectEmployer(Long employerId, String reason) {
        validateAdminAccess();
        
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer not found with id: " + employerId));
        
        employer.setIsApproved(false);
        return employerRepository.save(employer);
    }

    /**
     * Get all pending employers
     */
    public List<Employer> getPendingEmployers() {
        validateAdminAccess();
        return employerRepository.findByIsApproved(false);
    }

    /**
     * Get all approved employers
     */
    public List<Employer> getApprovedEmployers() {
        validateAdminAccess();
        return employerRepository.findByIsApproved(true);
    }

    /**
     * Get all employers
     */
    public List<Employer> getAllEmployers() {
        validateAdminAccess();
        return employerRepository.findAll();
    }

    /**
     * Get user by ID
     */
    public User getUserById(Long userId) {
        validateAdminAccess();
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    /**
     * Get all users with pagination
     */
    public Page<User> getAllUsers(Pageable pageable) {
        validateAdminAccess();
        return userRepository.findAll(pageable);
    }

    /**
     * Get users by role
     */
    public List<User> getUsersByRole(Role role) {
        validateAdminAccess();
        return userRepository.findByRole(role);
    }

    /**
     * Activate user account
     */
    public User activateUser(Long userId) {
        validateAdminAccess();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setIsActive(true);
        return userRepository.save(user);
    }

    /**
     * Deactivate user account
     */
    public User deactivateUser(Long userId) {
        validateAdminAccess();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setIsActive(false);
        return userRepository.save(user);
    }

    /**
     * Delete user (soft delete by deactivating)
     */
    public void deleteUser(Long userId) {
        validateAdminAccess();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Prevent deleting admin accounts
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot delete admin accounts");
        }
        
        user.setIsActive(false);
        userRepository.save(user);
    }

    /**
     * Get moderation logs for a job
     */
    public List<JobModerationLog> getJobModerationLogs(Long jobId) {
        validateAdminAccess();
        return moderationLogRepository.findByJobIdOrderByCreatedAtDesc(jobId);
    }

    /**
     * Get all moderation logs
     */
    public List<JobModerationLog> getAllModerationLogs() {
        validateAdminAccess();
        return moderationLogRepository.findAll();
    }

    /**
     * Create moderation log entry
     */
    public JobModerationLog createModerationLog(Job job, ModerationAction action, String reason) {
        validateAdminAccess();
        User admin = userService.getCurrentUserOrThrow();
        
        JobModerationLog log = new JobModerationLog();
        log.setJob(job);
        log.setAdmin(admin);
        log.setAction(action);
        log.setReason(reason);
        log.setCreatedAt(LocalDateTime.now());
        
        return moderationLogRepository.save(log);
    }

    /**
     * Get dashboard statistics
     */
    public Map<String, Object> getDashboardStatistics() {
        validateAdminAccess();
        
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        UserService.UserStatistics userStats = userService.getUserStatistics();
        stats.put("totalUsers", userStats.getTotalUsers());
        stats.put("activeUsers", userStats.getActiveUsers());
        stats.put("jobSeekers", userStats.getJobSeekers());
        stats.put("employers", userStats.getEmployers());
        stats.put("admins", userStats.getAdmins());
        
        // Job statistics
        JobService.JobStatistics jobStats = jobService.getJobStatistics();
        stats.put("totalJobs", jobStats.getTotalJobs());
        stats.put("activeJobs", jobStats.getActiveJobs());
        stats.put("pendingJobs", jobStats.getPendingJobs());
        stats.put("closedJobs", jobStats.getClosedJobs());
        stats.put("rejectedJobs", jobStats.getRejectedJobs());
        
        // Employer statistics
        long totalEmployers = employerRepository.count();
        long approvedEmployers = employerRepository.findByIsApproved(true).size();
        long pendingEmployers = employerRepository.findByIsApproved(false).size();
        stats.put("totalEmployers", totalEmployers);
        stats.put("approvedEmployers", approvedEmployers);
        stats.put("pendingEmployers", pendingEmployers);

        // Application statistics
        long totalApplications = applicationRepository.count();
        stats.put("totalApplications", totalApplications);

        return stats;
    }

    /**
     * Search employers by company name
     */
    public List<Employer> searchEmployers(String companyName) {
        validateAdminAccess();
        return employerRepository.findByCompanyNameContainingIgnoreCase(companyName);
    }

    /**
     * Search users by email
     */
    public List<User> searchUsers(String email) {
        validateAdminAccess();
        return userRepository.findByEmailContainingIgnoreCase(email);
    }

    // ============ HELPER METHODS ============

    private void validateAdminAccess() {
        User currentUser = userService.getCurrentUserOrThrow();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied. Admin role required.");
        }
    }
}
