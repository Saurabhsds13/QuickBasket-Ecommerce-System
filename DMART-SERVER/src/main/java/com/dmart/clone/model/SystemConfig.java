package com.dmart.clone.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "system_config")

public class SystemConfig {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(unique = true, length = 100)
	private String configKey;
	@Lob
	private String configValue;
	private Instant updatedAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getConfigKey() {
		return configKey;
	}

	public void setConfigKey(String configKey) {
		this.configKey = configKey;
	}

	public String getConfigValue() {
		return configValue;
	}

	public void setConfigValue(String configValue) {
		this.configValue = configValue;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	public SystemConfig(Long id, String configKey, String configValue, Instant updatedAt) {
		super();
		this.id = id;
		this.configKey = configKey;
		this.configValue = configValue;
		this.updatedAt = updatedAt;
	}

	public SystemConfig() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "SystemConfig [id=" + id + ", configKey=" + configKey + ", configValue=" + configValue + ", updatedAt="
				+ updatedAt + "]";
	}
}
