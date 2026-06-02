package com.dmart.clone.dto;

public record CartItemViewDto(
		Long id,
		Long productId,
		String productName,
		String productDescription,
		Double productPrice,
		Integer productStockQuantity,
		String primaryImageUrl,
		Integer quantity) {
}
