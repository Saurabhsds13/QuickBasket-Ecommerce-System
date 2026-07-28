package com.dmart.clone.dto;

public record ProductSearchDto(
        String keyword,
        Long categoryId,
        Double minPrice,
        Double maxPrice,
        String sortBy,       // name, price, createdAt
        String sortDir,      // asc, desc
        int page,
        int size
) {
    public ProductSearchDto {
        if (page < 0) page = 0;
        if (size <= 0) size = 12;
        if (size > 50) size = 50;
        if (sortBy == null || sortBy.isBlank()) sortBy = "createdAt";
        if (sortDir == null || sortDir.isBlank()) sortDir = "desc";
    }
}
