package com.dmart.clone.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.WishlistItemDto;
import com.dmart.clone.exception.ConflictException;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;
import com.dmart.clone.model.User;
import com.dmart.clone.model.WishlistItem;
import com.dmart.clone.repository.ProductRepository;
import com.dmart.clone.repository.WishlistRepository;

@Service
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductImageService productImageService;

    public WishlistServiceImpl(WishlistRepository wishlistRepository, ProductRepository productRepository,
                               ProductImageService productImageService) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.productImageService = productImageService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<WishlistItemDto> getWishlist(User user) {
        return wishlistRepository.findByUser(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public WishlistItemDto addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id=" + productId));

        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            throw new ConflictException("Product already in wishlist");
        }

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        item.setCreatedAt(Instant.now());

        WishlistItem saved = wishlistRepository.save(item);
        return mapToDto(saved);
    }

    @Override
    public void removeFromWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id=" + productId));

        WishlistItem item = wishlistRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in wishlist"));

        wishlistRepository.delete(item);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isInWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return false;
        return wishlistRepository.existsByUserAndProduct(user, product);
    }

    private WishlistItemDto mapToDto(WishlistItem item) {
        Product product = item.getProduct();
        String imageUrl = productImageService.getImagesByProduct(product).stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);

        return new WishlistItemDto(
                item.getId(),
                product.getId(),
                product.getName(),
                product.getPrice(),
                imageUrl,
                item.getCreatedAt()
        );
    }
}
