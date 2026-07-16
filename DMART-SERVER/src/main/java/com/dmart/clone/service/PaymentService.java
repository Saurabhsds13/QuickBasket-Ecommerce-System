package com.dmart.clone.service;

import java.time.Instant;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.PaymentOrderResponse;
import com.dmart.clone.dto.PaymentVerifyRequest;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Order;
import com.dmart.clone.model.OrderStatus;
import com.dmart.clone.model.Payment;
import com.dmart.clone.repository.OrderRepository;
import com.dmart.clone.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Service
@Transactional
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Create a Razorpay order for the given application order.
     */
    public PaymentOrderResponse createPaymentOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id=" + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Payment can only be initiated for PENDING orders");
        }

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) (order.getTotalPrice() * 100)); // amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + orderId);

            com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            // Save payment record
            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setAmount(order.getTotalPrice());
            payment.setCurrency("INR");
            payment.setPaymentStatus("PENDING");
            paymentRepository.save(payment);

            // Link payment to order
            order.setPayment(payment);
            orderRepository.save(order);

            return new PaymentOrderResponse(
                    String.valueOf(orderId),
                    razorpayOrderId,
                    order.getTotalPrice(),
                    "INR",
                    razorpayKeyId
            );

        } catch (RazorpayException e) {
            log.error("Razorpay order creation failed: {}", e.getMessage());
            throw new RuntimeException("Payment order creation failed: " + e.getMessage());
        }
    }

    /**
     * Verify payment signature and update order status.
     */
    public boolean verifyPayment(PaymentVerifyRequest request) {
        Payment payment = paymentRepository.findByRazorpayOrderId(request.razorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for razorpay order: " + request.razorpayOrderId()));

        // Verify signature
        String generatedSignature = generateSignature(
                request.razorpayOrderId() + "|" + request.razorpayPaymentId(),
                razorpayKeySecret
        );

        if (!generatedSignature.equals(request.razorpaySignature())) {
            payment.setPaymentStatus("FAILED");
            paymentRepository.save(payment);
            return false;
        }

        // Payment verified successfully
        payment.setRazorpayPaymentId(request.razorpayPaymentId());
        payment.setRazorpaySignature(request.razorpaySignature());
        payment.setPaymentStatus("SUCCESS");
        payment.setPaidAt(Instant.now());
        paymentRepository.save(payment);

        // Update order status to CONFIRMED
        Order order = payment.getOrder();
        order.setStatus(OrderStatus.CONFIRMED);
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);

        return true;
    }

    private String generateSignature(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC signature", e);
        }
    }
}
