package com.jobsite.jobsite.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final AuthEntryPoint authEntryPoint;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(
            JwtFilter jwtFilter,
            AuthEntryPoint authEntryPoint,
            UserDetailsService userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.authEntryPoint = authEntryPoint;
        this.userDetailsService = userDetailsService;
    }

    // ---------------- PASSWORD ENCODER ----------------
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ---------------- AUTH PROVIDER ----------------
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // ---------------- AUTH MANAGER ----------------
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ---------------- CORS CONFIG ----------------
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173")); // React (Vite)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // ---------------- SECURITY FILTER CHAIN ----------------
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(authEntryPoint)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                // ---------- PUBLIC ----------
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/jobs/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/jobs/**").permitAll()
                .requestMatchers("/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/error").permitAll()

                // ---------- AUTH & PROFILE ----------
                .requestMatchers("/applications", "/applications/**").authenticated()
                .requestMatchers("/profile", "/profile/**").authenticated()
                .requestMatchers("/cvs", "/cvs/**").hasAnyRole("JOB_SEEKER", "EMPLOYER", "ADMIN")
                .requestMatchers("/job-seekers", "/job-seekers/**").hasAnyRole("JOB_SEEKER", "ADMIN")

                // ---------- EMPLOYER ----------
                .requestMatchers("/employers/**").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.POST, "/jobs/**").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.PUT, "/jobs/**").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.DELETE, "/jobs/**").hasRole("EMPLOYER")

                // ---------- ADMIN ----------
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/users/**").hasRole("ADMIN")

                // ---------- AI FEATURES ----------
                .requestMatchers("/ai/**").authenticated()

                // ---------- DEFAULT ----------
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
