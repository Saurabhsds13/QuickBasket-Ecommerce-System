package com.dmart.clone.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
	List<ProductImage> findByProduct(Product product);
}
