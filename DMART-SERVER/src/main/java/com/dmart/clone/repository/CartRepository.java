package com.dmart.clone.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dmart.clone.model.CartItem;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.User;

public interface CartRepository extends JpaRepository<CartItem, Long> {

	@Query("SELECT c FROM CartItem c JOIN FETCH c.product WHERE c.user = :user")
	List<CartItem> findByUser(@Param("user") User user);

	Optional<CartItem> findByUserAndProduct(User user, Product product);
}
