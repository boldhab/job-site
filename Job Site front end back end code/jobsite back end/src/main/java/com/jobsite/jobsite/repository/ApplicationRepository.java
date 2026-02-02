package com.jobsite.jobsite.repository;

import com.jobsite.jobsite.model.entity.Application;
import com.jobsite.jobsite.util.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);

    List<Application> findByJobSeekerId(Long jobSeekerId);
    
    Page<Application> findByJobSeekerId(Long jobSeekerId, Pageable pageable);

    List<Application> findByStatus(ApplicationStatus status);

    Optional<Application> findByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);

    boolean existsByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);

    long countByJobId(Long jobId);

    List<Application> findByJobEmployerId(Long employerId);
    
    Page<Application> findByJobEmployerId(Long employerId, Pageable pageable);
}