package com.dmart.clone.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.CartItemDto;
import com.dmart.clone.model.CartItem;
import com.dmart.clone.model.User;
import com.dmart.clone.service.CartService;
import com.dmart.clone.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/cart")
public class CartController {

	@Autowired
	private CartService cartService;

	@Autowired
	private UserService userService;

	@GetMapping
	public List<CartItem> getCart(HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		return cartService.getCartItems(user);
	}

	@PostMapping("/add")
	public CartItem addToCart(@RequestBody CartItemDto dto, HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		return cartService.addToCart(user, dto.productId(), dto.quantity());
	}

	@DeleteMapping("/remove/{productId}")
	public void removeFromCart(@PathVariable Long productId, HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		cartService.removeFromCart(user, productId);
	}
}