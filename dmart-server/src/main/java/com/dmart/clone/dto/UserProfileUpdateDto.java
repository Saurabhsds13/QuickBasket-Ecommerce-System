package com.dmart.clone.dto;

import jakarta.validation.constraints.Email;

public record UserProfileUpdateDto(
        @Email(message = "Invalid email format")
        String email,

        String phone,

        String currentPassword,

        String newPassword
) {
}
