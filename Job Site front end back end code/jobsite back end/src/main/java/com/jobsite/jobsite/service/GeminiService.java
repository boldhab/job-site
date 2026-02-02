package com.jobsite.jobsite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=";

    private final RestTemplate restTemplate = new RestTemplate();

    public String getGeminiResponse(String prompt) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "AI Assistance is currently in preview mode. (Please configure GEMINI_API_KEY to enable full AI features). \n\nPlaceholder Response: Based on your input, I recommend highlighting your Java and Spring Boot experience to better match the Senior Developer role.";
        }

        try {
            String url = GEMINI_API_URL + apiKey;

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", Collections.singletonList(part));
            requestBody.put("contents", Collections.singletonList(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List candidates = (List) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map contentResponse = (Map) firstCandidate.get("content");
                    List parts = (List) contentResponse.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return (String) ((Map) parts.get(0)).get("text");
                    }
                }
            }
            return "I'm sorry, I couldn't process that request right now.";
        } catch (Exception e) {
            return "Error calling Gemini AI: " + e.getMessage();
        }
    }

    public String generateJobDescription(String title, String industry) {
        String prompt = "Generate a professional and detailed job description for a '" + title + "' role in the '" + industry + "' industry. " +
                "Include sections for Responsibilities, Requirements (skills/experience), and Benefits. Format it in a clear way.";
        return getGeminiResponse(prompt);
    }

    public String analyzeCV(String cvText) {
        String prompt = "Analyze the following CV/Profile text and provide 3-5 specific suggestions for improvement. " +
                "Focus on keyword optimization for job search, highlighting key achievements, and identifying any skill gaps based on modern market trends.\n\nCV Text:\n" + cvText;
        return getGeminiResponse(prompt);
    }

    public String getChatbotResponse(String message) {
        String prompt = "You are a helpful AI Career Assistant for a Job Portal system. " +
                "Help the user with their question: '" + message + "'. " +
                "Keep the response concise, encouraging, and professional. Mention that they can find jobs, update their profile, or post jobs depending on whether they are a seeker or employer.";
        return getGeminiResponse(prompt);
    }
}
