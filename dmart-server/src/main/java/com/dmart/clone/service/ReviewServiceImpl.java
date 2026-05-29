package com.dmart.clone.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.ReviewCreateDto;
import com.dmart.clone.dto.ReviewViewDto;
import com.dmart.clone.exception.ConflictException;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductReview;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.ProductRepository;
import com.dmart.clone.repository.ProductReviewRepository;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewServiceImpl(ProductReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    @Override
    public ReviewViewDto addReview(User user, ReviewCreateDto dto) {
        Product product = productRepository.findById(dto.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id=" + dto.productId()));

        if (reviewRepository.existsByUserAndProduct(user, product)) {
            throw new ConflictException("You have already reviewed this product");
        }

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(dto.rating());
        review.setComment(dto.comment());
        review.setCreatedAt(Instant.now());

        ProductReview saved = reviewRepository.save(review);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewViewDto> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageRating(Long productId) {
        Double avg = reviewRepository.getAverageRatingByProductId(productId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    @Override
    public void deleteReview(User user, Long reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    private ReviewViewDto mapToDto(ProductReview review) {
        return new ReviewViewDto(
                review.getId(),
                review.getProduct().getId(),
                review.getUser().getUsername(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
