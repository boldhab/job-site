package com.jobsite.jobsite.controller;

import com.jobsite.jobsite.model.entity.Employer;
import com.jobsite.jobsite.model.entity.JobSeeker;
import com.jobsite.jobsite.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * Get complete profile based on user role
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(profileService.getCompleteProfile());
    }

    /**
     * Update job seeker profile
     */
    @PutMapping("/job-seeker")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<JobSeeker> updateJobSeekerProfile(@RequestBody JobSeeker profile) {
        return ResponseEntity.ok(profileService.updateJobSeekerProfile(profile));
    }

    /**
     * Update employer profile
     */
    @PutMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Employer> updateEmployerProfile(@RequestBody Employer profile) {
        return ResponseEntity.ok(profileService.updateEmployerProfile(profile));
    }

    /**
     * Get job seeker profile specifically
     */
    @GetMapping("/job-seeker")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<JobSeeker> getJobSeekerProfile() {
        return ResponseEntity.ok(profileService.getJobSeekerProfile());
    }

    /**
     * Get employer profile specifically
     */
    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Employer> getEmployerProfile() {
        return ResponseEntity.ok(profileService.getEmployerProfile());
    }
}