package com.dmart.clone.dto;

import java.time.Instant;

import com.dmart.clone.model.Role;

public record UserViewDto(Long id, String username, String email, String phone, Role role, Boolean blocked,
		Instant createdAt) {
}
