package com.dmart.clone.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.dmart.clone.dto.ProductCreateDto;
import com.dmart.clone.dto.ProductViewDto;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;
import com.dmart.clone.repository.CategoryRepository;
import com.dmart.clone.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;
	private final ProductImageService productImageService;

	public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository,
			ProductImageService productImageService) {
		super();
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
		this.productImageService = productImageService;
	}

	@Override
	public List<ProductViewDto> getAllProducts() {
		return productRepository.findAll().stream().map(product -> {
			String primaryImageUrl = productImageService.getImagesByProduct(product).stream()
					.filter(img -> img.getIsPrimary() != null && img.getIsPrimary()).map(ProductImage::getImageUrl)
					.findFirst().orElse(null);

			return new ProductViewDto(product.getId(), product.getName(), product.getDescription(),
					product.getCategory().getName(), product.getPrice(), product.getStockQuantity(), primaryImageUrl);
		}).collect(Collectors.toList());
	}

	@Override
	public Product getById(Long id) {
		return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
	}

	@Override
	public Product create(ProductCreateDto dto) {

		var category = categoryRepository.findById(dto.categoryId())
				.orElseThrow(() -> new RuntimeException("Category not found"));

		Product product = new Product();
		product.setName(dto.name());
		product.setDescription(dto.description());
		product.setCategory(category);
		product.setPrice(dto.price());
		product.setStockQuantity(dto.stockQuantity());

		return productRepository.save(product);
	}

}
