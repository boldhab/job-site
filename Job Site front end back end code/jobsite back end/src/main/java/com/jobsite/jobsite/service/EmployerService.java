package com.jobsite.jobsite.service;

import com.jobsite.jobsite.model.dto.ApplicationDTO;
import com.jobsite.jobsite.model.entity.Employer;
import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.repository.EmployerRepository;
import com.jobsite.jobsite.util.JobStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployerService {

    private final EmployerRepository employerRepository;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final UserService userService;

    /**
     * Get current employer profile
     */
    public Employer getCurrentEmployer() {
        User currentUser = userService.getCurrentUserOrThrow();
        
        if (!currentUser.getRole().name().equals("EMPLOYER")) {
            throw new RuntimeException("User is not an employer");
        }

        return employerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Employer profile not found"));
    }

    /**
     * Update current employer profile
     */
    public Employer updateProfile(Employer employerRequest) {
        Employer employer = getCurrentEmployer();
        
        if (employerRequest.getCompanyName() != null) employer.setCompanyName(employerRequest.getCompanyName());
        if (employerRequest.getCompanyEmail() != null) employer.setCompanyEmail(employerRequest.getCompanyEmail());
        if (employerRequest.getWebsite() != null) employer.setWebsite(employerRequest.getWebsite());
        if (employerRequest.getLocation() != null) employer.setLocation(employerRequest.getLocation());
        if (employerRequest.getAbout() != null) employer.setAbout(employerRequest.getAbout());
        if (employerRequest.getIndustry() != null) employer.setIndustry(employerRequest.getIndustry());
        if (employerRequest.getCompanySize() != null) employer.setCompanySize(employerRequest.getCompanySize());
        if (employerRequest.getFounded() != null) employer.setFounded(employerRequest.getFounded());
        if (employerRequest.getLogo() != null) employer.setLogo(employerRequest.getLogo());

        return employerRepository.save(employer);
    }

    /**
     * Get all jobs for current employer
     */
    public List<Job> getMyJobs() {
        Employer employer = getCurrentEmployer();
        return jobService.getJobsByEmployer(employer.getId());
    }

    /**
     * Get jobs by status for current employer
     */
    public List<Job> getMyJobsByStatus(JobStatus status) {
        Employer employer = getCurrentEmployer();
        return jobService.getMyJobsByStatus(status);
    }

    /**
     * Get all applications for current employer's jobs
     */
    public List<ApplicationDTO> getMyJobApplications() {
        return applicationService.getMyJobApplications();
    }

    /**
     * Get applications for a specific job
     */
    public List<ApplicationDTO> getApplicationsForJob(Long jobId) {
        // ApplicationService already validates ownership
        return applicationService.getApplicationsByJob(jobId);
    }

    /**
     * Update application status
     */
    public ApplicationDTO updateApplicationStatus(Long applicationId, com.jobsite.jobsite.util.ApplicationStatus newStatus) {
        return applicationService.updateApplicationStatus(applicationId, newStatus);
    }

    /**
     * Get employer statistics
     */
    public EmployerStatistics getStatistics() {
        Employer employer = getCurrentEmployer();
        
        List<Job> allJobs = jobService.getJobsByEmployer(employer.getId());
        long totalJobs = allJobs.size();
        long activeJobs = allJobs.stream()
                .filter(job -> job.getStatus() == JobStatus.APPROVED)
                .count();
        long pendingJobs = allJobs.stream()
                .filter(job -> job.getStatus() == JobStatus.PENDING)
                .count();
        long closedJobs = allJobs.stream()
                .filter(job -> job.getStatus() == JobStatus.CLOSED)
                .count();

        List<ApplicationDTO> applications = getMyJobApplications();
        long totalApplications = applications.size();
        long pendingApplications = applications.stream()
                .filter(app -> app.getStatus() == com.jobsite.jobsite.util.ApplicationStatus.SUBMITTED)
                .count();
        long reviewedApplications = applications.stream()
                .filter(app -> app.getStatus() == com.jobsite.jobsite.util.ApplicationStatus.REVIEWED)
                .count();
        long shortlistedApplications = applications.stream()
                .filter(app -> app.getStatus() == com.jobsite.jobsite.util.ApplicationStatus.SHORTLISTED)
                .count();
        long hiredApplications = applications.stream()
                .filter(app -> app.getStatus() == com.jobsite.jobsite.util.ApplicationStatus.HIRED)
                .count();

        return new EmployerStatistics(
                totalJobs, activeJobs, pendingJobs, closedJobs,
                totalApplications, pendingApplications, reviewedApplications,
                shortlistedApplications, hiredApplications
        );
    }

    /**
     * Check if employer is approved
     */
    public boolean isApproved() {
        Employer employer = getCurrentEmployer();
        return employer.getIsApproved();
    }

    /**
     * Inner class for employer statistics
     */
    public static class EmployerStatistics {
        private final long totalJobs;
        private final long activeJobs;
        private final long pendingJobs;
        private final long closedJobs;
        private final long totalApplications;
        private final long pendingApplications;
        private final long reviewedApplications;
        private final long shortlistedApplications;
        private final long hiredApplications;

        public EmployerStatistics(long totalJobs, long activeJobs, long pendingJobs, long closedJobs,
                                 long totalApplications, long pendingApplications, long reviewedApplications,
                                 long shortlistedApplications, long hiredApplications) {
            this.totalJobs = totalJobs;
            this.activeJobs = activeJobs;
            this.pendingJobs = pendingJobs;
            this.closedJobs = closedJobs;
            this.totalApplications = totalApplications;
            this.pendingApplications = pendingApplications;
            this.reviewedApplications = reviewedApplications;
            this.shortlistedApplications = shortlistedApplications;
            this.hiredApplications = hiredApplications;
        }

        // Getters
        public long getTotalJobs() { return totalJobs; }
        public long getActiveJobs() { return activeJobs; }
        public long getPendingJobs() { return pendingJobs; }
        public long getClosedJobs() { return closedJobs; }
        public long getTotalApplications() { return totalApplications; }
        public long getPendingApplications() { return pendingApplications; }
        public long getReviewedApplications() { return reviewedApplications; }
        public long getShortlistedApplications() { return shortlistedApplications; }
        public long getHiredApplications() { return hiredApplications; }
    }
}
