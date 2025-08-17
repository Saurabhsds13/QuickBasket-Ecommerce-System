package com.dmart.clone.dto;

public record ProductViewDto(Long id, String name, String description, String categoryName, Double price,
		Integer stockQuantity, String primaryImageUrl) {
}
