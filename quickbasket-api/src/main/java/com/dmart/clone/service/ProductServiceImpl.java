package com.dmart.clone.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.ProductViewDto;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;
import com.dmart.clone.repository.ProductRepository;
import com.dmart.clone.repository.ProductReviewRepository;

@Service
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {
	private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

	private final ProductRepository productRepository;
	private final ProductImageService productImageService;
	private final ProductReviewRepository productReviewRepository;

	public ProductServiceImpl(ProductRepository productRepository, ProductImageService productImageService,
			ProductReviewRepository productReviewRepository) {
		this.productRepository = productRepository;
		this.productImageService = productImageService;
		this.productReviewRepository = productReviewRepository;
	}

	@Override
	public List<ProductViewDto> getAllProducts() {
		log.info("Fetching all products");

		return productRepository.findAll().stream().map(this::mapToProductViewDto).collect(Collectors.toList());
	}

	@Override
	public ProductViewDto getById(Long id) {
		log.info("Fetching product by id={}", id);

		var product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with id=" + id));

		return mapToProductViewDto(product);
	}

	@Override
	public List<ProductViewDto> getProductsByCategory(Long categoryId) {
		log.info("Fetching products for categoryId={}", categoryId);

		List<Product> products = productRepository.findByCategoryId(categoryId);
		if (products.isEmpty()) {
			throw new ResourceNotFoundException("No products found for category id=" + categoryId);
		}

		return products.stream().map(this::mapToProductViewDto).collect(Collectors.toList());
	}

	@Override
	public Page<ProductViewDto> searchProducts(String keyword, Long categoryId, Double minPrice, Double maxPrice,
			Pageable pageable) {
		log.info("Searching products: keyword={}, categoryId={}, minPrice={}, maxPrice={}", keyword, categoryId,
				minPrice, maxPrice);

		String formattedKeyword = (keyword != null && !keyword.trim().isEmpty())
				? "%" + keyword.toLowerCase().trim() + "%"
				: null;

		Page<Product> products = productRepository.searchProducts(formattedKeyword, categoryId, minPrice, maxPrice,
				pageable);
		return products.map(this::mapToProductViewDto);
	}

	// common mapper extracted
	private ProductViewDto mapToProductViewDto(Product product) {
		String primaryImageUrl = productImageService.getImagesByProduct(product).stream()
				.filter(img -> Boolean.TRUE.equals(img.getIsPrimary())).map(ProductImage::getImageUrl).findFirst()
				.orElse(null);

		Double avgRating = productReviewRepository.getAverageRatingByProductId(product.getId());

		return new ProductViewDto(product.getId(), product.getName(), product.getDescription(),
				product.getCategory() != null ? product.getCategory().getName() : null, product.getPrice(),
				product.getStockQuantity(), primaryImageUrl, avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : null);
	}

	@Override
	public List<ProductViewDto> getBestSellingProducts(int limit) {
		log.info("Fetching top {} best-selling products", limit);
		List<Product> products = productRepository.findBestSellingProducts(PageRequest.of(0, limit));

		// If not enough order data, fall back to newest products
		if (products.size() < limit) {
			List<Long> existingIds = products.stream().map(Product::getId).toList();
			List<Product> newest = productRepository.findAll(PageRequest.of(0, limit, org.springframework.data.domain.Sort.by("createdAt").descending())).getContent();
			for (Product p : newest) {
				if (!existingIds.contains(p.getId()) && products.size() < limit) {
					products.add(p);
				}
			}
		}

		return products.stream().map(this::mapToProductViewDto).collect(Collectors.toList());
	}

	@Override
	public List<ProductViewDto> getTopRatedProducts(int limit) {
		log.info("Fetching top {} rated products", limit);
		List<Product> products = productRepository.findTopRatedProducts(PageRequest.of(0, limit));

		// If not enough reviews, fall back to newest products
		if (products.size() < limit) {
			List<Long> existingIds = products.stream().map(Product::getId).toList();
			List<Product> newest = productRepository.findAll(PageRequest.of(0, limit, org.springframework.data.domain.Sort.by("createdAt").descending())).getContent();
			for (Product p : newest) {
				if (!existingIds.contains(p.getId()) && products.size() < limit) {
					products.add(p);
				}
			}
		}

		return products.stream().map(this::mapToProductViewDto).collect(Collectors.toList());
	}
}
