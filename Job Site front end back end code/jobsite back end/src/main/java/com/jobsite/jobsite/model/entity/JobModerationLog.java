package com.jobsite.jobsite.model.entity;

import com.jobsite.jobsite.util.ModerationAction;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_moderation_logs")
public class JobModerationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModerationAction action;

    @Column(length = 2000)
    private String reason;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public JobModerationLog() {}

    public JobModerationLog(Job job, User admin, ModerationAction action) {
        this.job = job;
        this.admin = admin;
        this.action = action;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getAdmin() {
        return admin;
    }

    public void setAdmin(User admin) {
        this.admin = admin;
    }

    public ModerationAction getAction() {
        return action;
    }

    public void setAction(ModerationAction action) {
        this.action = action;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}