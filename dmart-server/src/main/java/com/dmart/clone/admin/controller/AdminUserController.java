package com.dmart.clone.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.admin.service.AdminUserService;
import com.dmart.clone.dto.RegisterRequest;
import com.dmart.clone.dto.UserViewDto;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

	private final AdminUserService adminUserService;

	public AdminUserController(AdminUserService adminUserService) {
		this.adminUserService = adminUserService;
	}

	@GetMapping
	public ResponseEntity<List<UserViewDto>> getAllUsers() {
		return ResponseEntity.ok(adminUserService.getAllUsers());
	}

	@PostMapping
	public ResponseEntity<UserViewDto> createUser(@RequestBody RegisterRequest request) {
		return ResponseEntity.ok(adminUserService.createUser(request));
	}

	@PutMapping("/{id}/block")
	public ResponseEntity<Void> blockUser(@PathVariable Long id) {
		adminUserService.blockUser(id);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{id}/unblock")
	public ResponseEntity<Void> unblockUser(@PathVariable Long id) {
		adminUserService.unblockUser(id);
		return ResponseEntity.ok().build();
	}
}
