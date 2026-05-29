package com.dmart.clone.dto;

import java.time.Instant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CouponDto(
        Long id,

        @NotBlank(message = "Coupon code is required")
        String code,

        @NotBlank(message = "Discount type is required (PERCENTAGE or FLAT)")
        String discountType,

        @NotNull(message = "Discount value is required")
        @Positive(message = "Discount value must be positive")
        Double discountValue,

        Double minOrderValue,

        @NotNull(message = "Valid until date is required")
        Instant validUntil
) {
}
