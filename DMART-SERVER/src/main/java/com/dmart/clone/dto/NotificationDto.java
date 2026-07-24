package com.dmart.clone.dto;

import java.time.Instant;

public record NotificationDto(
        Long id,
        String message,
        String type,
        Boolean seen,
        Instant createdAt
) {
}
