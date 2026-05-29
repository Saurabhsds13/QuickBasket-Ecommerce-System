package com.dmart.clone.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.ReviewCreateDto;
import com.dmart.clone.dto.ReviewViewDto;
import com.dmart.clone.model.User;
import com.dmart.clone.service.ReviewService;
import com.dmart.clone.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    public ReviewController(ReviewService reviewService, UserService userService) {
        this.reviewService = reviewService;
        this.userService = userService;
    }

    // Public - anyone can view reviews
    @GetMapping("/public/products/{productId}/reviews")
    public ResponseEntity<List<ReviewViewDto>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    // Public - get average rating
    @GetMapping("/public/products/{productId}/rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getAverageRating(productId));
    }

    // Authenticated - add a review
    @PostMapping("/user/reviews")
    public ResponseEntity<ReviewViewDto> addReview(@RequestBody @Valid ReviewCreateDto dto,
                                                   HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        return ResponseEntity.ok(reviewService.addReview(user, dto));
    }

    // Authenticated - delete own review
    @DeleteMapping("/user/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId, HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        reviewService.deleteReview(user, reviewId);
        return ResponseEntity.noContent().build();
    }
}
