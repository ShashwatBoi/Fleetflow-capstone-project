package com.fleetflow.controller;

import com.fleetflow.dto.*;
import com.fleetflow.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(201).body(Map.of(
            "username", request.getUsername(),
            "email", request.getEmail() != null ? request.getEmail() : "",
            "role", request.getRole().toUpperCase(),
            "message", "User registered successfully. Please login to get access token."
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/security-question/{username}")
    public ResponseEntity<String> getSecurityQuestion(@PathVariable String username) {
        return ResponseEntity.ok(authService.getSecurityQuestion(username));
    }

    @PostMapping("/verify-answer")
    public ResponseEntity<Boolean> verifyAnswer(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.verifySecurityAnswer(body.get("username"), body.get("answer")));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.resetPassword(body.get("username"), body.get("newPassword")));
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.updatePassword(body.get("username"), body.get("oldPassword"), body.get("newPassword")));
    }

    @PutMapping("/update-username")
    public ResponseEntity<String> updateUsername(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.updateUsername(body.get("oldUsername"), body.get("newUsername")));
    }

    @PutMapping("/update-credentials")
    public ResponseEntity<String> updateCredentials(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.updateUsernameAndPassword(body.get("oldUsername"), body.get("newUsername"), body.get("newPassword")));
    }

    @PostMapping("/set-security-question")
    public ResponseEntity<Map<String, String>> setSecurityQuestion(@RequestBody Map<String, String> body,
            org.springframework.security.core.Authentication authentication) {
        String username = authentication != null ? authentication.getName() : body.get("username");
        authService.setSecurityQuestion(username, body.get("question"), body.get("answer"));
        return ResponseEntity.ok(Map.of("message", "Security question set successfully"));
    }

    @GetMapping("/own-security-question/{username}")
    public ResponseEntity<String> getOwnSecurityQuestion(@PathVariable String username) {
        return ResponseEntity.ok(authService.getOwnSecurityQuestion(username));
    }
}
