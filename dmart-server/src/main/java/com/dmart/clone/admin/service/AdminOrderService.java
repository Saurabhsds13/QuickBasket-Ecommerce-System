package com.dmart.clone.admin.service;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.OrderDto;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Order;
import com.dmart.clone.model.OrderStatus;
import com.dmart.clone.repository.OrderRepository;

@Service
@Transactional
public class AdminOrderService {

	private final OrderRepository orderRepository;

	public AdminOrderService(OrderRepository orderRepository) {
		super();
		this.orderRepository = orderRepository;
	}

	/**
	 * Get all orders with pagination
	 */
	@Transactional(readOnly = true)
	public Page<OrderDto> getAllOrders(Pageable pageable) {
		return orderRepository.findAll(pageable).map(this::toDto);
	}

	/**
	 * Update the status of an order
	 */
	public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found"));

		// Prevent invalid transitions (optional state machine logic)
		if (order.getStatus() == OrderStatus.CANCELLED) {
			throw new IllegalStateException("Cannot update a cancelled order");
		}

		if (newStatus == OrderStatus.DELIVERED && order.getStatus() != OrderStatus.SHIPPED) {
			throw new IllegalStateException("Order must be SHIPPED before marking as DELIVERED");
		}

		order.setStatus(newStatus);
		order.setUpdatedAt(Instant.now());
		Order updatedOrder = orderRepository.save(order);

		return toDto(updatedOrder);
	}

	private OrderDto toDto(Order order) {
		return new OrderDto(order.getId(), order.getUser().getUsername(), order.getTotalPrice(), order.getStatus(),
				order.getCreatedAt(), order.getUpdatedAt());
	}
}