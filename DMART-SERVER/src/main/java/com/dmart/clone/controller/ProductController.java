package com.dmart.clone.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.ProductViewDto;
import com.dmart.clone.service.ProductService;

@RestController
@RequestMapping("/api/public/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

	private final ProductService productService;

	public ProductController(ProductService productService) {
		this.productService = productService;
	}

	@GetMapping
	public ResponseEntity<List<ProductViewDto>> getAll() {
		return ResponseEntity.ok(productService.getAllProducts());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductViewDto> getProductById(@PathVariable Long id) {
		ProductViewDto p = productService.getById(id);
		return ResponseEntity.ok(p);
	}

	@GetMapping("/category")
	public ResponseEntity<List<ProductViewDto>> getProductsByCategory(@RequestParam("categoryId") Long categoryId) {
		List<ProductViewDto> products = productService.getProductsByCategory(categoryId);
		return ResponseEntity.ok(products);
	}

	@GetMapping("/search")
	public ResponseEntity<Page<ProductViewDto>> searchProducts(
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) Long categoryId,
			@RequestParam(required = false) Double minPrice,
			@RequestParam(required = false) Double maxPrice,
			@RequestParam(defaultValue = "createdAt") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDir,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "12") int size) {

		Sort sort = sortDir.equalsIgnoreCase("asc")
				? Sort.by(sortBy).ascending()
				: Sort.by(sortBy).descending();
		Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);

		Page<ProductViewDto> results = productService.searchProducts(keyword, categoryId, minPrice, maxPrice, pageable);
		return ResponseEntity.ok(results);
	}
}
