package com.dmart.clone.admin.service;

import org.springframework.stereotype.Service;

import com.dmart.clone.dto.ProductCreateDto;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Product;
import com.dmart.clone.repository.CategoryRepository;
import com.dmart.clone.repository.ProductRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AdminProductServiceImpl implements AdminProductService {

	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;

	public AdminProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;

	}

	@Override
	public Long createProduct(ProductCreateDto request) {
		var category = categoryRepository.findById(request.categoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		Product product = new Product();
		product.setName(request.name());
		product.setPrice(request.price());
		product.setDescription(request.description());
		product.setStockQuantity(request.stockQuantity());
		product.setCategory(category);

		return productRepository.save(product).getId();
	}

	@Override
	public void updateProduct(Long id, ProductCreateDto request) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		if (request.categoryId() != null) {
			var category = categoryRepository.findById(request.categoryId())
					.orElseThrow(() -> new ResourceNotFoundException("Category not found"));
			product.setCategory(category);
		}

		product.setName(request.name());
		product.setPrice(request.price());
		product.setDescription(request.description());
		product.setStockQuantity(request.stockQuantity());

		productRepository.save(product);
	}

	@Override
	public void deleteProduct(Long id) {
		if (!productRepository.existsById(id)) {
			throw new ResourceNotFoundException("Product not found");
		}
		productRepository.deleteById(id);
	}
}
