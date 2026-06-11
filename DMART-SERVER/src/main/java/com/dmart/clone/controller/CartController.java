package com.dmart.clone.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.CartItemDto;
import com.dmart.clone.dto.CartItemViewDto;
import com.dmart.clone.model.User;
import com.dmart.clone.service.CartService;
import com.dmart.clone.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/public/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

	@Autowired
	private CartService cartService;

	@Autowired
	private UserService userService;

	@GetMapping
	public ResponseEntity<List<CartItemViewDto>> getCart(HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		return ResponseEntity.ok(cartService.getCartItems(user));
	}

	@PostMapping("/add")
	public ResponseEntity<CartItemViewDto> addToCart(@RequestBody CartItemDto dto, HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		return ResponseEntity.ok(cartService.addToCart(user, dto.productId(), dto.quantity()));
	}

	@PutMapping("/update")
	public ResponseEntity<CartItemViewDto> updateQuantity(@RequestBody CartItemDto dto, HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		CartItemViewDto updated = cartService.updateCartItemQuantity(user, dto.productId(), dto.quantity());
		if (updated == null) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(updated);
	}

	@DeleteMapping("/remove/{productId}")
	public ResponseEntity<Void> removeFromCart(@PathVariable Long productId, HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		cartService.removeFromCart(user, productId);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/clear")
	public ResponseEntity<Void> clearCart(HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		cartService.clearCart(user);
		return ResponseEntity.noContent().build();
	}
}
