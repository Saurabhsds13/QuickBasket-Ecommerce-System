package com.dmart.clone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dmart.clone.dto.RegisterRequest;
import com.dmart.clone.dto.UserViewDto;
import com.dmart.clone.model.Role;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.UserRepository;
import com.dmart.clone.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private PasswordEncoder passwordEncoder; // configure a BCryptPasswordEncoder bean

	@Override
	public UserViewDto register(RegisterRequest request) {
		if (userRepository.existsByUsername(request.username()) || userRepository.existsByEmail(request.email())) {
			throw new RuntimeException("User already exists!");
		}

		User user = new User();
		user.setUsername(request.username());
		user.setEmail(request.email());
		user.setPassword(passwordEncoder.encode(request.password()));
		user.setPhone(request.phone());
		user.setRole(Role.USER);

		User saved = userRepository.save(user);

		return new UserViewDto(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getPhone(), saved.getRole(),
				user.isBlocked(), user.getCreatedAt());
	}

	@Override
	public UserViewDto getUserByUsername(String username) {

		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
		Role role = user.getRole();
		return new UserViewDto(user.getId(), user.getUsername(), user.getEmail(), user.getPhone(), role,
				user.isBlocked(), user.getCreatedAt());
	}

	@Override
	public User getCurrentUser(HttpServletRequest request) {
		String header = request.getHeader("Authorization").substring(7);
		if (header == null || !header.startsWith("Bearer ")) {
			throw new RuntimeException("Missing or invalid Authorization header");
		}

		String token = header.substring(7);
		String username = jwtUtil.extractUsername(token);

		return userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("User not found: " + username));
	}

}
