package com.jobsite.jobsite.service;

import com.jobsite.jobsite.config.JwtUtil;
import com.jobsite.jobsite.model.dto.AuthResponse;
import com.jobsite.jobsite.model.dto.RegisterRequest;
import com.jobsite.jobsite.model.entity.Employer;
import com.jobsite.jobsite.model.entity.JobSeeker;
import com.jobsite.jobsite.model.entity.User;
import com.jobsite.jobsite.repository.EmployerRepository;
import com.jobsite.jobsite.repository.JobSeekerRepository;
import com.jobsite.jobsite.repository.UserRepository;
import com.jobsite.jobsite.util.Role;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final EmployerRepository employerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            JobSeekerRepository jobSeekerRepository,
            EmployerRepository employerRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager) {

        this.userRepository = userRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.employerRepository = employerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    // ================= REGISTER =================
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        if (request.getRole() == Role.JOB_SEEKER) {
            JobSeeker jobSeeker = new JobSeeker();
            jobSeeker.setUser(savedUser);
            jobSeeker.setFullName(request.getFullName());
            jobSeekerRepository.save(jobSeeker);
        }

        if (request.getRole() == Role.EMPLOYER) {
            Employer employer = new Employer();
            employer.setUser(savedUser);
            employer.setCompanyName(request.getCompanyName());
            employer.setCompanyEmail(request.getEmail());
            employer.setIsApproved(false);
            employerRepository.save(employer);
        }

        // Authenticate after register
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, savedUser.getEmail(), savedUser.getRole());
    }

    // ================= LOGIN =================
    public AuthResponse login(String email, String password) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, user.getEmail(), user.getRole());
    }

    // ================= REFRESH TOKEN =================
    public AuthResponse refreshToken(String oldToken) {

        String email = jwtUtil.extractUsername(oldToken);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, null)
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String newToken = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(newToken, user.getEmail(), user.getRole());
    }
}
