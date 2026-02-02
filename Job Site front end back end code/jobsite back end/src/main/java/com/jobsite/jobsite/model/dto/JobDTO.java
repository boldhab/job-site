package com.jobsite.jobsite.model.dto;

import com.jobsite.jobsite.util.JobStatus;
import com.jobsite.jobsite.util.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class JobDTO {

    private Long id;

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    private String salaryRange;

    private JobStatus status;

    private Long employerId; // Useful for admin/employer endpoints

    private String employerName; // Optional: display on job listing
    
    private String employerEmail; // Required: visible to job seekers for contact

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deadline;
    private Integer applicantCount;

    // Constructors
    public JobDTO() {}

    public JobDTO(Long id, String title, String description, String location,
                  JobType jobType, String salaryRange, JobStatus status,
                  Long employerId, String employerName,
                  LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.jobType = jobType;
        this.salaryRange = salaryRange;
        this.status = status;
        this.employerId = employerId;
        this.employerName = employerName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public Long getEmployerId() { return employerId; }
    public void setEmployerId(Long employerId) { this.employerId = employerId; }

    public String getEmployerName() { return employerName; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }

    public String getEmployerEmail() { return employerEmail; }
    public void setEmployerEmail(String employerEmail) { this.employerEmail = employerEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public Integer getApplicantCount() { return applicantCount; }
    public void setApplicantCount(Integer applicantCount) { this.applicantCount = applicantCount; }
}
