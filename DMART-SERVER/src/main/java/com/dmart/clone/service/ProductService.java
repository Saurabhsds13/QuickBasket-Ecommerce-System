package com.dmart.clone.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dmart.clone.dto.ProductViewDto;

public interface ProductService {

	List<ProductViewDto> getAllProducts();

	ProductViewDto getById(Long id);

	List<ProductViewDto> getProductsByCategory(Long categoryId);

	Page<ProductViewDto> searchProducts(String keyword, Long categoryId, Double minPrice, Double maxPrice, Pageable pageable);
}
