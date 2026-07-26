package com.dmart.clone.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.NotificationDto;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Notification;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.NotificationRepository;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<NotificationDto> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndSeenFalse(user);
    }

    @Override
    public void markAsRead(User user, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notification.setSeen(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsRead(user);
    }

    @Override
    public void createNotification(User user, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notification.setSeen(false);
        notification.setCreatedAt(Instant.now());
        notificationRepository.save(notification);
    }

    private NotificationDto toDto(Notification n) {
        return new NotificationDto(n.getId(), n.getMessage(), n.getType(), n.getSeen(), n.getCreatedAt());
    }
}
