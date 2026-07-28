package com.dmart.clone.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dmart.clone.model.CartItem;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.User;

public interface CartRepository extends JpaRepository<CartItem, Long> {

	@Query("SELECT c FROM CartItem c JOIN FETCH c.product WHERE c.user = :user")
	List<CartItem> findByUser(@Param("user") User user);

	@Query("SELECT c FROM CartItem c WHERE c.user = :user AND c.product = :product")
	List<CartItem> findAllByUserAndProduct(@Param("user") User user, @Param("product") Product product);

	default Optional<CartItem> findByUserAndProduct(User user, Product product) {
		List<CartItem> items = findAllByUserAndProduct(user, product);
		if (items.isEmpty()) return Optional.empty();
		return Optional.of(items.get(0));
	}

	@Modifying
	@Query("DELETE FROM CartItem c WHERE c.user = :user AND c.product = :product")
	void deleteAllByUserAndProduct(@Param("user") User user, @Param("product") Product product);

	@Modifying
	@Query("DELETE FROM CartItem c WHERE c.user = :user")
	void deleteAllByUser(@Param("user") User user);
}
