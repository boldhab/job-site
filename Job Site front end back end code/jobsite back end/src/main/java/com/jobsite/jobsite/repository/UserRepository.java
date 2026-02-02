package com.jobsite.jobsite.repository;

import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.util.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(Role role);
    
    List<User> findByIsActive(Boolean isActive);
    
    long countByIsActive(Boolean isActive);
    
    // Additional useful queries
    List<User> findByEmailContainingIgnoreCase(String email);
    
    List<User> findByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
    
    // For password reset functionality
    Optional<User> findByEmailAndIsActiveTrue(String email);
}
