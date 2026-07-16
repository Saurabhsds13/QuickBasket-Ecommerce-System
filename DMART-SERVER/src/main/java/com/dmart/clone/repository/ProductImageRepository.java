package com.dmart.clone.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

	@Modifying
	@Query("UPDATE ProductImage pi SET pi.isPrimary = false WHERE pi.product.id = :productId")
	void clearPrimaryForProduct(@Param("productId") Long productId);

	List<ProductImage> findByProduct(Product product);
}
