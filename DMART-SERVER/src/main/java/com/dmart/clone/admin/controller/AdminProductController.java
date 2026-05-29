package com.dmart.clone.admin.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.dmart.clone.admin.service.AdminProductService;
import com.dmart.clone.dto.IdResponse;
import com.dmart.clone.dto.ProductCreateDto;
import com.dmart.clone.model.ProductImage;
import com.dmart.clone.service.ProductImageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

	private final AdminProductService productService;
	private final ProductImageService productimageService;

	public AdminProductController(AdminProductService productService, ProductImageService productimageService) {

		this.productService = productService;
		this.productimageService = productimageService;
	}

	@PostMapping
	public ResponseEntity<IdResponse> createProduct(@RequestBody @Valid ProductCreateDto request,
			UriComponentsBuilder uri) {

		Long id = productService.createProduct(request);
		return ResponseEntity.created(uri.path("/api/products/{id}").buildAndExpand(id).toUri())
				.body(new IdResponse(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Void> updateProduct(@PathVariable Long id, @RequestBody @Valid ProductCreateDto request) {
		productService.updateProduct(id, request);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
		productService.deleteProduct(id);
		return ResponseEntity.noContent().build();
	}

	// Moved image upload to admin (write-only)
	@PostMapping(value = "/{productId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<IdResponse> uploadProductImage(@PathVariable Long productId,
			@RequestPart("file") org.springframework.web.multipart.MultipartFile file,
			@RequestParam(defaultValue = "false") boolean isPrimary) {

		System.out.println("Received file: " + (file != null ? file.getOriginalFilename() : "null"));

		ProductImage image = productimageService.uploadImage(productId, file, isPrimary);
		Long imageId = image.getId();
		return ResponseEntity.ok(new IdResponse(imageId));
	}
}
