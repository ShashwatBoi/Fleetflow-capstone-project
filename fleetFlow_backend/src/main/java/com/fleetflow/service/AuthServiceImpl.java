package com.fleetflow.service;

import com.fleetflow.dto.*;
import com.fleetflow.entity.User;
import com.fleetflow.exception.InvalidEntityException;
import com.fleetflow.repository.UserRepository;
import com.fleetflow.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public String register(RegisterRequest request) {
        log.info("Registering user: {}", request.getUsername());
        if (userRepository.existsByUsername(request.getUsername()))
            throw new InvalidEntityException("Username already exists: " + request.getUsername());
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setActive(true);
        userRepository.save(user);
        return "User registered successfully";
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        log.info("Login attempt for: {}", request.getUsername());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidEntityException("User not found"));
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getRole(), user.getUsername());
    }

    @Override
    public String getSecurityQuestion(String username) {
        log.info("Getting security question for: {}", username);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidEntityException("User not found: " + username))
                .getSecurityQuestion();
    }

    @Override
    public boolean verifySecurityAnswer(String username, String answer) {
        log.info("Verifying security answer for: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidEntityException("User not found: " + username));
        return answer.equalsIgnoreCase(user.getSecurityAnswer());
    }

    @Override
    public String resetPassword(String username, String newPassword) {
        log.info("Resetting password for: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidEntityException("User not found: " + username));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Password reset successfully";
    }

    @Override
    public String updatePassword(String username, String oldPassword, String newPassword) {
        log.info("Updating password for: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidEntityException("User not found: " + username));
        if (!passwordEncoder.matches(oldPassword, user.getPassword()))
            throw new InvalidEntityException("Old password is incorrect");
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Password updated successfully";
    }

    @Override
    public String updateUsername(String oldUsername, String newUsername) {
        log.info("Updating username from {} to {}", oldUsername, newUsername);
        if (userRepository.existsByUsername(newUsername))
            throw new InvalidEntityException("Username already exists: " + newUsername);
        User user = userRepository.findByUsername(oldUsername)
                .orElseThrow(() -> new InvalidEntityException("User not found: " + oldUsername));
        user.setUsername(newUsername);
        userRepository.save(user);
        return "Username updated successfully";
    }

    @Override
    public String updateUsernameAndPassword(String oldUsername, String newUsername, String newPassword) {
        log.info("Updating username and password for: {}", oldUsername);
        if (userRepository.existsByUsername(newUsername))
            throw new InvalidEntityException("Username already exists: " + newUsername);
        User user = userRepository.findByUsername(oldUsername)
                .orElseThrow(() -> new InvalidEntityException("User not found: " + oldUsername));
        user.setUsername(newUsername);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Username and password updated successfully";
    }

    @Override
    public String setSecurityQuestion(String username, String question, String answer) {
        log.info("Setting security question for: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidEntityException("User not found: " + username));
        user.setSecurityQuestion(question);
        user.setSecurityAnswer(answer);
        userRepository.save(user);
        return "Security question set successfully";
    }

    @Override
    public String getOwnSecurityQuestion(String username) {
        log.info("Getting own security question for: {}", username);
        return getSecurityQuestion(username);
    }
}
