package com.dmart.clone.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.CouponApplyResponse;
import com.dmart.clone.dto.CouponDto;
import com.dmart.clone.exception.ConflictException;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.CartItem;
import com.dmart.clone.model.Coupon;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.CartRepository;
import com.dmart.clone.repository.CouponRepository;

@Service
@Transactional
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CartRepository cartRepository;

    public CouponServiceImpl(CouponRepository couponRepository, CartRepository cartRepository) {
        this.couponRepository = couponRepository;
        this.cartRepository = cartRepository;
    }

    @Override
    public CouponDto createCoupon(CouponDto dto) {
        if (couponRepository.existsByCode(dto.code())) {
            throw new ConflictException("Coupon code already exists: " + dto.code());
        }

        Coupon coupon = new Coupon();
        coupon.setCode(dto.code().toUpperCase());
        coupon.setDiscountType(dto.discountType().toUpperCase());
        coupon.setDiscountValue(dto.discountValue());
        coupon.setMinOrderValue(dto.minOrderValue());
        coupon.setValidUntil(dto.validUntil());

        Coupon saved = couponRepository.save(coupon);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("Coupon not found with id=" + id);
        }
        couponRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponApplyResponse applyCoupon(User user, String couponCode) {
        Coupon coupon = couponRepository.findByCode(couponCode.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid coupon code: " + couponCode));

        // Check expiry
        if (coupon.getValidUntil() != null && coupon.getValidUntil().isBefore(Instant.now())) {
            throw new RuntimeException("Coupon has expired");
        }

        // Calculate cart total
        List<CartItem> cartItems = cartRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double cartTotal = cartItems.stream()
                .mapToDouble(ci -> ci.getProduct().getPrice() * ci.getQuantity())
                .sum();

        // Check minimum order value
        if (coupon.getMinOrderValue() != null && cartTotal < coupon.getMinOrderValue()) {
            throw new RuntimeException("Minimum order value of " + coupon.getMinOrderValue() + " not met. Current total: " + cartTotal);
        }

        // Calculate discount
        double discountAmount;
        if ("PERCENTAGE".equals(coupon.getDiscountType())) {
            discountAmount = cartTotal * (coupon.getDiscountValue() / 100.0);
        } else {
            discountAmount = coupon.getDiscountValue();
        }

        // Discount cannot exceed cart total
        discountAmount = Math.min(discountAmount, cartTotal);
        double finalTotal = cartTotal - discountAmount;

        return new CouponApplyResponse(
                coupon.getCode(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                cartTotal,
                Math.round(discountAmount * 100.0) / 100.0,
                Math.round(finalTotal * 100.0) / 100.0
        );
    }

    private CouponDto mapToDto(Coupon coupon) {
        return new CouponDto(
                coupon.getId(),
                coupon.getCode(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                coupon.getMinOrderValue(),
                coupon.getValidUntil()
        );
    }
}
