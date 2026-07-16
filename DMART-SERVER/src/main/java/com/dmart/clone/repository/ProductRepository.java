package com.dmart.clone.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dmart.clone.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

	List<Product> findByCategoryId(Long categoryId);

	@Query(
		value = "SELECT p FROM Product p WHERE " +
			"(:keyword IS NULL OR LOWER(p.name) LIKE CONCAT('%', LOWER(:keyword), '%') OR LOWER(CAST(p.description AS String)) LIKE CONCAT('%', LOWER(:keyword), '%')) " +
			"AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
			"AND (:minPrice IS NULL OR p.price >= :minPrice) " +
			"AND (:maxPrice IS NULL OR p.price <= :maxPrice)",
		countQuery = "SELECT COUNT(p) FROM Product p WHERE " +
			"(:keyword IS NULL OR LOWER(p.name) LIKE CONCAT('%', LOWER(:keyword), '%') OR LOWER(CAST(p.description AS String)) LIKE CONCAT('%', LOWER(:keyword), '%')) " +
			"AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
			"AND (:minPrice IS NULL OR p.price >= :minPrice) " +
			"AND (:maxPrice IS NULL OR p.price <= :maxPrice)"
	)
	Page<Product> searchProducts(@Param("keyword") String keyword, @Param("categoryId") Long categoryId,
			@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice, Pageable pageable);

}
