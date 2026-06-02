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

		CartItem cartItem = cartRepository.findByUserAndProduct(user, product).orElse(null);

		if (cartItem == null) {
			cartItem = new CartItem();
			cartItem.setUser(user);
			cartItem.setProduct(product);
			cartItem.setQuantity(quantity);
		} else {
			int currentQty = cartItem.getQuantity() != null ? cartItem.getQuantity() : 0;
			cartItem.setQuantity(currentQty + quantity);
		}

		CartItem saved = cartRepository.save(cartItem);
		return toDto(saved);
	}

	@Override
	public void removeFromCart(User user, Long productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));
		cartRepository.findByUserAndProduct(user, product).ifPresent(cartRepository::delete);
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
