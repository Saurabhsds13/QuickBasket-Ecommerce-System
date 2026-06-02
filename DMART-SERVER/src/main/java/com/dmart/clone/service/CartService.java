package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.CartItemViewDto;
import com.dmart.clone.model.User;

public interface CartService {

	List<CartItemViewDto> getCartItems(User user);

	CartItemViewDto addToCart(User user, Long productId, int quantity);

	void removeFromCart(User user, Long productId);
}
