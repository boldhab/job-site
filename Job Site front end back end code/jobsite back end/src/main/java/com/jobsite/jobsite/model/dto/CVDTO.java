package com.jobsite.jobsite.model.dto;

public class CVDTO {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String education;
    private String experience;
    private String skills;

    public CVDTO() {
    }

    public CVDTO(String fullName, String email, String phoneNumber, String education, String experience, String skills) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.education = education;
        this.experience = experience;
        this.skills = skills;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }
    
}
