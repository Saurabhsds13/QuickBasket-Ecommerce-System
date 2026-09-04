package com.dmart.clone.messaging;

import java.time.Instant;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.dmart.clone.messaging.dto.OrderInboundEvent;
import com.dmart.clone.model.Order;
import com.dmart.clone.model.OrderItem;

/**
 * Publishes QuickBasket order events to the external OMS via the
 * "oms.orders.inbound" topic. Messages are keyed by orderNumber so all events
 * for an order land on the same partition (ordering guarantee).
 */
@Component
public class OrderEventProducer {

	private static final Logger log = LoggerFactory.getLogger(OrderEventProducer.class);

	private final KafkaTemplate<String, Object> kafkaTemplate;
	private final String ordersInboundTopic;

	public OrderEventProducer(KafkaTemplate<String, Object> kafkaTemplate,
			@Value("${app.kafka.topic.orders-inbound}") String ordersInboundTopic) {
		this.kafkaTemplate = kafkaTemplate;
		this.ordersInboundTopic = ordersInboundTopic;
	}

	/**
	 * Emit an ORDER_PLACED event for the given order. Intended to be invoked
	 * after the surrounding DB transaction has committed.
	 */
	public void sendOrderPlaced(Order order) {
		String orderNumber = order.getOrderNumber();
		if (orderNumber == null) {
			log.warn("Skipping ORDER_PLACED publish: order {} has no orderNumber", order.getId());
			return;
		}

		List<OrderInboundEvent.Item> items = order.getOrderItems() == null ? List.of()
				: order.getOrderItems().stream()
						.map(this::toItem)
						.toList();

		OrderInboundEvent event = new OrderInboundEvent("ORDER_PLACED", orderNumber, items, Instant.now());

		kafkaTemplate.send(ordersInboundTopic, orderNumber, event).whenComplete((result, ex) -> {
			if (ex != null) {
				log.error("Failed to publish ORDER_PLACED for {}: {}", orderNumber, ex.getMessage(), ex);
			} else {
				log.info("Published ORDER_PLACED for {} to topic {}", orderNumber, ordersInboundTopic);
			}
		});
	}

	private OrderInboundEvent.Item toItem(OrderItem oi) {
		// Products have no dedicated SKU column yet; derive a stable productCode
		// from the product id so the OMS has a consistent reference.
		String productCode = oi.getProduct() != null ? "SKU-" + oi.getProduct().getId() : "SKU-UNKNOWN";
		int quantity = oi.getQuantity() != null ? oi.getQuantity() : 0;
		return new OrderInboundEvent.Item(productCode, quantity);
	}
}
