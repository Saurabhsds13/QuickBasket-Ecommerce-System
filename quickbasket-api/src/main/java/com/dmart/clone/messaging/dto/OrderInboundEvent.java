package com.dmart.clone.messaging.dto;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Message QuickBasket produces to the "oms.orders.inbound" topic when an order
 * is placed/paid. Key = orderNumber. Shape matches the shared OMS contract:
 *
 * <pre>
 * {
 *   "eventType": "ORDER_PLACED",
 *   "orderNumber": "QB-100234",
 *   "items": [ { "productCode": "SKU-1", "quantity": 2 } ],
 *   "occurredAt": "2026-08-30T10:00:00Z"
 * }
 * </pre>
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record OrderInboundEvent(
		String eventType,
		String orderNumber,
		List<Item> items,
		Instant occurredAt) {

	public record Item(String productCode, int quantity) {
	}
}
