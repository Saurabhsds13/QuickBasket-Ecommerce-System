package com.dmart.clone.controller;

import java.lang.management.ManagementFactory;
import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

	private final DataSource dataSource;
	private final Instant startTime = Instant.now();

	@Value("${spring.application.name}")
	private String appName;

	public HealthController(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	@GetMapping("/actuator/health")
	public ResponseEntity<Map<String, Object>> health() {
		Map<String, Object> response = new LinkedHashMap<>();
		response.put("status", "UP");
		response.put("application", appName);
		response.put("uptime", getUptime());
		response.put("timestamp", Instant.now().toString());

		// Database check
		Map<String, Object> db = new LinkedHashMap<>();
		try (var conn = dataSource.getConnection()) {
			db.put("status", "UP");
			db.put("database", conn.getMetaData().getDatabaseProductName());
			db.put("url", conn.getMetaData().getURL());
		} catch (Exception e) {
			db.put("status", "DOWN");
			db.put("error", e.getMessage());
			response.put("status", "DOWN");
		}
		response.put("database", db);

		// JVM info
		Map<String, Object> jvm = new LinkedHashMap<>();
		Runtime runtime = Runtime.getRuntime();
		jvm.put("maxMemory", formatBytes(runtime.maxMemory()));
		jvm.put("totalMemory", formatBytes(runtime.totalMemory()));
		jvm.put("freeMemory", formatBytes(runtime.freeMemory()));
		jvm.put("availableProcessors", runtime.availableProcessors());
		jvm.put("javaVersion", System.getProperty("java.version"));
		response.put("jvm", jvm);

		String status = (String) response.get("status");
		if ("DOWN".equals(status)) {
			return ResponseEntity.status(503).body(response);
		}
		return ResponseEntity.ok(response);
	}

	private String getUptime() {
		Duration uptime = Duration.between(startTime, Instant.now());
		long days = uptime.toDays();
		long hours = uptime.toHoursPart();
		long minutes = uptime.toMinutesPart();
		long seconds = uptime.toSecondsPart();

		if (days > 0) return String.format("%dd %dh %dm %ds", days, hours, minutes, seconds);
		if (hours > 0) return String.format("%dh %dm %ds", hours, minutes, seconds);
		if (minutes > 0) return String.format("%dm %ds", minutes, seconds);
		return String.format("%ds", seconds);
	}

	private String formatBytes(long bytes) {
		if (bytes >= 1_073_741_824) return String.format("%.1f GB", bytes / 1_073_741_824.0);
		if (bytes >= 1_048_576) return String.format("%.1f MB", bytes / 1_048_576.0);
		return String.format("%.1f KB", bytes / 1024.0);
	}
}
