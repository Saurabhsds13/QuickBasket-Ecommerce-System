package com.dmart.clone.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "coupons")
public class Coupon {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, unique = true, length = 50)
	private String code;
	private String discountType; // PERCENTAGE/FLAT

	private Double discountValue;
	private Double minOrderValue;
	private Instant validUntil;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDiscountType() {
		return discountType;
	}

	public void setDiscountType(String discountType) {
		this.discountType = discountType;
	}

	public Double getDiscountValue() {
		return discountValue;
	}

	public void setDiscountValue(Double discountValue) {
		this.discountValue = discountValue;
	}

	public Double getMinOrderValue() {
		return minOrderValue;
	}

	public void setMinOrderValue(Double minOrderValue) {
		this.minOrderValue = minOrderValue;
	}

	public Instant getValidUntil() {
		return validUntil;
	}

	public void setValidUntil(Instant validUntil) {
		this.validUntil = validUntil;
	}

	public Coupon(Long id, String code, String discountType, Double discountValue, Double minOrderValue,
			Instant validUntil) {
		super();
		this.id = id;
		this.code = code;
		this.discountType = discountType;
		this.discountValue = discountValue;
		this.minOrderValue = minOrderValue;
		this.validUntil = validUntil;
	}

	public Coupon() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "Coupon [id=" + id + ", code=" + code + ", discountType=" + discountType + ", discountValue="
				+ discountValue + ", minOrderValue=" + minOrderValue + ", validUntil=" + validUntil + "]";
	}
}