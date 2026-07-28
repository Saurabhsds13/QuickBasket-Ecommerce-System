package com.dmart.clone.dto;

public record PaymentOrderResponse(
        String orderId,
        String razorpayOrderId,
        Double amount,
        String currency,
        String keyId
) {
}
