package com.dmart.clone.controller;

import java.util.List;

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
		// If you prefer not to expose entity here, map to a detailed DTO instead.
		ProductViewDto p = productService.getById(id);
		return ResponseEntity.ok(p);
	}

	@GetMapping("/category")
	public ResponseEntity<List<ProductViewDto>> getProductsByCategory(@RequestParam("categoryId") Long categoryId) {
		List<ProductViewDto> products = productService.getProductsByCategory(categoryId);
		return ResponseEntity.ok(products);
	}
}
