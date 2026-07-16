package com.dmart.clone.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.RegisterRequest;
import com.dmart.clone.dto.UserProfileUpdateDto;
import com.dmart.clone.dto.UserViewDto;
import com.dmart.clone.model.Role;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.UserRepository;
import com.dmart.clone.repository.CartRepository;
import com.dmart.clone.repository.OrderRepository;
import com.dmart.clone.repository.PaymentRepository;
import com.dmart.clone.repository.RefreshTokenRepository;
import com.dmart.clone.repository.WishlistRepository;
import com.dmart.clone.repository.AddressRepository;
import com.dmart.clone.repository.ProductReviewRepository;
import com.dmart.clone.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
@Transactional
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private RefreshTokenRepository refreshTokenRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private WishlistRepository wishlistRepository;

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private ProductReviewRepository productReviewRepository;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private PasswordEncoder passwordEncoder;

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
		user.setCreatedAt(Instant.now());
		user.setUpdatedAt(Instant.now());

		User saved = userRepository.save(user);

		return new UserViewDto(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getPhone(), saved.getRole(),
				saved.isBlocked(), saved.getCreatedAt());
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
		String header = request.getHeader("Authorization");
		if (header == null || !header.startsWith("Bearer ")) {
			throw new RuntimeException("Missing or invalid Authorization header");
		}

		String token = header.substring(7);
		String username = jwtUtil.extractUsername(token);

		return userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("User not found: " + username));
	}

	@Override
	public UserViewDto updateProfile(User user, UserProfileUpdateDto dto) {
		if (dto.email() != null && !dto.email().isBlank()) {
			// Check if email is already taken by another user
			userRepository.findByEmail(dto.email()).ifPresent(existing -> {
				if (!existing.getId().equals(user.getId())) {
					throw new RuntimeException("Email already in use by another account");
				}
			});
			user.setEmail(dto.email());
		}

		if (dto.phone() != null && !dto.phone().isBlank()) {
			user.setPhone(dto.phone());
		}

		if (dto.newPassword() != null && !dto.newPassword().isBlank()) {
			if (dto.currentPassword() == null || !passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
				throw new RuntimeException("Current password is incorrect");
			}
			user.setPassword(passwordEncoder.encode(dto.newPassword()));
		}

		user.setUpdatedAt(Instant.now());
		User saved = userRepository.save(user);

		return new UserViewDto(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getPhone(), saved.getRole(),
				saved.isBlocked(), saved.getCreatedAt());
	}

	@Override
	public void deleteAccount(User user) {
		// Clean up all related data before deleting user
		cartRepository.deleteAll(cartRepository.findByUser(user));
		wishlistRepository.deleteAll(wishlistRepository.findByUser(user));
		addressRepository.deleteAll(addressRepository.findByUser(user));
		productReviewRepository.deleteAll(productReviewRepository.findByUser(user));
		refreshTokenRepository.deleteByUser(user);

		// Delete payments first (they reference orders), then orders
		var orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
		if (!orders.isEmpty()) {
			paymentRepository.deleteAll(paymentRepository.findByOrderIn(orders));
			orderRepository.deleteAll(orders);
		}

		// Finally delete the user
		userRepository.delete(user);
	}
}
