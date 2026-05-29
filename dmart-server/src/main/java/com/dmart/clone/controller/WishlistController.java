package com.dmart.clone.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.WishlistItemDto;
import com.dmart.clone.model.User;
import com.dmart.clone.service.UserService;
import com.dmart.clone.service.WishlistService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;

    public WishlistController(WishlistService wishlistService, UserService userService) {
        this.wishlistService = wishlistService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<WishlistItemDto>> getWishlist(HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        return ResponseEntity.ok(wishlistService.getWishlist(user));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<WishlistItemDto> addToWishlist(@PathVariable Long productId, HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        return ResponseEntity.ok(wishlistService.addToWishlist(user, productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId, HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{productId}/check")
    public ResponseEntity<Boolean> isInWishlist(@PathVariable Long productId, HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        return ResponseEntity.ok(wishlistService.isInWishlist(user, productId));
    }
}
