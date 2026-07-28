package com.dmart.clone.dto;

import jakarta.validation.constraints.NotBlank;

public record AddressDto(
        Long id,

        @NotBlank(message = "Address type is required (HOME, WORK, or OTHER)")
        String type,

        @NotBlank(message = "Address line 1 is required")
        String line1,

        String line2,

        @NotBlank(message = "City is required")
        String city,

        @NotBlank(message = "State is required")
        String state,

        @NotBlank(message = "Postal code is required")
        String postalCode,

        @NotBlank(message = "Country is required")
        String country,

        Boolean isDefault,

        String phone,

        String label
) {
}
