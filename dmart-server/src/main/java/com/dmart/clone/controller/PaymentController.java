package com.dmart.clone.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.PaymentOrderResponse;
import com.dmart.clone.dto.PaymentVerifyRequest;
import com.dmart.clone.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Create a Razorpay order for the given application order.
     * Call this after placing an order to initiate payment.
     */
    @PostMapping("/create/{orderId}")
    public ResponseEntity<PaymentOrderResponse> createPaymentOrder(@PathVariable Long orderId) {
        PaymentOrderResponse response = paymentService.createPaymentOrder(orderId);
        return ResponseEntity.ok(response);
    }

    /**
     * Verify payment after Razorpay checkout completes.
     * Frontend sends razorpayOrderId, razorpayPaymentId, razorpaySignature.
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody @Valid PaymentVerifyRequest request) {
        boolean verified = paymentService.verifyPayment(request);
        if (verified) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Payment verification failed"));
        }
    }
}
