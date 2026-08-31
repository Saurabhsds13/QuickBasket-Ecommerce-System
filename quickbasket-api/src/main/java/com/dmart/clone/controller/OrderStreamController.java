package com.dmart.clone.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.dmart.clone.model.User;
import com.dmart.clone.service.OrderStreamService;
import com.dmart.clone.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Server-sent-events endpoint that streams live order-status updates to the
 * currently authenticated user. The React app subscribes via a fetch-based
 * EventSource so the existing Bearer token flows through the standard
 * Authorization header (resolved by {@link UserService#getCurrentUser}).
 */
@RestController
@RequestMapping("/api/orders")
public class OrderStreamController {

	private final OrderStreamService orderStreamService;
	private final UserService userService;

	public OrderStreamController(OrderStreamService orderStreamService, UserService userService) {
		this.orderStreamService = orderStreamService;
		this.userService = userService;
	}

	@GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter stream(HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		return orderStreamService.subscribe(user.getId());
	}
}
