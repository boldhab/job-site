package com.jobsite.jobsite.controller;

import com.jobsite.jobsite.model.entity.Employer;
import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.model.entity.JobModerationLog;
import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.service.AdminService;
import com.jobsite.jobsite.service.JobService;
import com.jobsite.jobsite.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final JobService jobService;

    // ============ EMPLOYER MANAGEMENT ============

    /**
     * Get all pending employers
     */
    @GetMapping("/employers/pending")
    public ResponseEntity<List<Employer>> getPendingEmployers() {
        List<Employer> employers = adminService.getPendingEmployers();
        return ResponseEntity.ok(employers);
    }

    /**
     * Get all approved employers
     */
    @GetMapping("/employers/approved")
    public ResponseEntity<List<Employer>> getApprovedEmployers() {
        List<Employer> employers = adminService.getApprovedEmployers();
        return ResponseEntity.ok(employers);
    }

    /**
     * Get all employers
     */
    @GetMapping("/employers")
    public ResponseEntity<List<Employer>> getAllEmployers() {
        List<Employer> employers = adminService.getAllEmployers();
        return ResponseEntity.ok(employers);
    }

    /**
     * Approve employer
     */
    @PutMapping("/employers/{id}/approve")
    public ResponseEntity<Employer> approveEmployer(@PathVariable Long id) {
        Employer employer = adminService.approveEmployer(id);
        return ResponseEntity.ok(employer);
    }

    /**
     * Reject employer
     */
    @PutMapping("/employers/{id}/reject")
    public ResponseEntity<Employer> rejectEmployer(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        Employer employer = adminService.rejectEmployer(id, reason);
        return ResponseEntity.ok(employer);
    }

    /**
     * Search employers by company name
     */
    @GetMapping("/employers/search")
    public ResponseEntity<List<Employer>> searchEmployers(@RequestParam String companyName) {
        List<Employer> employers = adminService.searchEmployers(companyName);
        return ResponseEntity.ok(employers);
    }

    // ============ USER MANAGEMENT ============

    /**
     * Get all users with pagination
     */
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<User> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Get users by role
     */
    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable Role role) {
        List<User> users = adminService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    /**
     * Activate user account
     */
    @PutMapping("/users/{id}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long id) {
        User user = adminService.activateUser(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Deactivate user account
     */
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<User> deactivateUser(@PathVariable Long id) {
        User user = adminService.deactivateUser(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Delete user (soft delete)
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Search users by email
     */
    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String email) {
        List<User> users = adminService.searchUsers(email);
        return ResponseEntity.ok(users);
    }

    // ============ JOB MANAGEMENT ============

    /**
     * Get pending jobs (already in JobController, but included here for completeness)
     */
    @GetMapping("/jobs/pending")
    public ResponseEntity<List<Job>> getPendingJobs() {
        List<Job> jobs = jobService.getJobsByStatus(com.jobsite.jobsite.util.JobStatus.PENDING);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Approve job
     */
    @PutMapping("/jobs/{id}/approve")
    public ResponseEntity<Job> approveJob(@PathVariable Long id) {
        Job job = jobService.approveJob(id);
        return ResponseEntity.ok(job);
    }

    /**
     * Reject job
     */
    @PutMapping("/jobs/{id}/reject")
    public ResponseEntity<Job> rejectJob(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        Job job = jobService.rejectJob(id, reason);
        return ResponseEntity.ok(job);
    }

    // ============ MODERATION LOGS ============

    /**
     * Get moderation logs for a job
     */
    @GetMapping("/moderation-logs/job/{jobId}")
    public ResponseEntity<List<JobModerationLog>> getJobModerationLogs(@PathVariable Long jobId) {
        List<JobModerationLog> logs = adminService.getJobModerationLogs(jobId);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get all moderation logs
     */
    @GetMapping("/moderation-logs")
    public ResponseEntity<List<JobModerationLog>> getAllModerationLogs() {
        List<JobModerationLog> logs = adminService.getAllModerationLogs();
        return ResponseEntity.ok(logs);
    }

    // ============ STATISTICS ============

    /**
     * Get dashboard statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getDashboardStatistics() {
        Map<String, Object> stats = adminService.getDashboardStatistics();
        return ResponseEntity.ok(stats);
    }
}
