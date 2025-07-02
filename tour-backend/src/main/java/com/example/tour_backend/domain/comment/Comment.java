package com.example.tour_backend.domain.comment;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.example.tour_backend.domain.thread.Thread;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@NoArgsConstructor
@Getter
@Setter
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "threadId", nullable = false)
    private Thread thread;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private String author;

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime modifiedDate;

    @Builder
    public Comment(Thread thread, String comment, String author,
                   LocalDateTime createDate, LocalDateTime modifiedDate) {
        this.thread = thread;
        this.comment = comment;
        this.author = author;
        this.createDate = createDate;
        this.modifiedDate = modifiedDate;
    }
}



