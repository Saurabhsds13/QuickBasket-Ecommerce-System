package com.dmart.clone.admin.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DebugAuthController {

	private static final Logger log = LoggerFactory.getLogger(DebugAuthController.class);

	@GetMapping("/api/debug/me")
	public Map<String, Object> whoAmI() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		if (auth == null) {
			log.warn("No authentication in SecurityContext");
			return Map.of("authenticated", false, "message", "No authentication found in SecurityContext");
		}

		log.info("Auth principal={}, authorities={}", auth.getName(), auth.getAuthorities());

		return Map.of("authenticated", auth.isAuthenticated(), "principal", auth.getPrincipal(), "authorities",
				auth.getAuthorities());
	}
}
