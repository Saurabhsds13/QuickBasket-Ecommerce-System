package com.dmart.clone.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dmart.clone.model.CartItem;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.CartRepository;
import com.dmart.clone.repository.ProductRepository;

@Service
public class CartServiceImpl implements CartService {

	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private ProductRepository productRepository;

	public List<CartItem> getCartItems(User user) {
		return cartRepository.findByUser(user);
	}

	public CartItem addToCart(User user, Long productId, int quantity) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		CartItem cartItem = cartRepository.findByUserAndProduct(user, product).orElse(new CartItem());
		cartItem.setUser(user);
		cartItem.setProduct(product);
		cartItem.setQuantity(cartItem.getQuantity() + quantity);

		return cartRepository.save(cartItem);
	}

	public void removeFromCart(User user, Long productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));
		cartRepository.findByUserAndProduct(user, product).ifPresent(cartRepository::delete);
	}
}
