package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.WishlistItemDto;
import com.dmart.clone.model.User;

public interface WishlistService {

    List<WishlistItemDto> getWishlist(User user);

    WishlistItemDto addToWishlist(User user, Long productId);

    void removeFromWishlist(User user, Long productId);

    boolean isInWishlist(User user, Long productId);
}
