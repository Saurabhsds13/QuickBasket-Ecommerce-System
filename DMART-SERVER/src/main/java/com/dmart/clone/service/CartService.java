package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.model.CartItem;
import com.dmart.clone.model.User;

public interface CartService {

	List<CartItem> getCartItems(User user);

	CartItem addToCart(User user, Long productId, int quantity);

	void removeFromCart(User user, Long productId);
}
