package com.dmart.clone.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.NotificationDto;
import com.dmart.clone.model.User;
import com.dmart.clone.service.NotificationService;
import com.dmart.clone.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getMyNotifications(HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        List<NotificationDto> notifications = notificationService.getUserNotifications(user);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        long count = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        notificationService.markAsRead(user, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        notificationService.markAllAsRead(user);
        return ResponseEntity.noContent().build();
    }
}
