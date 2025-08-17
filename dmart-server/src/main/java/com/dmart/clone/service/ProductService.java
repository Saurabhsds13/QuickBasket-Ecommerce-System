package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.ProductCreateDto;
import com.dmart.clone.dto.ProductViewDto;
import com.dmart.clone.model.Product;

public interface ProductService {

	List<ProductViewDto> getAllProducts();

	Product getById(Long id);

	Product create(ProductCreateDto dto);

}
