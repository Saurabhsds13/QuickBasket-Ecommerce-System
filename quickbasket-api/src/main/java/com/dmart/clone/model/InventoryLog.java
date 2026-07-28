package com.dmart.clone.model;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "inventory_logs")
public class InventoryLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id")
	private Product product;

	private Integer changeAmount;

	@Lob
	private String reason;

	private Instant changedAt;

	public InventoryLog() {
	}

	public InventoryLog(Long id, Product product, Integer changeAmount, String reason, Instant changedAt) {
		this.id = id;
		this.product = product;
		this.changeAmount = changeAmount;
		this.reason = reason;
		this.changedAt = changedAt;
	}

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

	public Integer getChangeAmount() {
		return changeAmount;
	}

	public void setChangeAmount(Integer changeAmount) {
		this.changeAmount = changeAmount;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public Instant getChangedAt() {
		return changedAt;
	}

	public void setChangedAt(Instant changedAt) {
		this.changedAt = changedAt;
	}
}
