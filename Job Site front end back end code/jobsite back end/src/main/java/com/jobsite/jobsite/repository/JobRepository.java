package com.jobsite.jobsite.repository;

import com.jobsite.jobsite.model.entity.Job;
import com.jobsite.jobsite.util.JobStatus;
import com.jobsite.jobsite.util.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    // Basic CRUD operations are inherited from JpaRepository
    
    // Find jobs by employer
    List<Job> findByEmployerId(Long employerId);
    
    // Find jobs by status
    List<Job> findByStatus(JobStatus status);
    
    // Find jobs by type
    List<Job> findByJobType(JobType jobType);
    
    // Search by location (case-insensitive)
    List<Job> findByLocationContainingIgnoreCase(String location);
    
    // Search by title (case-insensitive)
    List<Job> findByTitleContainingIgnoreCase(String keyword);
    
    // Find jobs by employer and status
    List<Job> findByEmployerIdAndStatus(Long employerId, JobStatus status);
    
    // Count jobs by status
    long countByStatus(JobStatus status);
    
    // Advanced search with JPQL query
    @Query("SELECT j FROM Job j WHERE j.status = 'APPROVED' AND " +
           "(j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP) AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Job> searchJobs(@Param("keyword") String keyword);
    
    // Additional useful queries you might need:
    
    // Find active jobs (approved and not closed)
    @Query("SELECT j FROM Job j WHERE j.status = 'APPROVED' AND (j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP) ORDER BY j.createdAt DESC")
    List<Job> findActiveJobs();
    
    // Find jobs created after a certain date
    List<Job> findByCreatedAtAfter(java.time.LocalDateTime date);
    
    // Find jobs by salary range (if you have numeric salary fields)
    // @Query("SELECT j FROM Job j WHERE j.minSalary >= :minSalary AND j.maxSalary <= :maxSalary")
    // List<Job> findBySalaryRange(@Param("minSalary") Double minSalary, @Param("maxSalary") Double maxSalary);
    
    // Find jobs with pagination support
    org.springframework.data.domain.Page<Job> findByStatus(JobStatus status, org.springframework.data.domain.Pageable pageable);
    
    org.springframework.data.domain.Page<Job> findByJobType(JobType jobType, org.springframework.data.domain.Pageable pageable);
    
    org.springframework.data.domain.Page<Job> findByLocationContainingIgnoreCase(String location, org.springframework.data.domain.Pageable pageable);
    
    @Query("SELECT j FROM Job j WHERE j.status = 'APPROVED' AND (j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP) ORDER BY j.createdAt DESC")
    org.springframework.data.domain.Page<Job> findActiveJobs(org.springframework.data.domain.Pageable pageable);
    
    @Query("SELECT j FROM Job j WHERE j.status = 'APPROVED' AND " +
           "(j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP) AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    org.springframework.data.domain.Page<Job> searchJobs(@Param("keyword") String keyword, org.springframework.data.domain.Pageable pageable);
}