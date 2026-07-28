package com.dmart.clone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.UserProfileUpdateDto;
import com.dmart.clone.dto.UserViewDto;
import com.dmart.clone.model.User;
import com.dmart.clone.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping("/{username}")
	public UserViewDto getUser(@PathVariable String username) {
		return userService.getUserByUsername(username);
	}

	@GetMapping("/me")
	public ResponseEntity<UserViewDto> getMyProfile(HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		UserViewDto dto = new UserViewDto(user.getId(), user.getUsername(), user.getEmail(),
				user.getPhone(), user.getRole(), user.isBlocked(), user.getCreatedAt());
		return ResponseEntity.ok(dto);
	}

	@PutMapping("/me")
	public ResponseEntity<UserViewDto> updateProfile(@RequestBody @Valid UserProfileUpdateDto dto,
													 HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		return ResponseEntity.ok(userService.updateProfile(user, dto));
	}

	@DeleteMapping("/me")
	public ResponseEntity<Void> deleteAccount(HttpServletRequest request) {
		User user = userService.getCurrentUser(request);
		userService.deleteAccount(user);
		return ResponseEntity.noContent().build();
	}
}