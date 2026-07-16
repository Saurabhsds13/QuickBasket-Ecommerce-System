package com.dmart.clone.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.JwtResponse;
import com.dmart.clone.dto.LoginRequest;
import com.dmart.clone.dto.RefreshTokenRequest;
import com.dmart.clone.dto.RegisterRequest;
import com.dmart.clone.service.AuthServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthServiceImpl authService;

	public AuthController(AuthServiceImpl authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest req) {
		return ResponseEntity.ok(authService.login(req));
	}

	@PostMapping("/register")
	public ResponseEntity<Void> register(@RequestBody @Valid RegisterRequest req) {
		authService.registerUser(req);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/refresh")
	public ResponseEntity<JwtResponse> refreshToken(@RequestBody @Valid RefreshTokenRequest req) {
		JwtResponse response = authService.refreshAccessToken(req.refreshToken());
		return ResponseEntity.ok(response);
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(@RequestBody @Valid RefreshTokenRequest req) {
		authService.logout(req.refreshToken());
		return ResponseEntity.ok().build();
	}
}
