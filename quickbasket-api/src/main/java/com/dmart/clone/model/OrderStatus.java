package com.dmart.clone.model;

public enum OrderStatus {
	// Existing QuickBasket lifecycle values
	PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED,
	// Added for the external OMS contract (oms.orders.status)
	APPROVED, PARTIALLY_SHIPPED
}
