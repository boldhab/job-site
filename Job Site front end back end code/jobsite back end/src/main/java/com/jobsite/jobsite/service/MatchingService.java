package com.jobsite.jobsite.service;

import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.model.entity.JobSeeker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    /**
     * Calculate match score between a job seeker and a job
     * Score is from 0 to 100
     */
    public int calculateMatchScore(JobSeeker seeker, Job job) {
        if (seeker.getSkills() == null || seeker.getSkills().isEmpty()) return 0;
        
        String seekerSkillsStr = seeker.getSkills().toLowerCase();
        String jobRequirementsStr = (job.getDescription() + " " + (job.getTitle() != null ? job.getTitle() : "")).toLowerCase();
        
        List<String> seekerSkills = Arrays.stream(seekerSkillsStr.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        
        if (seekerSkills.isEmpty()) return 0;
        
        long matches = seekerSkills.stream()
                .filter(jobRequirementsStr::contains)
                .count();
        
        // Simple scoring logic: (matching skills / total skills) * 100
        // We can make it smarter by giving more weight to title matches or specific keywords
        double score = (double) matches / seekerSkills.size() * 100;
        
        // Ensure score is between 10 and 95 if there are some matches to look realistic
        if (matches > 0) {
            return (int) Math.min(95, Math.max(30, score + 20));
        }
        
        return (int) score;
    }

    /**
     * Rank a list of job seekers for a specific job
     */
    public List<Map<String, Object>> rankApplicants(Job job, List<JobSeeker> applicants) {
        return applicants.stream()
                .map(seeker -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("jobSeekerId", seeker.getId());
                    result.put("fullName", seeker.getFullName());
                    result.put("matchScore", calculateMatchScore(seeker, job));
                    result.put("skills", seeker.getSkills());
                    return result;
                })
                .sorted((a, b) -> (Integer) b.get("matchScore") - (Integer) a.get("matchScore"))
                .collect(Collectors.toList());
    }
}
