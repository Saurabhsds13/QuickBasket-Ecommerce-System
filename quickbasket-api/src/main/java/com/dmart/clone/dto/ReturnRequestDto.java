package com.dmart.clone.dto;

import java.time.Instant;

public record ReturnRequestDto(
        Long id,
        Long orderId,
        String reason,
        String status,
        Instant createdAt
) {
}
