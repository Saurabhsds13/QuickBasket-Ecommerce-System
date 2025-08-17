package com.dmart.clone.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.OrderDto;
import com.dmart.clone.model.OrderStatus;

@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

	@Autowired
	private AdminOrderService adminOrderService;

	@GetMapping
	public ResponseEntity<Page<OrderDto>> getAllOrders(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {

		Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<OrderDto> orders = adminOrderService.getAllOrders(pageable);
		return ResponseEntity.ok(orders);
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
		OrderDto updated = adminOrderService.updateOrderStatus(id, status);
		return ResponseEntity.ok(updated);
	}
}