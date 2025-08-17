package com.dmart.clone.dto;

public record ProductCreateDto(String name, String description, Long categoryId, Double price, Integer stockQuantity) {
}
