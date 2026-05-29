package com.dmart.clone.admin.service;

import com.dmart.clone.dto.ProductCreateDto;

public interface AdminProductService {
	Long createProduct(ProductCreateDto request);

	void updateProduct(Long id, ProductCreateDto request);

	void deleteProduct(Long id);
}
