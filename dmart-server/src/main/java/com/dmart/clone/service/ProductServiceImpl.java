package com.dmart.clone.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.ProductViewDto;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;
import com.dmart.clone.repository.ProductRepository;

@Service
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {
	private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

	private final ProductRepository productRepository;
	private final ProductImageService productImageService;

	public ProductServiceImpl(ProductRepository productRepository, ProductImageService productImageService) {
		this.productRepository = productRepository;
		this.productImageService = productImageService;
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

	// ✅ common mapper extracted
	private ProductViewDto mapToProductViewDto(Product product) {
		String primaryImageUrl = productImageService.getImagesByProduct(product).stream()
				.filter(img -> Boolean.TRUE.equals(img.getIsPrimary())).map(ProductImage::getImageUrl).findFirst()
				.orElse(null);

		return new ProductViewDto(product.getId(), product.getName(), product.getDescription(),
				product.getCategory() != null ? product.getCategory().getName() : null, product.getPrice(),
				product.getStockQuantity(), primaryImageUrl);
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
}
