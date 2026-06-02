package com.dmart.clone.dto;

public record OrderItemDto(
		Long id,
		Long productId,
		String productName,
		String productImage,
		Integer quantity,
		Double price) {
}
