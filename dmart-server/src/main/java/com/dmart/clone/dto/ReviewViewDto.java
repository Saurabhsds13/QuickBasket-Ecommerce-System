package com.dmart.clone.dto;

import java.time.Instant;

public record ReviewViewDto(
        Long id,
        Long productId,
        String username,
        Integer rating,
        String comment,
        Instant createdAt
) {
}
