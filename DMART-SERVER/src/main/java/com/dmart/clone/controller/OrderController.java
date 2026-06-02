package com.dmart.clone.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.OrderDto;
import com.dmart.clone.model.Order;
import com.dmart.clone.model.User;
import com.dmart.clone.service.OrderService;
import com.dmart.clone.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user/orders")
public class OrderController {

	@Autowired
	private OrderService orderService;

	@Autowired
	private UserService userService;

	@PostMapping("/place")
	public ResponseEntity<OrderDto> placeOrder(HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		Order order = orderService.placeOrder(user);
		OrderDto dto = new OrderDto(
				order.getId(),
				user.getUsername(),
				order.getTotalPrice(),
				order.getStatus(),
				order.getCreatedAt(),
				order.getUpdatedAt(),
				List.of()
		);
		return ResponseEntity.ok(dto);
	}

	@GetMapping
	public ResponseEntity<List<OrderDto>> getMyOrders(HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		List<OrderDto> orders = orderService.getOrdersByUser(user);
		return ResponseEntity.ok(orders);
	}

	@GetMapping("/{orderId}")
	public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId, HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		OrderDto order = orderService.getOrderById(user, orderId);
		return ResponseEntity.ok(order);
	}
}