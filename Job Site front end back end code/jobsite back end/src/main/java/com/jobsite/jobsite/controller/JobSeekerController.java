package com.jobsite.jobsite.controller;

import com.jobsite.jobsite.model.dto.ApplicationDTO;
import com.jobsite.jobsite.model.dto.JobDTO;
import com.jobsite.jobsite.service.JobSeekerService;
import com.jobsite.jobsite.util.JobType;
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
@RequestMapping("/job-seekers")
@PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
@RequiredArgsConstructor
public class JobSeekerController {

    private final JobSeekerService jobSeekerService;

    /**
     * Get all available jobs with pagination
     */
    @GetMapping("/jobs")
    public ResponseEntity<Page<JobDTO>> getAvailableJobs(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<JobDTO> jobs = jobSeekerService.getAvailableJobs(pageable);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Get job by ID
     */
    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable Long id) {
        JobDTO job = jobSeekerService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    /**
     * Search jobs by keyword
     */
    @GetMapping("/jobs/search")
    public ResponseEntity<List<JobDTO>> searchJobsByKeyword(@RequestParam String keyword) {
        List<JobDTO> jobs = jobSeekerService.searchJobsByKeyword(keyword);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Search jobs by location
     */
    @GetMapping("/jobs/search/location")
    public ResponseEntity<List<JobDTO>> searchJobsByLocation(@RequestParam String location) {
        List<JobDTO> jobs = jobSeekerService.searchJobsByLocation(location);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Get jobs by type
     */
    @GetMapping("/jobs/type/{type}")
    public ResponseEntity<List<JobDTO>> getJobsByType(@PathVariable JobType type) {
        List<JobDTO> jobs = jobSeekerService.getJobsByType(type);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Get all my applications
     */
    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications() {
        List<ApplicationDTO> applications = jobSeekerService.getMyApplications();
        return ResponseEntity.ok(applications);
    }

    /**
     * Get application by ID
     */
    @GetMapping("/applications/{id}")
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable Long id) {
        ApplicationDTO application = jobSeekerService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    /**
     * Submit application
     */
    @PostMapping("/applications")
    public ResponseEntity<ApplicationDTO> submitApplication(@RequestBody ApplicationDTO applicationDTO) {
        ApplicationDTO application = jobSeekerService.submitApplication(applicationDTO);
        return ResponseEntity.ok(application);
    }

    /**
     * Get job seeker statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        JobSeekerService.JobSeekerStatistics stats = jobSeekerService.getStatistics();
        
        Map<String, Object> response = Map.of(
                "totalApplications", stats.getTotalApplications(),
                "submittedApplications", stats.getSubmittedApplications(),
                "reviewedApplications", stats.getReviewedApplications(),
                "shortlistedApplications", stats.getShortlistedApplications(),
                "rejectedApplications", stats.getRejectedApplications(),
                "hiredApplications", stats.getHiredApplications()
        );
        
        return ResponseEntity.ok(response);
    }
}
