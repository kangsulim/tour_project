package com.example.tour_backend.service;


import com.example.tour_backend.config.JwtTokenProvider;
import com.example.tour_backend.domain.user.User;
import com.example.tour_backend.domain.user.UserRepository;
import com.example.tour_backend.dto.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;      // 비밀번호 암호화 검증용
    private final JwtTokenProvider jwtTokenProvider;    // JWT 토큰 생성용 클래스 (직접 구현 필요)

    public JwtResponse login(LoginRequestDto loginRequestDto) {
        //  1) 사용자 조회 (아이디 기준 예시)
        User user = userRepository.findByUsername(loginRequestDto.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        // 2) 비밀번호 검증
        if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        // 3) JWT 토큰 생성
        String token = jwtTokenProvider.createToken(user.getUsername());
        // 4) 토큰 반환
        return new JwtResponse(token,  user.getUserId(), user.getUsername());
    }
    // 회원가입 처리
    @Transactional
    public UserResponseDto registerUser(UserRequestDto requestDto) {
        // 이메일 중복 체크
        if (userRepository.findByEmail(requestDto.getEmail()).isPresent()) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        // 사용자명 중복 체크
        if (userRepository.findByUsername(requestDto.getUsername()).isPresent()) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if (userRepository.findByNickname(requestDto.getNickname()).isPresent()) {
            throw new RuntimeException("이미 존재하는 닉네임입니다.");
        }




        // 비밀번호 암호화해서 저장
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());
        User user = User.builder()
                .username(requestDto.getUsername())
                .password(encodedPassword)  // 나중에 암호화 필요
                .name(requestDto.getName())
                .email(requestDto.getEmail())
                .phone(requestDto.getPhone())
                .nickname(requestDto.getNickname())
                .build();
        userRepository.save(user);


        // 응답 DTO 생성 및 반환
        UserResponseDto dto = new UserResponseDto();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setNickname(user.getNickname());
        dto.setCreateDate(user.getCreateDate());
        dto.setModifiedDate(user.getModifiedDate());
        return dto;
    }
    // 회원정보 수정 추가
    @Transactional
    public UserResponseDto updateUser(Long userId, UserUpdateRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        user.setName(request.getName());
        user.setNickname(request.getNickname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        userRepository.save(user);

        return new UserResponseDto(user);
    }

    // 회원 조회
    public Optional<UserResponseDto> getUser(Long userId) {
        return userRepository.findById(userId)
                .map(user -> {
                    UserResponseDto dto = new UserResponseDto();
                    dto.setUserId(user.getUserId());
                    dto.setUsername(user.getUsername());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    dto.setPhone(user.getPhone());
                    dto.setNickname(user.getNickname());
                    dto.setCreateDate(user.getCreateDate());
                    dto.setModifiedDate(user.getModifiedDate());
                    return dto;
                });
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()    // DB에서 모든 사용자 조회
                .map(user -> {
                    UserResponseDto dto = new UserResponseDto();
                    dto.setUserId(user.getUserId());
                    dto.setUsername(user.getUsername());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    dto.setPhone(user.getPhone());
                    dto.setNickname(user.getNickname());
                    dto.setCreateDate(user.getCreateDate());
                    dto.setModifiedDate(user.getModifiedDate());
                    return dto;
                })
                .collect(Collectors.toList());
    }

//    // username으로 userId 조회
//    public Long findUserIdByUsername(String username) {
//        return userRepository.findUserIdByUsername(username);
//    }

    public Long findUserIdByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return user.getUserId();
    }

}
