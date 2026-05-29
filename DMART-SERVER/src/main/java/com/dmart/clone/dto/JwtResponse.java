package com.dmart.clone.dto;

public record JwtResponse(String token, String refreshToken, String username, String role, long expiresAt) {
}
