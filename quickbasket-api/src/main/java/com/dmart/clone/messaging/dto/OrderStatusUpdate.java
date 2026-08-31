package com.dmart.clone.messaging.dto;

import java.time.Instant;

/**
 * Payload pushed to the browser over SSE when an order's status changes.
 */
public record OrderStatusUpdate(
		Long orderId,
		String orderNumber,
		String status,
		String eventType,
		String message,
		Instant occurredAt) {
}
