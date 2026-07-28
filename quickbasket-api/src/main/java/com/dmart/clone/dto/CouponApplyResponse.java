package com.dmart.clone.dto;

public record CouponApplyResponse(
        String code,
        String discountType,
        Double discountValue,
        Double originalTotal,
        Double discountAmount,
        Double finalTotal
) {
}
