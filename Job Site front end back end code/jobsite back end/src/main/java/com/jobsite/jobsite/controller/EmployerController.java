package com.jobsite.jobsite.controller;

import com.jobsite.jobsite.model.dto.ApplicationDTO;
import com.jobsite.jobsite.model.entity.Employer;
import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.service.EmployerService;
import com.jobsite.jobsite.util.ApplicationStatus;
import com.jobsite.jobsite.util.JobStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employers")
@PreAuthorize("hasRole('EMPLOYER')")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService employerService;

    /**
     * Get current employer profile
     */
    @GetMapping("/profile")
    public ResponseEntity<Employer> getProfile() {
        Employer employer = employerService.getCurrentEmployer();
        return ResponseEntity.ok(employer);
    }

    /**
     * Update current employer profile
     */
    @PutMapping("/profile")
    public ResponseEntity<Employer> updateProfile(@RequestBody Employer employer) {
        Employer updated = employerService.updateProfile(employer);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get all my jobs
     */
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getMyJobs() {
        List<Job> jobs = employerService.getMyJobs();
        return ResponseEntity.ok(jobs);
    }

    /**
     * Get jobs by status
     */
    @GetMapping("/jobs/status/{status}")
    public ResponseEntity<List<Job>> getMyJobsByStatus(@PathVariable JobStatus status) {
        List<Job> jobs = employerService.getMyJobsByStatus(status);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Get all applications for my jobs
     */
    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDTO>> getMyJobApplications() {
        List<ApplicationDTO> applications = employerService.getMyJobApplications();
        return ResponseEntity.ok(applications);
    }

    /**
     * Get applications for a specific job
     */
    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsForJob(@PathVariable Long jobId) {
        List<ApplicationDTO> applications = employerService.getApplicationsForJob(jobId);
        return ResponseEntity.ok(applications);
    }

    /**
     * Update application status
     */
    @PutMapping("/applications/{id}/status")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        ApplicationStatus newStatus = ApplicationStatus.valueOf(request.get("status"));
        ApplicationDTO application = employerService.updateApplicationStatus(id, newStatus);
        return ResponseEntity.ok(application);
    }

    /**
     * Check if employer is approved
     */
    @GetMapping("/approved")
    public ResponseEntity<Map<String, Boolean>> isApproved() {
        boolean approved = employerService.isApproved();
        return ResponseEntity.ok(Map.of("approved", approved));
    }

    /**
     * Get employer statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        EmployerService.EmployerStatistics stats = employerService.getStatistics();
        
        Map<String, Object> response = Map.of(
                "totalJobs", stats.getTotalJobs(),
                "activeJobs", stats.getActiveJobs(),
                "pendingJobs", stats.getPendingJobs(),
                "closedJobs", stats.getClosedJobs(),
                "totalApplications", stats.getTotalApplications(),
                "pendingApplications", stats.getPendingApplications(),
                "reviewedApplications", stats.getReviewedApplications(),
                "shortlistedApplications", stats.getShortlistedApplications(),
                "hiredApplications", stats.getHiredApplications()
        );
        
        return ResponseEntity.ok(response);
    }
}
