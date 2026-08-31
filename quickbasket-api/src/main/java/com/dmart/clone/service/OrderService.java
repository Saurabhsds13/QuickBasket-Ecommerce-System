package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.OrderDto;
import com.dmart.clone.model.Order;
import com.dmart.clone.model.User;

public interface OrderService {

	Order placeOrder(User user);

	/**
	 * Place an order, indicating the chosen payment method. For COD orders the
	 * ORDER_PLACED event is emitted to the OMS immediately after commit (there is
	 * no separate payment step); for online orders the event is emitted on
	 * payment verification instead.
	 */
	Order placeOrder(User user, String paymentMethod);

	List<OrderDto> getOrdersByUser(User user);

	OrderDto getOrderById(User user, Long orderId);

	OrderDto cancelOrder(User user, Long orderId, String reason);
}
