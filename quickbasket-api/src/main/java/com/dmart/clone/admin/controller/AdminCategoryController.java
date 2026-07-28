package com.dmart.clone.admin.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.dmart.clone.model.Category;
import com.dmart.clone.repository.CategoryRepository;
import com.dmart.clone.service.StorageService;

@RestController
@RequestMapping("/api/admin/categories")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {

	private final CategoryRepository categoryRepository;
	private final StorageService storageService;

	public AdminCategoryController(CategoryRepository categoryRepository, StorageService storageService) {
		this.categoryRepository = categoryRepository;
		this.storageService = storageService;
	}

	@PostMapping
	public ResponseEntity<Category> createCategory(@RequestBody Category category) {
		if (categoryRepository.findByName(category.getName()).isPresent()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
		Category saved = categoryRepository.save(category);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
		return categoryRepository.findById(id).map(existing -> {
			if (category.getName() != null) existing.setName(category.getName());
			if (category.getDescription() != null) existing.setDescription(category.getDescription());
			if (category.getImageUrl() != null) existing.setImageUrl(category.getImageUrl());
			return ResponseEntity.ok(categoryRepository.save(existing));
		}).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Category> uploadCategoryImage(@PathVariable Long id,
			@RequestPart("file") MultipartFile file) {
		return categoryRepository.findById(id).map(category -> {
			// Delete old image if exists
			if (category.getImageUrl() != null) {
				storageService.delete(category.getImageUrl());
			}
			String imageUrl = storageService.store(file, "categories");
			category.setImageUrl(imageUrl);
			return ResponseEntity.ok(categoryRepository.save(category));
		}).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
		return categoryRepository.findById(id).map(category -> {
			if (category.getImageUrl() != null) {
				storageService.delete(category.getImageUrl());
			}
			categoryRepository.delete(category);
			return ResponseEntity.noContent().<Void>build();
		}).orElse(ResponseEntity.notFound().build());
	}
}
