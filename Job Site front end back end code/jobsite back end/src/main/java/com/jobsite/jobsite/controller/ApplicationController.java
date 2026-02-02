package com.jobsite.jobsite.controller;

import com.jobsite.jobsite.model.dto.ApplicationDTO;
import com.jobsite.jobsite.service.ApplicationService;
import com.jobsite.jobsite.util.ApplicationStatus;
import jakarta.validation.Valid;
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
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    /**
     * Submit a new job application (Job Seeker only)
     */
    @PostMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApplicationDTO> submitApplication(@Valid @RequestBody ApplicationDTO applicationDTO) {
        ApplicationDTO application = applicationService.submitApplication(applicationDTO);
        return ResponseEntity.ok(application);
    }

    /**
     * Get all applications for current user
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ApplicationDTO>> getApplications(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ApplicationDTO> applications = applicationService.getApplications(pageable);
        return ResponseEntity.ok(applications);
    }

    /**
     * Get application by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable Long id) {
        ApplicationDTO application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    /**
     * Get all applications for current job seeker
     */
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications() {
        List<ApplicationDTO> applications = applicationService.getMyApplications();
        return ResponseEntity.ok(applications);
    }

    /**
     * Get all applications for a specific job (Employer only)
     */
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByJob(@PathVariable Long jobId) {
        List<ApplicationDTO> applications = applicationService.getApplicationsByJob(jobId);
        return ResponseEntity.ok(applications);
    }

    /**
     * Get all applications for current employer's jobs
     */
    @GetMapping("/my-jobs/applications")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<ApplicationDTO>> getMyJobApplications() {
        List<ApplicationDTO> applications = applicationService.getMyJobApplications();
        return ResponseEntity.ok(applications);
    }

    /**
     * Get applications by status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByStatus(@PathVariable ApplicationStatus status) {
        List<ApplicationDTO> applications = applicationService.getApplicationsByStatus(status);
        return ResponseEntity.ok(applications);
    }

    /**
     * Update application status (Employer/Admin only)
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        ApplicationStatus newStatus = ApplicationStatus.valueOf(request.get("status"));
        ApplicationDTO application = applicationService.updateApplicationStatus(id, newStatus);
        return ResponseEntity.ok(application);
    }

    /**
     * Update employer notes for an application (Employer/Admin only)
     */
    @PutMapping("/{id}/notes")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<ApplicationDTO> updateEmployerNotes(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String notes = request.get("note");
        ApplicationDTO application = applicationService.updateEmployerNotes(id, notes);
        return ResponseEntity.ok(application);
    }

    /**
     * Delete application (Job Seeker only - can only delete their own)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}
