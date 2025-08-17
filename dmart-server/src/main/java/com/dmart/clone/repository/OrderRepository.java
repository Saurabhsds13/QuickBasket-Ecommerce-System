package com.dmart.clone.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dmart.clone.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}
