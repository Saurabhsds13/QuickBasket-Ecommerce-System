package com.dmart.clone.dto;

public record JwtResponse(String token, String username, String role, long expiresAt) {
}
