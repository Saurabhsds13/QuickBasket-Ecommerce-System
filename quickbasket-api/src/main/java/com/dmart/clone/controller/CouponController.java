package com.dmart.clone.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.CouponApplyResponse;
import com.dmart.clone.model.User;
import com.dmart.clone.service.CouponService;
import com.dmart.clone.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user/coupons")
public class CouponController {

    private final CouponService couponService;
    private final UserService userService;

    public CouponController(CouponService couponService, UserService userService) {
        this.couponService = couponService;
        this.userService = userService;
    }

    @PostMapping("/apply")
    public ResponseEntity<CouponApplyResponse> applyCoupon(@RequestParam String code, HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        return ResponseEntity.ok(couponService.applyCoupon(user, code));
    }
}
