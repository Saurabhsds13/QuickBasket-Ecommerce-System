package com.dmart.clone.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dmart.clone.model.CartItem;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.User;

public interface CartRepository extends JpaRepository<CartItem, Long> {
	List<CartItem> findByUser(User user);

	Optional<CartItem> findByUserAndProduct(User user, Product product);
}
