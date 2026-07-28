package com.dmart.clone.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductReview;
import com.dmart.clone.model.User;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    List<ProductReview> findByProduct(Product product);

    List<ProductReview> findByProductId(Long productId);

    Optional<ProductReview> findByUserAndProduct(User user, Product product);

    boolean existsByUserAndProduct(User user, Product product);

    List<ProductReview> findByUser(User user);

    @Query("SELECT AVG(r.rating) FROM ProductReview r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(Long productId);

    @Query("SELECT COUNT(r) FROM ProductReview r WHERE r.product.id = :productId")
    Long getReviewCountByProductId(Long productId);
}
