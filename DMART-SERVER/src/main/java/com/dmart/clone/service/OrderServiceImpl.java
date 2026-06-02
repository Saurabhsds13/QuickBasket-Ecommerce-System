package com.dmart.clone.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.OrderDto;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.CartItem;
import com.dmart.clone.model.Order;
import com.dmart.clone.model.OrderItem;
import com.dmart.clone.model.OrderStatus;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.CartRepository;
import com.dmart.clone.repository.OrderRepository;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private CartRepository cartRepository;

	public Order placeOrder(User user) {
		List<CartItem> cartItems = cartRepository.findByUser(user);
		if (cartItems.isEmpty())
			throw new RuntimeException("Cart is empty");

		Order order = new Order();
		order.setUser(user);
		order.setCreatedAt(Instant.now());
		order.setUpdatedAt(Instant.now());
		order.setStatus(OrderStatus.PENDING);

		List<OrderItem> orderItems = cartItems.stream().map(ci -> {
			OrderItem item = new OrderItem();
			item.setOrder(order);
			item.setProduct(ci.getProduct());
			item.setQuantity(ci.getQuantity());
			item.setPrice(ci.getProduct().getPrice() * ci.getQuantity());
			return item;
		}).toList();

		order.setOrderItems(orderItems);
		order.setTotalPrice(orderItems.stream().mapToDouble(OrderItem::getPrice).sum());

		Order saved = orderRepository.save(order);
		cartRepository.deleteAll(cartItems);
		return saved;
	}

	@Override
	public List<OrderDto> getOrdersByUser(User user) {
		return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
				.map(this::mapToDto)
				.collect(Collectors.toList());
	}

	@Override
	public OrderDto getOrderById(User user, Long orderId) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found with id=" + orderId));

		if (!order.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("You can only view your own orders");
		}

		return mapToDto(order);
	}

	private OrderDto mapToDto(Order order) {
		return new OrderDto(
				order.getId(),
				order.getUser().getUsername(),
				order.getTotalPrice(),
				order.getStatus(),
				order.getCreatedAt(),
				order.getUpdatedAt()
		);
	}
}
