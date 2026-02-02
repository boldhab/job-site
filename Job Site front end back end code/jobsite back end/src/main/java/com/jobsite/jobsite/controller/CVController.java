package com.jobsite.jobsite.controller;

import com.jobsite.jobsite.model.dto.CVDTO;
import com.jobsite.jobsite.model.entity.CV;
import com.jobsite.jobsite.service.CVService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/cvs")
@RequiredArgsConstructor
public class CVController {

    private final CVService cvService;

    /**
     * Upload CV file
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<CV> uploadCV(@RequestParam("file") MultipartFile file) {
        CV cv = cvService.uploadCV(file);
        return ResponseEntity.ok(cv);
    }

    /**
     * Build CV from text data
     */
    @PostMapping("/build")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<CV> buildCV(@Valid @RequestBody CVDTO cvDTO) {
        CV cv = cvService.buildCV(cvDTO);
        return ResponseEntity.ok(cv);
    }

    /**
     * Get all CVs for current job seeker
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
    public ResponseEntity<List<CV>> getMyCVs() {
        List<CV> cvs = cvService.getMyCVs();
        return ResponseEntity.ok(cvs);
    }

    /**
     * Get CV by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CV> getCVById(@PathVariable Long id) {
        CV cv = cvService.getCVById(id);
        return ResponseEntity.ok(cv);
    }

    /**
     * Get latest CV for current job seeker
     */
    @GetMapping("/latest")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
    public ResponseEntity<CV> getLatestCV() {
        CV cv = cvService.getLatestCV();
        return ResponseEntity.ok(cv);
    }

    /**
     * Download CV file
     */
    @GetMapping("/{id}/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> downloadCV(@PathVariable Long id) {
        Resource resource = cvService.downloadCV(id);
        CV cv = cvService.getCVById(id);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(cv.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + cv.getFileName() + "\"")
                .body(resource);
    }

    /**
     * Delete CV
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
    public ResponseEntity<Void> deleteCV(@PathVariable Long id) {
        cvService.deleteCV(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Set CV as default
     */
    @PutMapping("/{id}/default")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
    public ResponseEntity<CV> setDefaultCV(@PathVariable Long id) {
        return ResponseEntity.ok(cvService.setDefaultCV(id));
    }

    /**
     * Update CV metadata
     */
    @PutMapping("/{id}/metadata")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<CV> updateMetadata(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request) {
        String title = request.get("title");
        String description = request.get("description");
        return ResponseEntity.ok(cvService.updateMetadata(id, title, description));
    }
}
