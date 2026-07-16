package com.dmart.clone.admin.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.model.Category;
import com.dmart.clone.repository.CategoryRepository;

@RestController
@RequestMapping("/api/admin/categories")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {

	private final CategoryRepository categoryRepository;

	public AdminCategoryController(CategoryRepository categoryRepository) {
		super();
		this.categoryRepository = categoryRepository;
	}

	@PostMapping

	public ResponseEntity<Category> createCategory(@RequestBody Category category) {
		if (categoryRepository.findByName(category.getName()).isPresent()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
		Category saved = categoryRepository.save(category);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}
}
