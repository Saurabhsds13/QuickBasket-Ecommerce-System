package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.OrderDto;
import com.dmart.clone.model.Order;
import com.dmart.clone.model.User;

public interface OrderService {

	Order placeOrder(User user);

	List<OrderDto> getOrdersByUser(User user);

	OrderDto getOrderById(User user, Long orderId);

	OrderDto cancelOrder(User user, Long orderId, String reason);
}
