package com.dmart.clone.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dmart.clone.model.Order;
import com.dmart.clone.model.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

	@Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product WHERE o.user = :user ORDER BY o.createdAt DESC")
	List<Order> findByUserOrderByCreatedAtDesc(@Param("user") User user);

	@Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product WHERE o.id = :id")
	Optional<Order> findByIdWithItems(@Param("id") Long id);

	Optional<Order> findByOrderNumber(String orderNumber);

	Page<Order> findByUser(User user, Pageable pageable);
}
