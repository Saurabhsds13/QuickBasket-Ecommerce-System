package com.dmart.clone.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dmart.clone.model.CartItem;
import com.dmart.clone.model.Order;
import com.dmart.clone.model.OrderItem;
import com.dmart.clone.model.OrderStatus;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.CartRepository;
import com.dmart.clone.repository.OrderRepository;

@Service
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

		List<OrderItem> orderItems = cartItems.stream().map(ci -> {

			OrderItem item = new OrderItem();
			item.setProduct(ci.getProduct());
			item.setQuantity(ci.getQuantity());
			item.setPrice(ci.getProduct().getPrice() * ci.getQuantity());
			return item;

		}).toList();

		order.setOrderItems(orderItems);
		order.setTotalPrice(orderItems.stream().mapToDouble(OrderItem::getPrice).sum());
		order.setStatus(OrderStatus.PENDING);

		orderRepository.save(order);
		cartRepository.deleteAll(cartItems); // clear cart after order
		return order;
	}
}
