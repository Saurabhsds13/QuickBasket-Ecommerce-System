package com.dmart.clone.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.ReturnRequestCreateDto;
import com.dmart.clone.dto.ReturnRequestDto;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Order;
import com.dmart.clone.model.OrderStatus;
import com.dmart.clone.model.ReturnRequest;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.OrderRepository;
import com.dmart.clone.repository.ReturnRequestRepository;

@Service
@Transactional
public class ReturnRequestServiceImpl implements ReturnRequestService {

    @Autowired
    private ReturnRequestRepository returnRequestRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public ReturnRequestDto createReturnRequest(User user, ReturnRequestCreateDto dto) {
        Order order = orderRepository.findById(dto.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Verify the order belongs to this user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: Order does not belong to you");
        }

        // Only delivered orders can be returned
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Only delivered orders can be returned");
        }

        // Check if a return request already exists for this order
        if (returnRequestRepository.existsByOrder(order)) {
            throw new RuntimeException("A return request already exists for this order");
        }

        ReturnRequest returnRequest = new ReturnRequest();
        returnRequest.setOrder(order);
        returnRequest.setReason(dto.reason());
        returnRequest.setStatus("PENDING");
        returnRequest.setCreatedAt(Instant.now());

        ReturnRequest saved = returnRequestRepository.save(returnRequest);

        // Create notification for user
        notificationService.createNotification(user,
                "Your return request for Order #" + order.getId() + " has been submitted successfully.",
                "RETURN");

        return toDto(saved);
    }

    @Override
    public List<ReturnRequestDto> getMyReturnRequests(User user) {
        return returnRequestRepository.findByOrderUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public ReturnRequestDto getReturnRequestByOrderId(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: Order does not belong to you");
        }

        ReturnRequest returnRequest = returnRequestRepository.findByOrder(order)
                .orElseThrow(() -> new ResourceNotFoundException("No return request found for this order"));

        return toDto(returnRequest);
    }

    private ReturnRequestDto toDto(ReturnRequest r) {
        return new ReturnRequestDto(r.getId(), r.getOrder().getId(), r.getReason(), r.getStatus(), r.getCreatedAt());
    }
}
