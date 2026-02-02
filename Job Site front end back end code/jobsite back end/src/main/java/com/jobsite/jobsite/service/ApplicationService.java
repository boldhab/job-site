package com.jobsite.jobsite.service;

import com.jobsite.jobsite.model.dto.ApplicationDTO;
import com.jobsite.jobsite.model.entity.Application;
import com.jobsite.jobsite.model.entity.CV;
import com.jobsite.jobsite.model.entity.Employer;
import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.model.entity.JobSeeker;
import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.repository.ApplicationRepository;
import com.jobsite.jobsite.repository.CVRepository;
import com.jobsite.jobsite.repository.EmployerRepository;
import com.jobsite.jobsite.repository.JobRepository;
import com.jobsite.jobsite.repository.JobSeekerRepository;
import com.jobsite.jobsite.util.ApplicationStatus;
import com.jobsite.jobsite.util.JobStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final CVRepository cvRepository;
    private final EmployerRepository employerRepository;
    private final UserService userService;

    /**
     * Submit a new job application
     */
    public ApplicationDTO submitApplication(ApplicationDTO applicationDTO) {
        User currentUser = userService.getCurrentUserOrThrow();
        
        // Validate user is a job seeker
        if (!currentUser.getRole().name().equals("JOB_SEEKER")) {
            throw new RuntimeException("Only job seekers can submit applications");
        }

        // Get job seeker
        JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));

        // Get job
        Job job = jobRepository.findById(applicationDTO.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + applicationDTO.getJobId()));

        // Validate job is active
        if (job.getStatus() != JobStatus.APPROVED) {
            throw new RuntimeException("Cannot apply to a job that is not approved");
        }

        // Check if already applied
        if (applicationRepository.existsByJobIdAndJobSeekerId(job.getId(), jobSeeker.getId())) {
            throw new RuntimeException("You have already applied to this job");
        }

        // Get CV if provided
        CV cv = null;
        if (applicationDTO.getCvId() != null) {
            cv = cvRepository.findById(applicationDTO.getCvId())
                    .orElseThrow(() -> new RuntimeException("CV not found with id: " + applicationDTO.getCvId()));
            
            // Validate CV belongs to the job seeker
            if (!cv.getJobSeeker().getId().equals(jobSeeker.getId())) {
                throw new RuntimeException("CV does not belong to you");
            }
        }

        // Create application
        Application application = new Application();
        application.setJob(job);
        application.setJobSeeker(jobSeeker);
        application.setCv(cv);
        application.setCoverLetter(applicationDTO.getCoverLetter());
        application.setStatus(ApplicationStatus.SUBMITTED);
        application.setAppliedAt(LocalDateTime.now());

        Application savedApplication = applicationRepository.save(application);
        return convertToDTO(savedApplication);
    }

    /**
     * Update application status (for employers)
     */
    public ApplicationDTO updateApplicationStatus(Long applicationId, ApplicationStatus newStatus) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        User currentUser = userService.getCurrentUserOrThrow();
        
        // Validate user is employer or admin
        if (!currentUser.getRole().name().equals("EMPLOYER") && !currentUser.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Only employers and admins can update application status");
        }

        // If employer, validate they own the job
        if (currentUser.getRole().name().equals("EMPLOYER")) {
            Employer employer = employerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Employer profile not found"));
            
            if (!application.getJob().getEmployer().getId().equals(employer.getId())) {
                throw new RuntimeException("You can only update applications for your own jobs");
            }
        }

        // Validate status transition
        validateStatusTransition(application.getStatus(), newStatus);

        application.setStatus(newStatus);
        Application updatedApplication = applicationRepository.save(application);
        return convertToDTO(updatedApplication);
    }

    /**
     * Update employer notes for an application
     */
    public ApplicationDTO updateEmployerNotes(Long applicationId, String notes) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        User currentUser = userService.getCurrentUserOrThrow();
        
        // Validate user is employer or admin
        if (!currentUser.getRole().name().equals("EMPLOYER") && !currentUser.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Only employers and admins can update application notes");
        }

        // If employer, validate they own the job
        if (currentUser.getRole().name().equals("EMPLOYER")) {
            Employer employer = employerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Employer profile not found"));
            
            if (!application.getJob().getEmployer().getId().equals(employer.getId())) {
                throw new RuntimeException("You can only update notes for applications to your own jobs");
            }
        }

        application.setEmployerNotes(notes);
        Application updatedApplication = applicationRepository.save(application);
        return convertToDTO(updatedApplication);
    }

    /**
     * Get all applications for current job seeker
     */
    public List<ApplicationDTO> getMyApplications() {
        User currentUser = userService.getCurrentUserOrThrow();
        
        if (!currentUser.getRole().name().equals("JOB_SEEKER")) {
            throw new RuntimeException("Only job seekers can view their applications");
        }

        JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));

        List<Application> applications = applicationRepository.findByJobSeekerId(jobSeeker.getId());
        return applications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all applications for a specific job (for employers)
     */
    public List<ApplicationDTO> getApplicationsByJob(Long jobId) {
        User currentUser = userService.getCurrentUserOrThrow();
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        // Validate employer owns the job or user is admin
        if (currentUser.getRole().name().equals("EMPLOYER")) {
            Employer employer = employerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Employer profile not found"));
            
            if (!job.getEmployer().getId().equals(employer.getId())) {
                throw new RuntimeException("You can only view applications for your own jobs");
            }
        } else if (!currentUser.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Only employers and admins can view job applications");
        }

        List<Application> applications = applicationRepository.findByJobId(jobId);
        return applications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all applications for current employer's jobs
     */
    public List<ApplicationDTO> getMyJobApplications() {
        User currentUser = userService.getCurrentUserOrThrow();
        
        if (!currentUser.getRole().name().equals("EMPLOYER")) {
            throw new RuntimeException("Only employers can view their job applications");
        }

        Employer employer = employerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Employer profile not found"));

        List<Application> applications = applicationRepository.findByJobEmployerId(employer.getId());
        return applications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get application by ID
     */
    public ApplicationDTO getApplicationById(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        User currentUser = userService.getCurrentUserOrThrow();
        
        // Validate access
        if (currentUser.getRole().name().equals("JOB_SEEKER")) {
            JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));
            
            if (!application.getJobSeeker().getId().equals(jobSeeker.getId())) {
                throw new RuntimeException("You can only view your own applications");
            }
        } else if (currentUser.getRole().name().equals("EMPLOYER")) {
            Employer employer = employerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Employer profile not found"));
            
            if (!application.getJob().getEmployer().getId().equals(employer.getId())) {
                throw new RuntimeException("You can only view applications for your own jobs");
            }
        }
        // Admin can view any application

        return convertToDTO(application);
    }

    /**
     * Get applications with pagination
     */
    public Page<ApplicationDTO> getApplications(Pageable pageable) {
        User currentUser = userService.getCurrentUserOrThrow();
        
        Page<Application> applications;
        
        if (currentUser.getRole().name().equals("JOB_SEEKER")) {
            JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));
            applications = applicationRepository.findByJobSeekerId(jobSeeker.getId(), pageable);
        } else if (currentUser.getRole().name().equals("EMPLOYER")) {
            Employer employer = employerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Employer profile not found"));
            applications = applicationRepository.findByJobEmployerId(employer.getId(), pageable);
        } else {
            // Admin can see all
            applications = applicationRepository.findAll(pageable);
        }

        return applications.map(this::convertToDTO);
    }

    /**
     * Get applications by status
     */
    public List<ApplicationDTO> getApplicationsByStatus(ApplicationStatus status) {
        User currentUser = userService.getCurrentUserOrThrow();
        
        List<Application> applications;
        
        if (currentUser.getRole().name().equals("JOB_SEEKER")) {
            JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));
            applications = applicationRepository.findByJobSeekerId(jobSeeker.getId())
                    .stream()
                    .filter(app -> app.getStatus() == status)
                    .collect(Collectors.toList());
        } else if (currentUser.getRole().name().equals("EMPLOYER")) {
            Employer employer = employerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Employer profile not found"));
            applications = applicationRepository.findByJobEmployerId(employer.getId())
                    .stream()
                    .filter(app -> app.getStatus() == status)
                    .collect(Collectors.toList());
        } else {
            // Admin
            applications = applicationRepository.findByStatus(status);
        }

        return applications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Delete application (only by job seeker who submitted it)
     */
    public void deleteApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        User currentUser = userService.getCurrentUserOrThrow();
        
        if (!currentUser.getRole().name().equals("JOB_SEEKER")) {
            throw new RuntimeException("Only job seekers can delete their applications");
        }

        JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));
        
        if (!application.getJobSeeker().getId().equals(jobSeeker.getId())) {
            throw new RuntimeException("You can only delete your own applications");
        }

        applicationRepository.delete(application);
    }

    // ============ HELPER METHODS ============

    private void validateStatusTransition(ApplicationStatus currentStatus, ApplicationStatus newStatus) {
        // Allow any status transition for now, but you can add validation logic here
        // For example, prevent going from REJECTED to HIRED
        if (currentStatus == ApplicationStatus.REJECTED && newStatus == ApplicationStatus.HIRED) {
            throw new RuntimeException("Cannot hire a rejected application");
        }
    }

    private ApplicationDTO convertToDTO(Application application) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(application.getId());
        dto.setJobId(application.getJob().getId());
        dto.setJobSeekerId(application.getJobSeeker().getId());
        dto.setCoverLetter(application.getCoverLetter());
        dto.setEmployerNotes(application.getEmployerNotes());
        dto.setStatus(application.getStatus());
        dto.setAppliedAt(application.getAppliedAt());
        
        if (application.getCv() != null) {
            dto.setCvId(application.getCv().getId());
        }

        // Add job details
        dto.setJobTitle(application.getJob().getTitle());
        dto.setEmployerName(application.getJob().getEmployer().getCompanyName());
        dto.setEmployerEmail(application.getJob().getEmployer().getCompanyEmail());

        // Add job seeker details
        dto.setJobSeekerName(application.getJobSeeker().getFullName());
        dto.setJobSeekerHeadline(application.getJobSeeker().getHeadline());
        dto.setJobSeekerPhone(application.getJobSeeker().getPhone());
        dto.setJobSeekerLocation(application.getJobSeeker().getLocation());
        dto.setJobSeekerExperience(application.getJobSeeker().getExperience());
        dto.setJobSeekerSkills(application.getJobSeeker().getSkills());

        if (application.getJobSeeker().getUser() != null) {
            dto.setJobSeekerEmail(application.getJobSeeker().getUser().getEmail());
        }

        return dto;
    }
}
