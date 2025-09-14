package com.dmart.clone.service;

import java.time.Instant;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dmart.clone.dto.JwtResponse;
import com.dmart.clone.dto.LoginRequest;
import com.dmart.clone.dto.RegisterRequest;
import com.dmart.clone.dto.UserViewDto;
import com.dmart.clone.exception.ConflictException;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Role;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.UserRepository;
import com.dmart.clone.security.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepo;
	private final PasswordEncoder encoder;
	private final JwtUtil jwt;

	public AuthServiceImpl(UserRepository userRepo, PasswordEncoder encoder, JwtUtil jwt) {
		this.userRepo = userRepo;
		this.encoder = encoder;
		this.jwt = jwt;
	}

	@Override
	public JwtResponse login(LoginRequest req) {
		User user = userRepo.findByUsername(req.username())
				.orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + req.username()));

		if (!encoder.matches(req.password(), user.getPassword())) {
			throw new RuntimeException("Bad credentials");
		}

		String token = jwt.generateToken(user.getUsername(), user.getRole().name());
		long expiry = jwt.extractExpiration(token).getTime();

		return new JwtResponse(token, user.getUsername(), user.getRole().name(), expiry);
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
}
