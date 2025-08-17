package com.dmart.clone.admin;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.RegisterRequest;
import com.dmart.clone.dto.UserViewDto;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Role;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.UserRepository;

@Service
@Transactional
public class AdminUserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public AdminUserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		super();
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional(readOnly = true)
	public List<UserViewDto> getAllUsers() {
		return userRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
	}

	/**
	 * Block a user (disable account)
	 */
	public void blockUser(Long userId) {
		User user = getUserOrThrow(userId);
		if (user.getRole() == Role.ADMIN) {
			throw new IllegalStateException("Cannot block another admin");
		}
		user.setBlocked(true);
		userRepository.save(user);
	}

	/**
	 * Unblock a previously blocked user
	 */
	public void unblockUser(Long userId) {
		User user = getUserOrThrow(userId);
		user.setBlocked(false);
		userRepository.save(user);
	}

	/**
	 * Create a new user (can be used to onboard staff)
	 */
	public UserViewDto createUser(RegisterRequest request) {
		if (userRepository.existsByEmail(request.email())) {
			throw new IllegalArgumentException("Email already exists");
		}

		User user = new User();
		user.setUsername(request.username());
		user.setEmail(request.email());
		user.setRole(Role.ADMIN);
		user.setBlocked(false);
		user.setPassword(passwordEncoder.encode(request.password()));
		user.setCreatedAt(Instant.now());

		User savedUser = userRepository.save(user);
		return toDto(savedUser);
	}

	// Helper
	private User getUserOrThrow(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
	}

	private UserViewDto toDto(User user) {
		return new UserViewDto(user.getId(), user.getUsername(), user.getEmail(), user.getPhone(), user.getRole(),
				user.isBlocked(), user.getCreatedAt());
	}
}