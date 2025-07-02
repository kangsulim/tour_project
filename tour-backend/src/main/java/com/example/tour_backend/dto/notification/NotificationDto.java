package com.example.tour_backend.dto.notification;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private Long noticeId;
    private Long userId;
    private Long threadId;
    private Long commentId;
    private String message;
    private boolean isRead;
    private LocalDateTime createDate;
}