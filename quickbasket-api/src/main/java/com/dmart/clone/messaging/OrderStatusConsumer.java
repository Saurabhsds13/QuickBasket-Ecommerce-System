package com.dmart.clone.messaging;

import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.messaging.dto.OrderStatusEvent;
import com.dmart.clone.messaging.dto.OrderStatusUpdate;
import com.dmart.clone.model.Order;
import com.dmart.clone.model.OrderStatus;
import com.dmart.clone.model.OrderStatusHistory;
import com.dmart.clone.repository.OrderRepository;
import com.dmart.clone.repository.OrderStatusHistoryRepository;
import com.dmart.clone.service.NotificationService;
import com.dmart.clone.service.OrderStreamService;

/**
 * Consumes order-status changes produced by the external OMS on the
 * "oms.orders.status" topic. For each message it updates the local order,
 * appends a status-history record, creates a user notification, and pushes a
 * live update to the user's browser over SSE.
 */
@Component
public class OrderStatusConsumer {

	private static final Logger log = LoggerFactory.getLogger(OrderStatusConsumer.class);

	private final OrderRepository orderRepository;
	private final OrderStatusHistoryRepository statusHistoryRepository;
	private final NotificationService notificationService;
	private final OrderStreamService orderStreamService;

	public OrderStatusConsumer(OrderRepository orderRepository,
			OrderStatusHistoryRepository statusHistoryRepository,
			NotificationService notificationService,
			OrderStreamService orderStreamService) {
		this.orderRepository = orderRepository;
		this.statusHistoryRepository = statusHistoryRepository;
		this.notificationService = notificationService;
		this.orderStreamService = orderStreamService;
	}

	@KafkaListener(topics = "${app.kafka.topic.orders-status}", groupId = "${spring.kafka.consumer.group-id}")
	@Transactional
	public void onOrderStatus(OrderStatusEvent event) {
		if (event == null || event.orderNumber() == null) {
			log.warn("Ignoring malformed order-status event: {}", event);
			return;
		}

		log.info("Received order-status event {} for {} (status={})",
				event.eventType(), event.orderNumber(), event.status());

		Order order = orderRepository.findByOrderNumber(event.orderNumber()).orElse(null);
		if (order == null) {
			log.warn("No local order found for orderNumber {}; skipping", event.orderNumber());
			return;
		}

		OrderStatus newStatus = mapStatus(event.status());
		if (newStatus == null) {
			log.warn("Unknown status '{}' for order {}; recording event only", event.status(), event.orderNumber());
		} else {
			order.setStatus(newStatus);
			order.setUpdatedAt(Instant.now());
			orderRepository.save(order);
		}

		// Append to the append-only status history (audit trail).
		OrderStatusHistory history = new OrderStatusHistory(
				order,
				newStatus != null ? newStatus : order.getStatus(),
				event.eventType(),
				event.occurredAt(),
				Instant.now());
		statusHistoryRepository.save(history);

		String message = buildMessage(order.getOrderNumber(), event.status());

		// Persist a notification so it shows up in the bell/notifications view.
		notificationService.createNotification(order.getUser(), message, "ORDER");

		// Push a live update to the user's open browser tabs.
		OrderStatusUpdate update = new OrderStatusUpdate(
				order.getId(),
				order.getOrderNumber(),
				newStatus != null ? newStatus.name() : event.status(),
				event.eventType(),
				message,
				event.occurredAt());
		orderStreamService.sendToUser(order.getUser().getId(), "order-status", update);
	}

	/**
	 * Map OMS contract status values onto the local {@link OrderStatus} enum.
	 * Contract values: PENDING, APPROVED, PARTIALLY_SHIPPED, SHIPPED, CANCELLED.
	 */
	private OrderStatus mapStatus(String status) {
		if (status == null) {
			return null;
		}
		try {
			return OrderStatus.valueOf(status.trim().toUpperCase());
		} catch (IllegalArgumentException e) {
			return null;
		}
	}

	private String buildMessage(String orderNumber, String status) {
		return switch (status == null ? "" : status.toUpperCase()) {
			case "APPROVED" -> "Your order " + orderNumber + " has been approved.";
			case "PARTIALLY_SHIPPED" -> "Order " + orderNumber + " has been partially shipped.";
			case "SHIPPED" -> "Order " + orderNumber + " has shipped.";
			case "CANCELLED" -> "Order " + orderNumber + " has been cancelled.";
			case "PENDING" -> "Order " + orderNumber + " is pending.";
			default -> "Order " + orderNumber + " status updated to " + status + ".";
		};
	}
}
