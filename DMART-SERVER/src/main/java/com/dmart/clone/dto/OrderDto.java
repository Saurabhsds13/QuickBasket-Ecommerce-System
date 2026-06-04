package com.dmart.clone.dto;

import java.time.Instant;
import java.util.List;

import com.dmart.clone.model.OrderStatus;

public record OrderDto(
		Long id,
		String customerName,
		Double total,
		OrderStatus status,
		Instant createdAt,
		Instant updatedAt,
		List<OrderItemDto> items,
		String cancellationReason) {
}
