package com.dmart.clone.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.ProductCreateDto;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Product;
import com.dmart.clone.repository.ProductRepository;

@Service
@Transactional
public class AdminProductService {

	@Autowired
	private ProductRepository productRepository;

	public Product createProduct(ProductCreateDto request) {
		Product product = new Product();
		product.setName(request.name());
		product.setPrice(request.price());
		product.setDescription(request.description());
		product.setStockQuantity(request.stockQuantity());
		// set category, image, etc.
		return productRepository.save(product);
	}

	public Product updateProduct(Long id, ProductCreateDto request) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		product.setName(request.name());
		product.setPrice(request.price());
		// update other fields
		return productRepository.save(product);
	}

	public void deleteProduct(Long id) {
		if (!productRepository.existsById(id)) {
			throw new ResourceNotFoundException("Product not found");
		}
		productRepository.deleteById(id);
	}
}