package com.dmart.clone.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dmart.clone.model.Order;
import com.dmart.clone.model.ReturnRequest;
import com.dmart.clone.model.User;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {

    List<ReturnRequest> findByOrderUserOrderByCreatedAtDesc(User user);

    Optional<ReturnRequest> findByOrder(Order order);

    boolean existsByOrder(Order order);
}
