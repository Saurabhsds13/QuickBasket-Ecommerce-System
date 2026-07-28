package com.dmart.clone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReturnRequestCreateDto(
        @NotNull(message = "Order ID is required")
        Long orderId,

        @NotBlank(message = "Reason is required")
        String reason
) {
}
