package com.dmart.clone.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_images")
public class ProductImage {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@Column(name = "image_url", nullable = false, length = 500)
	private String imageUrl; // URL or path to image file

	@Column(name = "is_primary")
	private Boolean isPrimary = false; // primary thumbnail

	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public Boolean getIsPrimary() {
		return isPrimary;
	}

	public void setIsPrimary(Boolean isPrimary) {
		this.isPrimary = isPrimary;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public ProductImage(Long id, Product product, String imageUrl, Boolean isPrimary, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.product = product;
		this.imageUrl = imageUrl;
		this.isPrimary = isPrimary;
		this.createdAt = createdAt;
	}

	public ProductImage() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "ProductImage [id=" + id + ", product=" + product + ", imageUrl=" + imageUrl + ", isPrimary=" + isPrimary
				+ ", createdAt=" + createdAt + "]";
	}

}