package com.smartperformance.auth.dto;

public record AuthResponse(String message, String token, Long userId, String fullName, String email) {}
