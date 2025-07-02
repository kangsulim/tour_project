package com.example.tour_backend.service;

import com.example.tour_backend.domain.comment.Comment;
import com.example.tour_backend.domain.comment.CommentRepository;
import com.example.tour_backend.domain.thread.Thread;
import com.example.tour_backend.domain.thread.ThreadRepository;
import com.example.tour_backend.dto.comment.CommentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final ThreadRepository threadRepository;

    @Transactional
    public CommentDto addComment(CommentDto dto) {
        Thread thread = threadRepository.findById(dto.getThreadId())
                .orElseThrow(() -> new RuntimeException("게시물이 존재하지 않습니다."));

        Comment comment = Comment.builder()
                .thread(thread)
                .comment(dto.getComment())
                .author(dto.getAuthor())
                .build();

        commentRepository.save(comment);

        dto.setCommentId(comment.getCommentId());
        dto.setCreateDate(comment.getCreateDate());
        dto.setModifiedDate(comment.getModifiedDate());

        return dto;
    }

    @Transactional(readOnly = true) // 댓글 목록 조회 6/30
    public List<CommentDto> getComments(Long threadId) {
        return commentRepository.findByThread_ThreadId(threadId)
                .stream()
                .map(comment -> {
                    CommentDto dto = new CommentDto();
                    dto.setCommentId(comment.getCommentId());
                    dto.setThreadId(comment.getThread().getThreadId());
                    dto.setAuthor(comment.getAuthor());
                    dto.setComment(comment.getComment());
                    dto.setCreateDate(comment.getCreateDate());
                    dto.setModifiedDate(comment.getModifiedDate());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 댓글 수정 6/30
    @Transactional
    public CommentDto updateComment(Long commentId, CommentDto dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글이 존재하지 않습니다."));

        // (필요시) 작성자 검증도 넣을 수 있음 (SecurityContextHolder에서 로그인 정보 받아와서 비교)

        comment.setComment(dto.getComment());
        Comment updated = commentRepository.save(comment);

        dto.setCreateDate(updated.getCreateDate());
        dto.setModifiedDate(updated.getModifiedDate());

        return dto;
    }
    // 댓글 삭제 6/30
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글이 존재하지 않습니다."));

        // (필요시) 작성자 검증 추가

        commentRepository.delete(comment);
    }
}
