package com.example.tour_backend.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity  //없으면 JPA가 이 클래스를 테이블로 인식하지 않아서 DB와 연동 안 됨
@Table(name = "users")  //테이블 이름을 직접 지정 (기본은 클래스 이름 소문자)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder //.builder() 방식으로 객체 생성 가능 (유연한 생성 패턴)

public class User {
    @Id //기본 키(PK) 역할. 각 사용자마다 고유한 값
    @GeneratedValue(strategy = GenerationType.IDENTITY)  //자동으로 번호를 붙여줌 (1, 2, 3...)
    private Long userId;
    //* 이 필드가 없으면 JPA가 어떤 열을 기준으로 사용자 식별할지 몰라서 저장 자체가 불가능


    @Column(nullable = false, unique = true)
    private String username; // 로그인용 아이디 또는 이메일 등
    /*로그인 ID 역할 (이메일일 수도 있고, 아이디일 수도 있음)
     nullable = false → 비어 있으면 저장 안 됨
     unique = true → 중복된 사용자명은 저장 불가능
     없으면 로그인 구분이 안 됨, 중복 사용자 생김 */

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column (nullable = false, unique = true)
    private String nickname;

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime modifiedDate;

    @Builder
    public User(String password, String name, String email, String phone, String nickname,
                LocalDateTime createDate, LocalDateTime modifiedDate /*List<Tour> tours, List<Thread> threads*/) {
        this.password = password;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.nickname = nickname;
        this.createDate = createDate;
        this.modifiedDate = modifiedDate;
//        this.tours = tours;
//        this.threads = threads;
    }
}