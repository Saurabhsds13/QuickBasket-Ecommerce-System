package com.dmart.clone.service;

import java.time.Instant;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.JwtResponse;
import com.dmart.clone.dto.LoginRequest;
import com.dmart.clone.dto.RegisterRequest;
import com.dmart.clone.dto.UserViewDto;
import com.dmart.clone.exception.ConflictException;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.RefreshToken;
import com.dmart.clone.model.Role;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.UserRepository;
import com.dmart.clone.security.JwtUtil;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepo;
	private final PasswordEncoder encoder;
	private final JwtUtil jwt;
	private final RefreshTokenService refreshTokenService;

	public AuthServiceImpl(UserRepository userRepo, PasswordEncoder encoder, JwtUtil jwt,
						   RefreshTokenService refreshTokenService) {
		this.userRepo = userRepo;
		this.encoder = encoder;
		this.jwt = jwt;
		this.refreshTokenService = refreshTokenService;
	}

	@Override
	public JwtResponse login(LoginRequest req) {
		User user = userRepo.findByUsername(req.username())
				.orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + req.username()));

		if (!encoder.matches(req.password(), user.getPassword())) {
			throw new RuntimeException("Bad credentials");
		}

		if (user.isBlocked()) {
			throw new RuntimeException("Your account has been blocked. Contact support.");
		}

		String token = jwt.generateToken(user.getUsername(), user.getRole().name());
		long expiry = jwt.extractExpiration(token).getTime();

		RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

		return new JwtResponse(token, refreshToken.getToken(), user.getUsername(), user.getRole().name(), expiry);
	}

	@Override
	public UserViewDto registerUser(RegisterRequest req) {

		if (userRepo.existsByUsername(req.username())) {
			throw new ConflictException("Username already exists: " + req.username());
		}
		if (userRepo.existsByEmail(req.email())) {
			throw new ConflictException("Email already registered: " + req.email());
		}

		User u = new User();
		u.setUsername(req.username());
		u.setEmail(req.email());
		u.setPassword(encoder.encode(req.password()));
		u.setPhone(req.phone());
		u.setRole(Role.USER); // always USER
		u.setBlocked(false);
		u.setCreatedAt(Instant.now());
		u.setUpdatedAt(Instant.now());

		User saved = userRepo.save(u);

		return new UserViewDto(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getPhone(), saved.getRole(),
				saved.isBlocked(), saved.getCreatedAt());
	}

	public JwtResponse refreshAccessToken(String refreshTokenStr) {
		RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(refreshTokenStr);
		User user = refreshToken.getUser();

		String newAccessToken = jwt.generateToken(user.getUsername(), user.getRole().name());
		long expiry = jwt.extractExpiration(newAccessToken).getTime();

		return new JwtResponse(newAccessToken, refreshToken.getToken(), user.getUsername(), user.getRole().name(), expiry);
	}

	public void logout(String refreshTokenStr) {
		RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(refreshTokenStr);
		refreshTokenService.deleteByUser(refreshToken.getUser());
	}
}
