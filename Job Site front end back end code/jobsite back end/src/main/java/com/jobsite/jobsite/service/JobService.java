package com.jobsite.jobsite.service;

import com.jobsite.jobsite.model.dto.JobDTO;
import com.jobsite.jobsite.model.entity.Application;
import com.jobsite.jobsite.model.entity.Employer;
import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.model.entity.JobModerationLog;
import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.repository.ApplicationRepository;
import com.jobsite.jobsite.repository.EmployerRepository;
import com.jobsite.jobsite.repository.JobModerationLogRepository;
import com.jobsite.jobsite.repository.JobRepository;
import com.jobsite.jobsite.util.JobStatus;
import com.jobsite.jobsite.util.JobType;
import com.jobsite.jobsite.util.ModerationAction;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final EmployerRepository employerRepository;
    private final ApplicationRepository applicationRepository; // Added
    private final UserService userService;
    private final JobModerationLogRepository moderationLogRepository;

    /**
     * Get all active (approved) jobs for public viewing
     */
    public List<Job> getAllActiveJobs() {
        return jobRepository.findByStatus(JobStatus.APPROVED);
    }

    /**
     * Get all active (approved) jobs with pagination
     */
    public Page<Job> getAllActiveJobsPaged(Pageable pageable) {
        return jobRepository.findActiveJobs(pageable);
    }

    /**
     * Get job by ID with proper error handling
     */
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    /**
     * Create a new job (only for employers)
     */
    public Job createJob(Job jobRequest) {
        User currentUser = getCurrentAuthenticatedUser();
        Employer employer = getEmployerForUser(currentUser);

        validateEmployerApproval(employer);

        Job job = buildJobEntity(jobRequest, employer);
        return jobRepository.save(job);
    }

    /**
     * Update existing job (only job owner or admin)
     */
    public Job updateJob(Long id, Job jobRequest) {
        Job existingJob = getJobById(id);
        User currentUser = getCurrentAuthenticatedUser();

        validateJobOwnership(existingJob, currentUser);

        updateJobFields(existingJob, jobRequest, currentUser);
        existingJob.setUpdatedAt(LocalDateTime.now());

        return jobRepository.save(existingJob);
    }

    /**
     * Delete job (only job owner or admin)
     */
    public void deleteJob(Long id) {
        Job job = getJobById(id);
        User currentUser = getCurrentAuthenticatedUser();

        validateJobOwnershipForDeletion(job, currentUser);

        jobRepository.delete(job);
    }

    /**
     * Get jobs by employer
     */
    public List<Job> getJobsByEmployer(Long employerId) {
        return jobRepository.findByEmployerId(employerId);
    }

    /**
     * Get jobs by status (for admin)
     */
    public List<Job> getJobsByStatus(JobStatus status) {
        return jobRepository.findByStatus(status);
    }

    /**
     * Get jobs by status with pagination
     */
    public Page<Job> getJobsByStatus(JobStatus status, Pageable pageable) {
        return jobRepository.findByStatus(status, pageable);
    }

    /**
     * Search jobs by keyword in title or description
     */
    public List<Job> searchJobsByKeyword(String keyword) {
        return jobRepository.searchJobs(keyword);
    }

    /**
     * Search jobs by keyword with pagination
     */
    public Page<Job> searchJobsByKeyword(String keyword, Pageable pageable) {
        return jobRepository.searchJobs(keyword, pageable);
    }

    /**
     * Search jobs by location
     */
    public List<Job> searchJobsByLocation(String location) {
        return jobRepository.findByLocationContainingIgnoreCase(location);
    }

    /**
     * Search jobs by location with pagination
     */
    public Page<Job> searchJobsByLocation(String location, Pageable pageable) {
        return jobRepository.findByLocationContainingIgnoreCase(location, pageable);
    }

    /**
     * Search jobs by title
     */
    public List<Job> searchJobsByTitle(String title) {
        return jobRepository.findByTitleContainingIgnoreCase(title);
    }

    /**
     * Get jobs by type
     */
    public List<Job> getJobsByType(JobType jobType) {
        return jobRepository.findByJobType(jobType);
    }

    /**
     * Get jobs by type with pagination
     */
    public Page<Job> getJobsByType(JobType jobType, Pageable pageable) {
        return jobRepository.findByJobType(jobType, pageable);
    }

    /**
     * Get current employer's jobs
     */
    public List<Job> getMyJobs() {
        User currentUser = getCurrentAuthenticatedUser();
        Employer employer = getEmployerForUser(currentUser);
        return jobRepository.findByEmployerId(employer.getId());
    }

    /**
     * Get current employer's jobs by status
     */
    public List<Job> getMyJobsByStatus(JobStatus status) {
        User currentUser = getCurrentAuthenticatedUser();
        Employer employer = getEmployerForUser(currentUser);
        return jobRepository.findByEmployerIdAndStatus(employer.getId(), status);
    }

    /**
     * Approve job (admin only)
     */
    public Job approveJob(Long id) {
        Job job = getJobById(id);
        User currentUser = getCurrentAuthenticatedUser();

        job.setStatus(JobStatus.APPROVED);
        job.setUpdatedAt(LocalDateTime.now());
        Job savedJob = jobRepository.save(job);

        // Log moderation action
        createModerationLog(savedJob, currentUser, ModerationAction.APPROVED, "Job approved by admin");

        return savedJob;
    }

    /**
     * Reject job (admin only)
     */
    public Job rejectJob(Long id, String reason) {
        Job job = getJobById(id);
        User currentUser = getCurrentAuthenticatedUser();

        job.setStatus(JobStatus.REJECTED);
        job.setUpdatedAt(LocalDateTime.now());
        Job savedJob = jobRepository.save(job);

        // Log moderation action
        createModerationLog(savedJob, currentUser, ModerationAction.REJECTED,
                reason != null ? reason : "Job rejected by admin");

        return savedJob;
    }

    /**
     * Close job (employer only)
     */
    public Job closeJob(Long id) {
        Job job = getJobById(id);
        User currentUser = getCurrentAuthenticatedUser();

        validateJobOwnership(job, currentUser);

        job.setStatus(JobStatus.CLOSED);
        job.setUpdatedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }

    /**
     * Get job statistics
     */
    public JobStatistics getJobStatistics() {
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.APPROVED);
        long pendingJobs = jobRepository.countByStatus(JobStatus.PENDING);
        long closedJobs = jobRepository.countByStatus(JobStatus.CLOSED);
        long rejectedJobs = jobRepository.countByStatus(JobStatus.REJECTED);

        return new JobStatistics(totalJobs, activeJobs, pendingJobs, closedJobs, rejectedJobs);
    }

    // ============ HELPER METHODS ============

    private User getCurrentAuthenticatedUser() {
        return userService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));
    }

    private Employer getEmployerForUser(User user) {
        return employerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("User is not an employer"));
    }

    private void validateEmployerApproval(Employer employer) {
        if (!employer.getIsApproved()) {
            throw new RuntimeException("Employer account is not approved yet");
        }
    }

    private void validateJobOwnership(Job job, User user) {
        if (user.getRole().name().equals("EMPLOYER")) {
            Employer employer = getEmployerForUser(user);
            if (!job.getEmployer().getId().equals(employer.getId())) {
                throw new RuntimeException("You can only modify your own jobs");
            }
        }
    }

    private void validateJobOwnershipForDeletion(Job job, User user) {
        if (user.getRole().name().equals("EMPLOYER")) {
            Employer employer = getEmployerForUser(user);
            if (!job.getEmployer().getId().equals(employer.getId())) {
                throw new RuntimeException("You can only delete your own jobs");
            }
        }
        // Admin can delete any job
    }

    private Job buildJobEntity(Job jobRequest, Employer employer) {
        Job job = new Job();
        job.setEmployer(employer);
        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setLocation(jobRequest.getLocation());
        job.setJobType(jobRequest.getJobType() != null ? jobRequest.getJobType() : JobType.FULL_TIME);
        job.setSalaryRange(jobRequest.getSalaryRange());
        job.setStatus(JobStatus.PENDING);
        job.setDeadline(jobRequest.getDeadline());
        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());
        return job;
    }

    private void updateJobFields(Job existingJob, Job jobRequest, User currentUser) {
        if (jobRequest.getTitle() != null) {
            existingJob.setTitle(jobRequest.getTitle());
        }
        if (jobRequest.getDescription() != null) {
            existingJob.setDescription(jobRequest.getDescription());
        }
        if (jobRequest.getLocation() != null) {
            existingJob.setLocation(jobRequest.getLocation());
        }
        if (jobRequest.getJobType() != null) {
            existingJob.setJobType(jobRequest.getJobType());
        }
        if (jobRequest.getSalaryRange() != null) {
            existingJob.setSalaryRange(jobRequest.getSalaryRange());
        }
        if (jobRequest.getDeadline() != null) {
            existingJob.setDeadline(jobRequest.getDeadline());
        }

        // Status update logic
        if (jobRequest.getStatus() != null) {
            if (currentUser.getRole().name().equals("ADMIN")) {
                // Admin can change to any status
                existingJob.setStatus(jobRequest.getStatus());
            } else if (currentUser.getRole().name().equals("EMPLOYER") &&
                    jobRequest.getStatus() == JobStatus.CLOSED) {
                // Employer can only close their own jobs
                existingJob.setStatus(JobStatus.CLOSED);
            }
        }
    }

    /**
     * Inner class for job statistics
     */
    public static class JobStatistics {
        private final long totalJobs;
        private final long activeJobs;
        private final long pendingJobs;
        private final long closedJobs;
        private final long rejectedJobs;

        public JobStatistics(long totalJobs, long activeJobs, long pendingJobs,
                long closedJobs, long rejectedJobs) {
            this.totalJobs = totalJobs;
            this.activeJobs = activeJobs;
            this.pendingJobs = pendingJobs;
            this.closedJobs = closedJobs;
            this.rejectedJobs = rejectedJobs;
        }

        // Getters
        public long getTotalJobs() {
            return totalJobs;
        }

        public long getActiveJobs() {
            return activeJobs;
        }

        public long getPendingJobs() {
            return pendingJobs;
        }

        public long getClosedJobs() {
            return closedJobs;
        }

        public long getRejectedJobs() {
            return rejectedJobs;
        }
    }

    /**
     * Convert Job entity to JobDTO
     */
    public JobDTO convertToDTO(Job job) {
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
        dto.setDeadline(job.getDeadline());

        if (job.getEmployer() != null) {
            dto.setEmployerId(job.getEmployer().getId());
            dto.setEmployerName(job.getEmployer().getCompanyName());
            dto.setEmployerEmail(job.getEmployer().getCompanyEmail());
        }

        // Populate applicant count from repository
        dto.setApplicantCount((int) applicationRepository.countByJobId(job.getId()));

        return dto;
    }

    /**
     * Create moderation log entry
     */
    private void createModerationLog(Job job, User admin, ModerationAction action, String reason) {
        JobModerationLog log = new JobModerationLog();
        log.setJob(job);
        log.setAdmin(admin);
        log.setAction(action);
        log.setReason(reason);
        log.setCreatedAt(LocalDateTime.now());
        moderationLogRepository.save(log);
    }
}