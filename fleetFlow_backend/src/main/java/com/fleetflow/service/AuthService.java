package com.fleetflow.service;

import com.fleetflow.dto.*;

public interface AuthService {
    String register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
    String getSecurityQuestion(String username);
    boolean verifySecurityAnswer(String username, String answer);
    String resetPassword(String username, String newPassword);
    String updatePassword(String username, String oldPassword, String newPassword);
    String updateUsername(String oldUsername, String newUsername);
    String updateUsernameAndPassword(String oldUsername, String newUsername, String newPassword);
    String setSecurityQuestion(String username, String question, String answer);
    String getOwnSecurityQuestion(String username);
}
