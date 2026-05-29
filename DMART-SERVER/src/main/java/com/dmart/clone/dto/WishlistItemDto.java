package com.dmart.clone.dto;

import java.time.Instant;

public record WishlistItemDto(
        Long id,
        Long productId,
        String productName,
        Double productPrice,
        String productImage,
        Instant addedAt
) {
}
