package com.dmart.clone.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Append-only record of every order status change received from the external
 * OMS (or applied locally). Gives an audit trail per order.
 */
@Entity
@Table(name = "order_status_history", indexes = {
	@Index(name = "idx_osh_order", columnList = "order_id"),
	@Index(name = "idx_osh_created_at", columnList = "createdAt")
})
public class OrderStatusHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_id", nullable = false)
	private Order order;

	@Enumerated(EnumType.STRING)
	@Column(length = 30, nullable = false)
	private OrderStatus status;

	/** Raw eventType from the OMS message (e.g. ORDER_APPROVED). */
	@Column(length = 40)
	private String eventType;

	/** occurredAt reported by the OMS, if present. */
	private Instant occurredAt;

	/** When QuickBasket recorded this change. */
	private Instant createdAt;

	public OrderStatusHistory() {
	}

	public OrderStatusHistory(Order order, OrderStatus status, String eventType, Instant occurredAt, Instant createdAt) {
		this.order = order;
		this.status = status;
		this.eventType = eventType;
		this.occurredAt = occurredAt;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public String getEventType() {
		return eventType;
	}

	public void setEventType(String eventType) {
		this.eventType = eventType;
	}

	public Instant getOccurredAt() {
		return occurredAt;
	}

	public void setOccurredAt(Instant occurredAt) {
		this.occurredAt = occurredAt;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}
}
