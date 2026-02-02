package com.jobsite.jobsite.controller;

import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.model.entity.JobSeeker;
import com.jobsite.jobsite.service.GeminiService;
import com.jobsite.jobsite.service.JobService;
import com.jobsite.jobsite.service.JobSeekerService;
import com.jobsite.jobsite.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AIController {

    private final GeminiService geminiService;
    private final MatchingService matchingService;
    private final JobService jobService;
    private final JobSeekerService jobSeekerService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String response = geminiService.getChatbotResponse(message);
        
        Map<String, String> result = new HashMap<>();
        result.put("response", response);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/optimize-job")
    public ResponseEntity<Map<String, String>> optimizeJob(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String industry = request.get("industry");
        String response = geminiService.generateJobDescription(title, industry);
        
        Map<String, String> result = new HashMap<>();
        result.put("suggestion", response);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/analyze-my-cv")
    public ResponseEntity<Map<String, String>> analyzeCV() {
        // In a real app, we'd get the current user's profile
        // For now, let's assume we have a way to get the current job seeker
        // jobSeekerService.getCurrentJobSeeker() ...
        
        // Mocking for now to demonstrate the flow
        String mockCV = "Experienced Java Developer with 5 years in Spring Boot and MySQL. Looking for Remote roles.";
        String response = geminiService.analyzeCV(mockCV);
        
        Map<String, String> result = new HashMap<>();
        result.put("feedback", response);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/match-score/{jobId}")
    public ResponseEntity<Map<String, Object>> getMatchScore(@PathVariable Long jobId) {
        Job job = jobService.getJobById(jobId);
        // Mock current user as a job seeker for demo
        JobSeeker seeker = new JobSeeker();
        seeker.setSkills("Java, Spring Boot, React, MySQL");
        
        int score = matchingService.calculateMatchScore(seeker, job);
        
        Map<String, Object> result = new HashMap<>();
        result.put("jobId", jobId);
        result.put("matchScore", score);
        result.put("matchLevel", score > 80 ? "HIGH" : score > 50 ? "MEDIUM" : "LOW");
        return ResponseEntity.ok(result);
    }
}
