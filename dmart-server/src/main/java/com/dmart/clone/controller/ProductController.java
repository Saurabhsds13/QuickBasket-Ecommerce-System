package com.dmart.clone.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dmart.clone.dto.ProductCreateDto;
import com.dmart.clone.dto.ProductViewDto;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;
import com.dmart.clone.service.ProductImageService;
import com.dmart.clone.service.ProductService;

@RestController
@RequestMapping("/api/products")

public class ProductController {

	private final ProductService productService;
	private final ProductImageService productImageService;

	public ProductController(ProductService productService, ProductImageService productImageService) {
		super();
		this.productService = productService;
		this.productImageService = productImageService;
	}

	@GetMapping
	public ResponseEntity<List<ProductViewDto>> list() {
		return ResponseEntity.ok(productService.getAllProducts());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Product> get(@PathVariable Long id) {
		return ResponseEntity.ok(productService.getById(id));
	}

	@PostMapping
	public ResponseEntity<Product> create(@RequestBody ProductCreateDto dto) {
		return ResponseEntity.ok(productService.create(dto));
	}

	@PostMapping("/{productId}/images")
	public ProductImage uploadProductImage(@PathVariable Long productId, @RequestParam("file") MultipartFile file,
			@RequestParam(defaultValue = "false") boolean isPrimary) {
		Product product = productService.getById(productId);
		return productImageService.uploadImage(product, file, isPrimary);
	}
}
