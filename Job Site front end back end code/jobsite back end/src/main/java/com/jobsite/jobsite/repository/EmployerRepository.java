package com.jobsite.jobsite.repository;

import com.jobsite.jobsite.model.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Long> {
    Optional<Employer> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    List<Employer> findByIsApproved(Boolean isApproved);
    List<Employer> findByCompanyNameContainingIgnoreCase(String companyName);
}