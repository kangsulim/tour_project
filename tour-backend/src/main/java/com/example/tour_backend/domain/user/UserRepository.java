package com.example.tour_backend.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository <User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByNickname(String nickname);
    Optional<User> findByName(String name);
    Optional<User> findByEmail(String email);
    Long findUserIdByUsername(String username);     //추가
}