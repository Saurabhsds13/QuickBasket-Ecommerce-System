package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.CouponApplyResponse;
import com.dmart.clone.dto.CouponDto;
import com.dmart.clone.model.User;

public interface CouponService {

    CouponDto createCoupon(CouponDto dto);

    List<CouponDto> getAllCoupons();

    void deleteCoupon(Long id);

    CouponApplyResponse applyCoupon(User user, String couponCode);
}
