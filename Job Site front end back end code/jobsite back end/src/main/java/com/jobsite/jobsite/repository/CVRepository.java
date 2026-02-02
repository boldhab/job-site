package com.jobsite.jobsite.repository;

import com.jobsite.jobsite.model.entity.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CVRepository extends JpaRepository<CV, Long> {
    List<CV> findByJobSeekerId(Long jobSeekerId);
    Optional<CV> findFirstByJobSeekerIdOrderByCreatedAtDesc(Long jobSeekerId);
    boolean existsByJobSeekerId(Long jobSeekerId);
}