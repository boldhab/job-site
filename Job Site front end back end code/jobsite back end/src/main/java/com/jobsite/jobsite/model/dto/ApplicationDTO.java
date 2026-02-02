package com.jobsite.jobsite.model.dto;

import com.jobsite.jobsite.util.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class ApplicationDTO {
    
    private Long id;
    
    @NotNull(message = "Job ID is required")
    private Long jobId;
    
    private Long cvId;
    
    private Long jobSeekerId;
    
    private ApplicationStatus status;
    
    private String coverLetter;
    
    private String employerNotes;
    
    private LocalDateTime appliedAt;
    
    // Job details (for response)
    private String jobTitle;
    private String employerName;
    private String employerEmail;
    
    // Job Seeker details (for employer view)
    private String jobSeekerName;
    private String jobSeekerEmail;
    private String jobSeekerHeadline;
    private String jobSeekerPhone;
    private String jobSeekerLocation;
    private String jobSeekerExperience;
    private String jobSeekerSkills;

    public ApplicationDTO() {
    }

    public ApplicationDTO(Long id, Long jobId, Long cvId, Long jobSeekerId, 
                         ApplicationStatus status, LocalDateTime appliedAt) {
        this.id = id;
        this.jobId = jobId;
        this.cvId = cvId;
        this.jobSeekerId = jobSeekerId;
        this.status = status;
        this.appliedAt = appliedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Long getCvId() {
        return cvId;
    }

    public void setCvId(Long cvId) {
        this.cvId = cvId;
    }

    public Long getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(Long jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getEmployerNotes() {
        return employerNotes;
    }

    public void setEmployerNotes(String employerNotes) {
        this.employerNotes = employerNotes;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getEmployerName() {
        return employerName;
    }

    public void setEmployerName(String employerName) {
        this.employerName = employerName;
    }

    public String getEmployerEmail() {
        return employerEmail;
    }

    public void setEmployerEmail(String employerEmail) {
        this.employerEmail = employerEmail;
    }

    public String getJobSeekerName() {
        return jobSeekerName;
    }

    public void setJobSeekerName(String jobSeekerName) {
        this.jobSeekerName = jobSeekerName;
    }

    public String getJobSeekerEmail() {
        return jobSeekerEmail;
    }

    public void setJobSeekerEmail(String jobSeekerEmail) {
        this.jobSeekerEmail = jobSeekerEmail;
    }

    public String getJobSeekerHeadline() {
        return jobSeekerHeadline;
    }

    public void setJobSeekerHeadline(String jobSeekerHeadline) {
        this.jobSeekerHeadline = jobSeekerHeadline;
    }

    public String getJobSeekerPhone() {
        return jobSeekerPhone;
    }

    public void setJobSeekerPhone(String jobSeekerPhone) {
        this.jobSeekerPhone = jobSeekerPhone;
    }

    public String getJobSeekerLocation() {
        return jobSeekerLocation;
    }

    public void setJobSeekerLocation(String jobSeekerLocation) {
        this.jobSeekerLocation = jobSeekerLocation;
    }

    public String getJobSeekerExperience() {
        return jobSeekerExperience;
    }

    public void setJobSeekerExperience(String jobSeekerExperience) {
        this.jobSeekerExperience = jobSeekerExperience;
    }

    public String getJobSeekerSkills() {
        return jobSeekerSkills;
    }

    public void setJobSeekerSkills(String jobSeekerSkills) {
        this.jobSeekerSkills = jobSeekerSkills;
    }
}
