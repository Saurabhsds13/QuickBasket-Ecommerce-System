package com.dmart.clone.messaging.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Message the OMS produces to the "oms.orders.status" topic; QuickBasket
 * consumes it. Key = orderNumber. Shape matches the shared OMS contract:
 *
 * <pre>
 * {
 *   "eventType": "ORDER_APPROVED",
 *   "orderNumber": "QB-100234",
 *   "status": "APPROVED",
 *   "occurredAt": "2026-08-30T10:05:00Z"
 * }
 * </pre>
 *
 * Status values: PENDING, APPROVED, PARTIALLY_SHIPPED, SHIPPED, CANCELLED.
 * eventTypes: ORDER_PLACED, ORDER_APPROVED, ORDER_CANCELLED,
 * ORDER_PARTIALLY_SHIPPED, ORDER_SHIPPED.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record OrderStatusEvent(
		String eventType,
		String orderNumber,
		String status,
		Instant occurredAt) {
}
