package com.jobsite.jobsite.util;



public class Constants {
    // File upload constants
    public static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    public static final String[] ALLOWED_FILE_TYPES = {"pdf", "doc", "docx"};
    public static final String UPLOAD_DIR = "uploads/cvs/";
    
    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 50;
    
    // Validation messages
    public static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    public static final String PHONE_REGEX = "^[0-9]{10,15}$";
    
    // Security
    public static final String JWT_SECRET = "your-jwt-secret-key-minimum-256-bits-long-for-security";
    public static final long JWT_EXPIRATION = 86400000; // 24 hours in milliseconds
}