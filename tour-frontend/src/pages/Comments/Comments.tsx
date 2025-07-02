import React, { useEffect, useState, useContext } from 'react';
import { getComments, postComment, updateComment, deleteComment } from '../../services/commentApi';
import { Comment, CommentRequest } from '../../types/comment';
import styles from './Comments.module.css';
import { AuthContext } from '../../context/AuthContext';

interface CommentsProps {
  threadId: number;  // 댓글을 가져올 게시글(스레드) ID
}

const Comments: React.FC<CommentsProps> = ({ threadId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  // 댓글 목록 불러오기 함수 - 여러 곳에서 사용하므로 useEffect 밖에 선언
  const fetchComments = React.useCallback(async () => {
    try {
      const data = await getComments(threadId);
      setComments(data);
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
    }
  }, [threadId]);
  
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const requestData: CommentRequest = {
      comment: newComment.trim(),
    };

    try {
      const newData = await postComment(threadId, requestData);
      setComments((prev) => [...prev, newData]);
      setNewComment('');
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      alert('댓글 등록에 실패했습니다. 로그인 상태를 확인해주세요.');
    }
  };

  // 댓글 수정 시작
  const handleEdit = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  // 댓글 수정 저장
  const handleSaveEdit = async (commentId: number) => {
    if (!editingContent.trim()) {
      alert('댓글 내용을 입력하세요.');
      return;
    }
    try {
      await updateComment(threadId, commentId, { comment: editingContent.trim() });
      await fetchComments();
      setEditingCommentId(null);
      setEditingContent('');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    const confirmed = window.confirm('이 댓글을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await deleteComment(threadId, commentId);
      await fetchComments();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  return (
    <div className={styles.commentSection}>
      <h3>댓글 ({comments.length})</h3>
      <ul className={styles.commentList}>
        {comments.map((comment) => (
          <li key={comment.commentId} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <span className={styles.author}>{comment.author}</span>
              <span className={styles.date}>{new Date(comment.createDate).toLocaleString()}</span>
            </div>

            {/* 수정 중인 댓글은 textarea로 변경, 아니면 일반 텍스트 */}
            {editingCommentId === comment.commentId ? (
              <>
                <textarea
                  className={styles.editTextarea}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <div className={styles.actions}>
                  <button onClick={() => handleSaveEdit(comment.commentId)} className={styles.saveBtn}>
                    저장
                  </button>
                  <button onClick={handleCancelEdit} className={styles.cancelBtn}>
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className={styles.content}>{comment.comment}</p>
                {user?.username === comment.author && (
                  <div className={styles.actions}>
                    <button onClick={() => handleEdit(comment.commentId, comment.comment)} className={styles.editBtn}>
                      수정
                    </button>
                    <button onClick={() => handleDelete(comment.commentId)} className={styles.deleteBtn}>
                      삭제
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className={styles.textarea}
          />
          <button type="submit" className={styles.submitButton}>
            댓글 작성
          </button>
        </form>
      ) : (
        <p className={styles.loginNotice}>로그인 후 댓글을 작성할 수 있습니다.</p>
      )}
    </div>
  );
};

export default Comments;
