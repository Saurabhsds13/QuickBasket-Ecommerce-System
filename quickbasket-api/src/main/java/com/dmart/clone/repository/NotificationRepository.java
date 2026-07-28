package com.dmart.clone.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dmart.clone.model.Notification;
import com.dmart.clone.model.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    long countByUserAndSeenFalse(User user);

    @Modifying
    @Query("UPDATE Notification n SET n.seen = true WHERE n.user = :user AND n.seen = false")
    void markAllAsRead(@Param("user") User user);
}
