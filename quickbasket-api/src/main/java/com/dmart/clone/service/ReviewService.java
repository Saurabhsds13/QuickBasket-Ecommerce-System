package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.ReviewCreateDto;
import com.dmart.clone.dto.ReviewViewDto;
import com.dmart.clone.model.User;

public interface ReviewService {

    ReviewViewDto addReview(User user, ReviewCreateDto dto);

    List<ReviewViewDto> getReviewsByProduct(Long productId);

    Double getAverageRating(Long productId);

    void deleteReview(User user, Long reviewId);
}
