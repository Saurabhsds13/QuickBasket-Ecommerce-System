package com.dmart.clone.dto;

public record PaymentOrderRequest(
        Double amount,
        String currency,
        String receipt
) {
    public PaymentOrderRequest {
        if (currency == null || currency.isBlank()) currency = "INR";
    }
}
