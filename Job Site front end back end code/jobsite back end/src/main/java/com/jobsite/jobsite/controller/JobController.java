package com.jobsite.jobsite.controller;

import com.jobsite.jobsite.model.dto.JobDTO;
import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.service.JobService;
import com.jobsite.jobsite.util.JobStatus;
import com.jobsite.jobsite.util.JobType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // ============ PUBLIC ENDPOINTS ============

     // ================= PUBLIC =================

   @GetMapping("/public")
    public ResponseEntity<Page<JobDTO>> getPublicJobs(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {

        return ResponseEntity.ok(
                jobService.getAllActiveJobsPaged(pageable)
                        .map(jobService::convertToDTO)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(
                jobService.convertToDTO(jobService.getJobById(id))
        );
    }


    // @GetMapping("/public")
    // public ResponseEntity<Page<JobDTO>> getPublicJobs(
    //         @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
    //     Page<Job> jobs = jobService.getAllActiveJobsPaged(pageable);
    //     Page<JobDTO> jobDTOs = jobs.map(jobService::convertToDTO);
    //     return ResponseEntity.ok(jobDTOs);
    // }

    // @GetMapping("/{id}")
    // public ResponseEntity<JobDTO> getJobById(@PathVariable Long id) {
    //     Job job = jobService.getJobById(id);
    //     JobDTO dto = jobService.convertToDTO(job);
    //     return ResponseEntity.ok(dto);
    // }

    @GetMapping("/search")
    public ResponseEntity<Page<JobDTO>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType type,
            @RequestParam(required = false) String title,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {

        Page<Job> jobs;
        if (keyword != null && !keyword.trim().isEmpty()) {
            jobs = jobService.searchJobsByKeyword(keyword, pageable);
        } else if (location != null && !location.trim().isEmpty()) {
            jobs = jobService.searchJobsByLocation(location, pageable);
        } else if (type != null) {
            jobs = jobService.getJobsByType(type, pageable);
        } else if (title != null && !title.trim().isEmpty()) {
            // For title search, use keyword search
            jobs = jobService.searchJobsByKeyword(title, pageable);
        } else {
            jobs = jobService.getAllActiveJobsPaged(pageable);
        }

       
          return ResponseEntity.ok(
                jobService.searchJobsByKeyword(keyword, pageable)
                        .map(jobService::convertToDTO)
        );
    }
    

    // ============ EMPLOYER ENDPOINTS ============

   @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobDTO> createJob(@RequestBody Job job) {
        Job saved = jobService.createJob(job);
        return ResponseEntity.ok(jobService.convertToDTO(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobDTO> updateJob(
            @PathVariable Long id,
            @RequestBody Job job) {

        Job updated = jobService.updateJob(id, job);
        return ResponseEntity.ok(jobService.convertToDTO(updated));
    }

    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<JobDTO>> getMyJobs() {
        return ResponseEntity.ok(
                jobService.getMyJobs()
                        .stream()
                        .map(jobService::convertToDTO)
                        .toList()
        );
    }
    

    // @PostMapping
    // @PreAuthorize("hasRole('EMPLOYER')")
    // public ResponseEntity<Job> createJob(@RequestBody Job job) {
    //     return ResponseEntity.ok(jobService.createJob(job));
    // }

    // @PutMapping("/{id}")
    // @PreAuthorize("hasRole('EMPLOYER')")
    // public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job job) {
    //     return ResponseEntity.ok(jobService.updateJob(id, job));
    // }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    // @GetMapping("/my-jobs")
    // @PreAuthorize("hasRole('EMPLOYER')")
    // public ResponseEntity<List<Job>> getMyJobs() {
    //     return ResponseEntity.ok(jobService.getMyJobs());
    // }

    @GetMapping("/my-jobs/status/{status}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<Job>> getMyJobsByStatus(@PathVariable JobStatus status) {
        return ResponseEntity.ok(jobService.getMyJobsByStatus(status));
    }

    

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Job> closeJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.closeJob(id));
    }

    

    // ============ ADMIN ENDPOINTS ============

    // @GetMapping("/admin/pending")
    // @PreAuthorize("hasRole('ADMIN')")
    // public ResponseEntity<List<Job>> getPendingJobs() {
    //     return ResponseEntity.ok(jobService.getJobsByStatus(JobStatus.PENDING));
    // }



    // @PutMapping("/admin/{id}/approve")
    // @PreAuthorize("hasRole('ADMIN')")
    // public ResponseEntity<Job> approveJob(@PathVariable Long id) {
    //     return ResponseEntity.ok(jobService.approveJob(id));
    // }
// @PutMapping("/admin/{id}/approve")
// @PreAuthorize("hasRole('ADMIN')")
// public ResponseEntity<JobDTO> approveJob(@PathVariable Long id) {
//     Job job = jobService.approveJob(id);
//     return ResponseEntity.ok(jobService.convertToDTO(job));
// }

    // @PutMapping("/admin/{id}/reject")
    // @PreAuthorize("hasRole('ADMIN')")
    // public ResponseEntity<Job> rejectJob(@PathVariable Long id, @RequestBody Map<String, String> request) {
    //     String reason = request.get("reason");
    //     return ResponseEntity.ok(jobService.rejectJob(id, reason));
    // }
// @PutMapping("/admin/{id}/reject")
// @PreAuthorize("hasRole('ADMIN')")
// public ResponseEntity<JobDTO> rejectJob(
//         @PathVariable Long id,
//         @RequestBody Map<String, String> request) {

//     String reason = request.get("reason");
//     Job job = jobService.rejectJob(id, reason);
//     return ResponseEntity.ok(jobService.convertToDTO(job));
// }


    // ================= ADMIN =================

    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JobDTO>> getPendingJobs() {
        return ResponseEntity.ok(
                jobService.getJobsByStatus(JobStatus.PENDING)
                        .stream()
                        .map(jobService::convertToDTO)
                        .toList()
        );
    }

    @PutMapping("/admin/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobDTO> approveJob(@PathVariable Long id) {
        return ResponseEntity.ok(
                jobService.convertToDTO(jobService.approveJob(id))
        );
    }

    @PutMapping("/admin/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobDTO> rejectJob(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        return ResponseEntity.ok(
                jobService.convertToDTO(
                        jobService.rejectJob(id, request.get("reason"))
                )
        );
    }

    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<JobDTO>> getJobsByStatus(
            @PathVariable JobStatus status,
            @PageableDefault(size = 20) Pageable pageable) {

        return ResponseEntity.ok(
                jobService.getJobsByStatus(status, pageable)
                        .map(jobService::convertToDTO)
        );
    }

    @GetMapping("/admin/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getJobStatistics() {
        JobService.JobStatistics stats = jobService.getJobStatistics();

        Map<String, Object> response = new HashMap<>();
        response.put("totalJobs", stats.getTotalJobs());
        response.put("activeJobs", stats.getActiveJobs());
        // response.put("pendingJobs", stats.getPendingJobs());
        response.put("closedJobs", stats.getClosedJobs());
        response.put("rejectedJobs", stats.getRejectedJobs());

        return ResponseEntity.ok(response);
    }
}
