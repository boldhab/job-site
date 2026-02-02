package com.jobsite.jobsite.repository;

import com.jobsite.jobsite.model.entity.JobModerationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobModerationLogRepository extends JpaRepository<JobModerationLog, Long> {
    List<JobModerationLog> findByJobId(Long jobId);
    List<JobModerationLog> findByAdminId(Long adminId);
    List<JobModerationLog> findByJobIdOrderByCreatedAtDesc(Long jobId);
}