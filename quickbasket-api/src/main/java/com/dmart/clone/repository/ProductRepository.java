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

	// Best-selling products — ranked by total ordered quantity
	@Query("SELECT oi.product FROM OrderItem oi GROUP BY oi.product ORDER BY SUM(oi.quantity) DESC")
	List<Product> findBestSellingProducts(Pageable pageable);

	// Top-rated products — ranked by average review rating (minimum 1 review)
	@Query("SELECT r.product FROM ProductReview r GROUP BY r.product HAVING COUNT(r) >= 1 ORDER BY AVG(r.rating) DESC")
	List<Product> findTopRatedProducts(Pageable pageable);

}
