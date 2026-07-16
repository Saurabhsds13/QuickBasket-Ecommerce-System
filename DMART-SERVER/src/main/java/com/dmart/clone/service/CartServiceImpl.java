package com.dmart.clone.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.CartItemViewDto;
import com.dmart.clone.model.CartItem;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.CartRepository;
import com.dmart.clone.repository.ProductRepository;

@Service
@Transactional
public class CartServiceImpl implements CartService {

	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private ProductImageService productImageService;

	@Override
	public List<CartItemViewDto> getCartItems(User user) {
		List<CartItem> items = cartRepository.findByUser(user);
		return items.stream().map(this::toDto).toList();
	}

	@Override
	public CartItemViewDto addToCart(User user, Long productId, int quantity) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		// Clean up any duplicates first
		List<CartItem> existingItems = cartRepository.findAllByUserAndProduct(user, product);
		CartItem cartItem;

		if (existingItems.isEmpty()) {
			cartItem = new CartItem();
			cartItem.setUser(user);
			cartItem.setProduct(product);
			cartItem.setQuantity(quantity);
		} else {
			// Keep the first one, delete any duplicates
			cartItem = existingItems.get(0);
			if (existingItems.size() > 1) {
				for (int i = 1; i < existingItems.size(); i++) {
					cartRepository.delete(existingItems.get(i));
				}
			}
			int currentQty = cartItem.getQuantity() != null ? cartItem.getQuantity() : 0;
			cartItem.setQuantity(currentQty + quantity);
		}

		CartItem saved = cartRepository.save(cartItem);
		return toDto(saved);
	}

	@Override
	public CartItemViewDto updateCartItemQuantity(User user, Long productId, int quantity) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		// Clean up any duplicates
		List<CartItem> existingItems = cartRepository.findAllByUserAndProduct(user, product);

		if (existingItems.isEmpty()) {
			throw new RuntimeException("Cart item not found");
		}

		// Keep the first, delete duplicates
		CartItem cartItem = existingItems.get(0);
		if (existingItems.size() > 1) {
			for (int i = 1; i < existingItems.size(); i++) {
				cartRepository.delete(existingItems.get(i));
			}
		}

		if (quantity <= 0) {
			cartRepository.delete(cartItem);
			return null;
		}

		cartItem.setQuantity(quantity);
		CartItem saved = cartRepository.save(cartItem);
		return toDto(saved);
	}

	@Override
	public void removeFromCart(User user, Long productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));
		cartRepository.deleteAllByUserAndProduct(user, product);
	}

	@Override
	public void clearCart(User user) {
		cartRepository.deleteAllByUser(user);
	}

	private CartItemViewDto toDto(CartItem item) {
		Product product = item.getProduct();
		String primaryImageUrl = productImageService.getImagesByProduct(product).stream()
				.filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
				.map(ProductImage::getImageUrl)
				.findFirst()
				.orElse(null);

		return new CartItemViewDto(
				item.getId(),
				product.getId(),
				product.getName(),
				product.getDescription(),
				product.getPrice(),
				product.getStockQuantity(),
				primaryImageUrl,
				item.getQuantity());
	}
}
