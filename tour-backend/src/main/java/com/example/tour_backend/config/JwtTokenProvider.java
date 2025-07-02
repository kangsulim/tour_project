package com.example.tour_backend.config;

import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

@Component
public class JwtTokenProvider {
    private final String secretKey = "4XGd0F6phiouDCLWtZCSdR2TipfvvGG+s9tpYBkabiU="; // 실제 서비스에선 환경변수나 config로 관리하세요
    private final long validityInMilliseconds = 3600000; // 1시간

    public String createToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }
}