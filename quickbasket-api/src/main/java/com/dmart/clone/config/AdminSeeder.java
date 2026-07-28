package com.dmart.clone.config;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dmart.clone.model.Role;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.UserRepository;

@Configuration
public class AdminSeeder implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder encoder;

	@Value("${app.admin.username}")
	private String adminUsername;

	@Value("${app.admin.email}")
	private String adminEmail;

	@Value("${app.admin.password}")
	private String adminPassword;

	public AdminSeeder(UserRepository userRepository, PasswordEncoder encoder) {
		this.userRepository = userRepository;
		this.encoder = encoder;
	}

	@Override
	public void run(String... args) {
		userRepository.findByUsername(adminUsername)
				.ifPresentOrElse(user -> System.out.println("ℹ️ Admin already exists: " + user.getUsername()), () -> {
					validatePassword(adminPassword);
					User admin = new User();
					admin.setUsername(adminUsername);
					admin.setEmail(adminEmail);
					admin.setPassword(encoder.encode(adminPassword));
					admin.setRole(Role.ADMIN);
					admin.setBlocked(false);
					admin.setCreatedAt(Instant.now());
					admin.setUpdatedAt(Instant.now());

					userRepository.save(admin);
					System.out.printf("✅ Default admin created: %s%n", adminUsername);
				});
	}

	private void validatePassword(String password) {
		if (password.length() < 8 || !password.matches(".*[A-Z].*") || !password.matches(".*[a-z].*")
				|| !password.matches(".*\\d.*") || !password.matches(".*[@$!%*?&].*")) {
			throw new IllegalArgumentException(
					"⚠️ Admin password is too weak! Must be at least 8 chars with upper, lower, number, and symbol.");
		}
	}
}
