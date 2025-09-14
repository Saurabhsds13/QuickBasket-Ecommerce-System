package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.ProductViewDto;

public interface ProductService {

	List<ProductViewDto> getAllProducts();

	ProductViewDto getById(Long id);

	List<ProductViewDto> getProductsByCategory(Long categoryId);
}
