package com.jobsite.jobsite.service;

import com.jobsite.jobsite.model.dto.ApplicationDTO;
import com.jobsite.jobsite.model.dto.JobDTO;
import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.model.entity.JobSeeker;
import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.repository.JobSeekerRepository;
import com.jobsite.jobsite.util.JobStatus;
import com.jobsite.jobsite.util.JobType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class JobSeekerService {

    private final JobSeekerRepository jobSeekerRepository;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final UserService userService;

    /**
     * Get current job seeker profile
     */
    public JobSeeker getCurrentJobSeeker() {
        User currentUser = userService.getCurrentUserOrThrow();
        
        if (!currentUser.getRole().name().equals("JOB_SEEKER")) {
            throw new RuntimeException("User is not a job seeker");
        }

        return jobSeekerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));
    }

    /**
     * Get all active jobs (for job seekers to browse)
     */
    public List<JobDTO> getAvailableJobs() {
        List<Job> jobs = jobService.getAllActiveJobs();
        return jobs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all active jobs with pagination
     */
    public Page<JobDTO> getAvailableJobs(Pageable pageable) {
        return jobService.getAllActiveJobsPaged(pageable)
                .map(this::convertToDTO);
    }

    /**
     * Search jobs by keyword
     */
    public List<JobDTO> searchJobsByKeyword(String keyword) {
        List<Job> jobs = jobService.searchJobsByKeyword(keyword);
        return jobs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search jobs by location
     */
    public List<JobDTO> searchJobsByLocation(String location) {
        List<Job> jobs = jobService.searchJobsByLocation(location);
        return jobs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get jobs by type
     */
    public List<JobDTO> getJobsByType(JobType jobType) {
        List<Job> jobs = jobService.getJobsByType(jobType);
        return jobs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get job by ID (with employer email visible)
     */
    public JobDTO getJobById(Long jobId) {
        Job job = jobService.getJobById(jobId);
        return convertToDTO(job);
    }

    /**
     * Get all applications for current job seeker
     */
    public List<ApplicationDTO> getMyApplications() {
        return applicationService.getMyApplications();
    }

    /**
     * Get application by ID
     */
    public ApplicationDTO getApplicationById(Long applicationId) {
        return applicationService.getApplicationById(applicationId);
    }

    /**
     * Submit application
     */
    public ApplicationDTO submitApplication(ApplicationDTO applicationDTO) {
        return applicationService.submitApplication(applicationDTO);
    }

    /**
     * Get job seeker statistics
     */
    public JobSeekerStatistics getStatistics() {
        JobSeeker jobSeeker = getCurrentJobSeeker();
        
        List<ApplicationDTO> applications = getMyApplications();
        long totalApplications = applications.size();
        long submittedApplications = applications.stream()
                .filter(app -> app.getStatus() == com.jobsite.jobsite.util.ApplicationStatus.SUBMITTED)
                .count();
        long reviewedApplications = applications.stream()
                .filter(app -> app.getStatus() == com.jobsite.jobsite.util.ApplicationStatus.REVIEWED)
                .count();
        long shortlistedApplications = applications.stream()
                .filter(app -> app.getStatus() == com.jobsite.jobsite.util.ApplicationStatus.SHORTLISTED)
                .count();
        long rejectedApplications = applications.stream()
                .filter(app -> app.getStatus() == com.jobsite.jobsite.util.ApplicationStatus.REJECTED)
                .count();
        long hiredApplications = applications.stream()
                .filter(app -> app.getStatus() == com.jobsite.jobsite.util.ApplicationStatus.HIRED)
                .count();

        return new JobSeekerStatistics(
                totalApplications, submittedApplications, reviewedApplications,
                shortlistedApplications, rejectedApplications, hiredApplications
        );
    }

    // ============ HELPER METHODS ============

    private JobDTO convertToDTO(Job job) {
        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setSalaryRange(job.getSalaryRange());
        dto.setStatus(job.getStatus());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setUpdatedAt(job.getUpdatedAt());
        
        // Include employer information (especially email for job seekers)
        if (job.getEmployer() != null) {
            dto.setEmployerId(job.getEmployer().getId());
            dto.setEmployerName(job.getEmployer().getCompanyName());
            // Make employer email visible to job seekers (required)
            dto.setEmployerEmail(job.getEmployer().getCompanyEmail());
        }
        
        return dto;
    }

    /**
     * Inner class for job seeker statistics
     */
    public static class JobSeekerStatistics {
        private final long totalApplications;
        private final long submittedApplications;
        private final long reviewedApplications;
        private final long shortlistedApplications;
        private final long rejectedApplications;
        private final long hiredApplications;

        public JobSeekerStatistics(long totalApplications, long submittedApplications,
                                   long reviewedApplications, long shortlistedApplications,
                                   long rejectedApplications, long hiredApplications) {
            this.totalApplications = totalApplications;
            this.submittedApplications = submittedApplications;
            this.reviewedApplications = reviewedApplications;
            this.shortlistedApplications = shortlistedApplications;
            this.rejectedApplications = rejectedApplications;
            this.hiredApplications = hiredApplications;
        }

        // Getters
        public long getTotalApplications() { return totalApplications; }
        public long getSubmittedApplications() { return submittedApplications; }
        public long getReviewedApplications() { return reviewedApplications; }
        public long getShortlistedApplications() { return shortlistedApplications; }
        public long getRejectedApplications() { return rejectedApplications; }
        public long getHiredApplications() { return hiredApplications; }
    }
}
