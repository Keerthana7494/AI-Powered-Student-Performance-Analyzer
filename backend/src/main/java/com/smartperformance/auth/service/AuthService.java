package com.smartperformance.auth.service;

import com.smartperformance.auth.dto.*;
import com.smartperformance.auth.entity.PasswordResetToken;
import com.smartperformance.auth.entity.User;
import com.smartperformance.auth.repository.PasswordResetTokenRepository;
import com.smartperformance.auth.repository.UserRepository;
import com.smartperformance.auth.security.TokenService;
import com.smartperformance.exception.BadRequestException;
import com.smartperformance.exception.DuplicateResourceException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final TokenService tokenService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.tokenService = tokenService;
    }

    @Transactional
public AuthResponse signup(SignupRequest request) {

    String fullName = request.fullName().trim();

    String email = request.email()
            .trim()
            .toLowerCase();

    String password = request.password();

    String confirmPassword = request.confirmPassword();

    if (!password.equals(confirmPassword)) {
        throw new BadRequestException(
                "Passwords do not match."
        );
    }

    if (userRepository.existsByEmail(email)) {
        throw new DuplicateResourceException(
                "Email already registered."
        );
    }

    User user = new User();

    user.setFullName(fullName);
    user.setEmail(email);

    user.setPasswordHash(
            passwordEncoder.encode(password)
    );

    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(LocalDateTime.now());
    user.setIsActive(1);

    User savedUser = userRepository.save(user);

    return response(
            "Registration successful.",
            savedUser
    );
}

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        if (user.getIsActive() == null || user.getIsActive() != 1) throw new IllegalArgumentException("Account is inactive.");
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) throw new IllegalArgumentException("Invalid email or password.");
        return response("Login successful.", user);
    }

    @Transactional
    public java.util.Map<String,String> forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Email not registered."));
        String token = UUID.randomUUID().toString();
        PasswordResetToken reset = new PasswordResetToken(); reset.setUser(user); reset.setResetToken(token);
        reset.setExpiryTime(LocalDateTime.now().plusMinutes(15)); reset.setUsed(0); passwordResetTokenRepository.save(reset);
        return java.util.Map.of("message", "Reset token generated for development.", "resetToken", token);
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        PasswordResetToken reset = passwordResetTokenRepository.findByResetToken(request.token())
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token."));
        if (reset.getUsed() == 1) throw new IllegalArgumentException("Reset token already used.");
        if (reset.getExpiryTime().isBefore(LocalDateTime.now())) throw new IllegalArgumentException("Reset token has expired.");
        if (!request.newPassword().equals(request.confirmPassword())) throw new IllegalArgumentException("Passwords do not match.");
        User user = reset.getUser(); user.setPasswordHash(passwordEncoder.encode(request.newPassword())); user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user); reset.setUsed(1); passwordResetTokenRepository.save(reset);
        return "Password reset successful.";
    }

    private AuthResponse response(String message, User user) {
        return new AuthResponse(message, tokenService.create(user.getEmail()), user.getUserId(), user.getFullName(), user.getEmail());
    }
}
