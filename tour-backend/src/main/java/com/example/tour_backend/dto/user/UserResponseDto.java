package com.example.tour_backend.dto.user;


import com.example.tour_backend.domain.user.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponseDto {
    private Long userId;
    private String username;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String nickname;
    private LocalDateTime createDate;
    private LocalDateTime modifiedDate;

    public UserResponseDto() {}

    // User 엔티티를 받아 필드에 값 설정하는 생성자
    public UserResponseDto(User user) {
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.phone = user.getPhone();
        this.nickname = user.getNickname();
        this.createDate = user.getCreateDate();
        this.modifiedDate = user.getModifiedDate();


    }
}
