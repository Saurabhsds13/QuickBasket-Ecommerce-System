package com.dmart.clone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	public Order placeOrder(HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		return orderService.placeOrder(user);
	}
}