package com.jobsite.jobsite.service;

import com.jobsite.jobsite.model.dto.CVDTO;
import com.jobsite.jobsite.model.entity.CV;
import com.jobsite.jobsite.model.entity.JobSeeker;
import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.repository.CVRepository;
import com.jobsite.jobsite.repository.JobSeekerRepository;
import com.jobsite.jobsite.util.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CVService {

    private final CVRepository cvRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final UserService userService;
    
    private final Path uploadPath = Paths.get(Constants.UPLOAD_DIR);

    /**
     * Initialize upload directory
     */
    public void init() {
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload directory", e);
        }
    }

    /**
     * Upload CV file
     */
    public CV uploadCV(MultipartFile file) {
        User currentUser = userService.getCurrentUserOrThrow();
        
        if (!currentUser.getRole().name().equals("JOB_SEEKER")) {
            throw new RuntimeException("Only job seekers can upload CVs");
        }

        // Validate file
        validateFile(file);

        JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));

        try {
            // Initialize directory if needed
            init();

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + "." + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create CV entity
            CV cv = new CV();
            cv.setJobSeeker(jobSeeker);
            cv.setFileName(originalFilename);
            cv.setFileType(file.getContentType());
            cv.setFileSize(file.getSize());
            cv.setFileUrl(filePath.toString());
            cv.setCreatedAt(LocalDateTime.now());
            
            // Set as default if it's the first CV
            List<CV> existingCVs = cvRepository.findByJobSeekerId(jobSeeker.getId());
            if (existingCVs.isEmpty()) {
                cv.setDefault(true);
            }

            return cvRepository.save(cv);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    /**
     * Build CV from CVDTO (text-based CV)
     */
    public CV buildCV(CVDTO cvDTO) {
        User currentUser = userService.getCurrentUserOrThrow();
        
        if (!currentUser.getRole().name().equals("JOB_SEEKER")) {
            throw new RuntimeException("Only job seekers can build CVs");
        }

        JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));

        // For now, we'll store the CV data as a text file
        // In a real application, you might want to store this in a separate table or as JSON
        try {
            init();
            
            // Create a text representation of the CV
            String cvContent = buildCVContent(cvDTO);
            String uniqueFilename = UUID.randomUUID().toString() + ".txt";
            Path filePath = uploadPath.resolve(uniqueFilename);
            
            Files.write(filePath, cvContent.getBytes());

            CV cv = new CV();
            cv.setJobSeeker(jobSeeker);
            cv.setFileName("cv_" + jobSeeker.getFullName() + ".txt");
            cv.setFileType("text/plain");
            cv.setFileSize((long) cvContent.length());
            cv.setFileUrl(filePath.toString());
            cv.setCreatedAt(LocalDateTime.now());

            return cvRepository.save(cv);
        } catch (IOException e) {
            throw new RuntimeException("Failed to build CV: " + e.getMessage(), e);
        }
    }

    /**
     * Download CV file
     */
    public Resource downloadCV(Long cvId) {
        CV cv = cvRepository.findById(cvId)
                .orElseThrow(() -> new RuntimeException("CV not found with id: " + cvId));

        User currentUser = userService.getCurrentUserOrThrow();
        
        // Validate access: job seeker can download their own CV, employer/admin can download any
        if (currentUser.getRole().name().equals("JOB_SEEKER")) {
            JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));
            
            if (!cv.getJobSeeker().getId().equals(jobSeeker.getId())) {
                throw new RuntimeException("You can only download your own CVs");
            }
        }

        try {
            Path filePath = Paths.get(cv.getFileUrl());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to download file: " + e.getMessage(), e);
        }
    }

    /**
     * Get all CVs for current job seeker
     */
    public List<CV> getMyCVs() {
        User currentUser = userService.getCurrentUserOrThrow();
        
        if (!currentUser.getRole().name().equals("JOB_SEEKER")) {
            throw new RuntimeException("Only job seekers can view their CVs");
        }

        JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));

        return cvRepository.findByJobSeekerId(jobSeeker.getId());
    }

    /**
     * Get CV by ID
     */
    public CV getCVById(Long cvId) {
        CV cv = cvRepository.findById(cvId)
                .orElseThrow(() -> new RuntimeException("CV not found with id: " + cvId));

        User currentUser = userService.getCurrentUserOrThrow();
        
        // Validate access
        if (currentUser.getRole().name().equals("JOB_SEEKER")) {
            JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));
            
            if (!cv.getJobSeeker().getId().equals(jobSeeker.getId())) {
                throw new RuntimeException("You can only view your own CVs");
            }
        }
        // Employer/Admin can view any CV (when viewing applications)

        return cv;
    }

    /**
     * Get latest CV for current job seeker
     */
    public CV getLatestCV() {
        User currentUser = userService.getCurrentUserOrThrow();
        
        if (!currentUser.getRole().name().equals("JOB_SEEKER")) {
            throw new RuntimeException("Only job seekers can view their CVs");
        }

        JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));

        return cvRepository.findFirstByJobSeekerIdOrderByCreatedAtDesc(jobSeeker.getId())
                .orElseThrow(() -> new RuntimeException("No CV found"));
    }

    /**
     * Delete CV
     */
    public void deleteCV(Long cvId) {
        CV cv = cvRepository.findById(cvId)
                .orElseThrow(() -> new RuntimeException("CV not found with id: " + cvId));

        User currentUser = userService.getCurrentUserOrThrow();
        
        if (!currentUser.getRole().name().equals("JOB_SEEKER")) {
            throw new RuntimeException("Only job seekers can delete their CVs");
        }

        JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));
        
        if (!cv.getJobSeeker().getId().equals(jobSeeker.getId())) {
            throw new RuntimeException("You can only delete your own CVs");
        }

        // Delete file from filesystem
        try {
            Path filePath = Paths.get(cv.getFileUrl());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error but continue with database deletion
            System.err.println("Failed to delete file: " + e.getMessage());
        }

        cvRepository.delete(cv);
    }

    /**
     * Set a CV as default for the current job seeker
     */
    public CV setDefaultCV(Long cvId) {
        User currentUser = userService.getCurrentUserOrThrow();
        JobSeeker jobSeeker = jobSeekerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Job seeker profile not found"));

        CV cvToSetDefault = cvRepository.findById(cvId)
                .orElseThrow(() -> new RuntimeException("CV not found with id: " + cvId));

        if (!cvToSetDefault.getJobSeeker().getId().equals(jobSeeker.getId())) {
            throw new RuntimeException("You can only set your own CV as default");
        }

        // Unset any existing default CV
        List<CV> myCVs = cvRepository.findByJobSeekerId(jobSeeker.getId());
        for (CV cv : myCVs) {
            cv.setDefault(cv.getId().equals(cvId));
        }
        cvRepository.saveAll(myCVs);

        return cvToSetDefault;
    }

    /**
     * Update CV metadata (title, description)
     */
    public CV updateMetadata(Long cvId, String title, String description) {
        CV cv = getCVById(cvId);
        
        if (title != null) cv.setTitle(title);
        if (description != null) cv.setDescription(description);
        
        return cvRepository.save(cv);
    }

    // ============ HELPER METHODS ============

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > Constants.MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum allowed size of " + 
                    (Constants.MAX_FILE_SIZE / (1024 * 1024)) + "MB");
        }

        String fileExtension = getFileExtension(file.getOriginalFilename());
        boolean isAllowed = false;
        for (String allowedType : Constants.ALLOWED_FILE_TYPES) {
            if (allowedType.equalsIgnoreCase(fileExtension)) {
                isAllowed = true;
                break;
            }
        }

        if (!isAllowed) {
            throw new RuntimeException("File type not allowed. Allowed types: " + 
                    String.join(", ", Constants.ALLOWED_FILE_TYPES));
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    private String buildCVContent(CVDTO cvDTO) {
        StringBuilder content = new StringBuilder();
        content.append("CV\n");
        content.append("===\n\n");
        content.append("Full Name: ").append(cvDTO.getFullName()).append("\n");
        content.append("Email: ").append(cvDTO.getEmail()).append("\n");
        content.append("Phone: ").append(cvDTO.getPhoneNumber()).append("\n\n");
        content.append("Education:\n").append(cvDTO.getEducation()).append("\n\n");
        content.append("Experience:\n").append(cvDTO.getExperience()).append("\n\n");
        content.append("Skills:\n").append(cvDTO.getSkills()).append("\n");
        return content.toString();
    }
}
