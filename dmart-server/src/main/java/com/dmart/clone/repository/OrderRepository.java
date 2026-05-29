package com.dmart.clone.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dmart.clone.model.Order;
import com.dmart.clone.model.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByUserOrderByCreatedAtDesc(User user);

	Page<Order> findByUser(User user, Pageable pageable);
}
