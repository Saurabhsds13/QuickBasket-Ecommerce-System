package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.NotificationDto;
import com.dmart.clone.model.User;

public interface NotificationService {

    List<NotificationDto> getUserNotifications(User user);

    long getUnreadCount(User user);

    void markAsRead(User user, Long notificationId);

    void markAllAsRead(User user);

    void createNotification(User user, String message, String type);
}
