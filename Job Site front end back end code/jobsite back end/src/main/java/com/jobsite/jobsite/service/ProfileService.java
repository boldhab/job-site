package com.jobsite.jobsite.service;

import com.jobsite.jobsite.model.entity.Employer;
import com.jobsite.jobsite.model.entity.JobSeeker;
import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.repository.EmployerRepository;
import com.jobsite.jobsite.repository.JobSeekerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserService userService;
    private final JobSeekerRepository jobSeekerRepository;
    private final EmployerRepository employerRepository;

    /**
     * Get complete profile information for current user
     */
    public Object getCompleteProfile() {
        User user = userService.getCurrentUserOrThrow();

        return switch (user.getRole()) {
            case JOB_SEEKER -> getJobSeekerProfile(user);
            case EMPLOYER -> getEmployerProfile(user);
            case ADMIN -> getAdminProfile(user);
        };
    }

    /**
     * Get job seeker profile for current user
     */
    public JobSeeker getJobSeekerProfile() {
        return getJobSeekerProfile(userService.getCurrentUserOrThrow());
    }

    /**
     * Get job seeker profile
     */
    public JobSeeker getJobSeekerProfile(User user) {
        return jobSeekerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));
    }

    /**
     * Get employer profile for current user
     */
    public Employer getEmployerProfile() {
        return getEmployerProfile(userService.getCurrentUserOrThrow());
    }

    /**
     * Get employer profile
     */
    public Employer getEmployerProfile(User user) {
        return employerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employer profile not found"));
    }

    /**
     * Update job seeker profile
     */
    public JobSeeker updateJobSeekerProfile(JobSeeker profileDetails) {
        User user = userService.getCurrentUserOrThrow();

        if (!user.getRole().equals(com.jobsite.jobsite.util.Role.JOB_SEEKER)) {
            throw new RuntimeException("User is not a job seeker");
        }

        JobSeeker existingProfile = getJobSeekerProfile(user);

        // Update fields
        if (profileDetails.getFullName() != null) {
            existingProfile.setFullName(profileDetails.getFullName());
        }
        if (profileDetails.getPhone() != null) {
            existingProfile.setPhone(profileDetails.getPhone());
        }
        if (profileDetails.getLocation() != null) {
            existingProfile.setLocation(profileDetails.getLocation());
        }
        if (profileDetails.getBio() != null) {
            existingProfile.setBio(profileDetails.getBio());
        }
        if (profileDetails.getHeadline() != null) {
            existingProfile.setHeadline(profileDetails.getHeadline());
        }
        if (profileDetails.getSkills() != null) {
            existingProfile.setSkills(profileDetails.getSkills());
        }
        if (profileDetails.getExperience() != null) {
            existingProfile.setExperience(profileDetails.getExperience());
        }
        if (profileDetails.getEducation() != null) {
            existingProfile.setEducation(profileDetails.getEducation());
        }
        if (profileDetails.getProfilePhotoUrl() != null) {
            existingProfile.setProfilePhotoUrl(profileDetails.getProfilePhotoUrl());
        }
        if (profileDetails.getProfileVisibility() != null) {
            existingProfile.setProfileVisibility(profileDetails.getProfileVisibility());
        }

        return jobSeekerRepository.save(existingProfile);
    }

    /**
     * Update employer profile
     */
    public Employer updateEmployerProfile(Employer profileDetails) {
        User user = userService.getCurrentUserOrThrow();

        if (!user.getRole().equals(com.jobsite.jobsite.util.Role.EMPLOYER)) {
            throw new RuntimeException("User is not an employer");
        }

        Employer existingProfile = getEmployerProfile(user);

        // Update fields
        if (profileDetails.getCompanyName() != null) {
            existingProfile.setCompanyName(profileDetails.getCompanyName());
        }
        if (profileDetails.getCompanyEmail() != null) {
            existingProfile.setCompanyEmail(profileDetails.getCompanyEmail());
        }
        if (profileDetails.getDescription() != null) {
            existingProfile.setDescription(profileDetails.getDescription());
        }
        if (profileDetails.getWebsite() != null) {
            existingProfile.setWebsite(profileDetails.getWebsite());
        }

        return employerRepository.save(existingProfile);
    }

    /**
     * Get admin profile (just basic user info)
     */
    private Object getAdminProfile(User user) {
        // For admin, just return user info
        return user;
    }
}
