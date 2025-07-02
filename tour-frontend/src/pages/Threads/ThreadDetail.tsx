// ThreadDetail.tsx — MUI 스타일을 TravelPlan 테마에 맞춰 확장 적용
import {
  Box,
  Typography,
  Button,
  TextField,
  Link,
  IconButton,
  Stack,
  Chip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getThreadWithLikeStatus, deleteThread, likeThread, updateThread } from '../../services/threadApi'; 
import { Thread, ThreadRequest } from '../../types/thread';
import { AuthContext } from '../../context/AuthContext';

const ThreadDetail = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Omit<ThreadRequest, 'userId'>>({
    title: '',
    content: '',
    author: '',
    pdfPath: '',
    area: ''
  });


    // 수정추가: 수정 모드 여부 상태
    const [isEditing, setIsEditing] = useState(false);

    // 수정추가: 수정 입력 폼 상태 (초기값은 비어 있음)
    const [editForm, setEditForm] = useState<Omit<ThreadRequest, 'userId'>>({
      title: '',
      content: '',
      author: '',
      pdfPath: '',
      area: '',
    });

  // ---------------------- [게시글 상세 조회] ----------------------
  useEffect(() => { //7/2
    if (!threadId || !user) return;

    getThreadWithLikeStatus(Number(threadId), user.userId) // threadId 기반으로 게시글 조회
      .then(data => {
        setThread(data);// 수정 추가: 수정 폼도 초기화
        setLiked(data.likedByCurrentUser); // 초기 상태 설정!
      
  useEffect(() => {
    if (!threadId) return;
    getThreadById(Number(threadId))
      .then(data => {
        setThread(data);
        setEditForm({
          title: data.title,
          content: data.content,
          author: data.author,
          pdfPath: data.pdfPath,
          area: data.area
        });
      })
      .catch(err => {
        console.error('게시글 상세 조회 실패:', err);
        alert('게시글을 불러오는 데 실패했습니다.');
      });
  }, [threadId, user]);

  const handleDelete = async () => {
    if (!thread) return;
    if (!user || user.userId !== thread.userId) {
      alert('본인 게시글만 삭제할 수 있습니다.');
      return;
    }
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteThread(thread.threadId);
      alert('게시글이 삭제되었습니다.');
      navigate('/thread');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleLike = async () => {
    if (!thread || !user) {
      alert('로그인 후 좋아요를 누를 수 있습니다.');
      return;
    }
    try {
      const updatedThread = await likeThread(thread.threadId, user.userId);
      setThread(updatedThread);
      setLiked(prev => !prev);
    } catch (error) {
      console.error('좋아요 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !user) return;
    try {
      const updated = await updateThread(thread.threadId, {
        ...editForm,
        userId: user.userId,
        author: user.username
      });
      setThread(updated);
      setIsEditing(false);
      alert('게시글이 수정되었습니다.');
    } catch (err) {
      console.error('수정 실패:', err);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  if (!thread) return <Typography>로딩중...</Typography>;

  return (
    <Box sx={{ maxWidth: '1100px', mx: 'auto', mt: 6, p: 5, bgcolor: 'white', borderRadius: 4, boxShadow: 5 }}>
      {!isEditing ? (
        <>
          {/* ---------------- 게시글 상세 보기 ---------------- */}
      {/* 제목 */}
      <h2>{thread.title}</h2>

      {/* 작성자 및 날짜 */}
      <p>
        작성자: {thread.author} | 작성일: {new Date(thread.createDate).toLocaleDateString()}
      </p>
      <p>조회수: {thread.count}</p>

      {/* 본문 */}
      <div className={styles.content}>
        <p>{thread.content}</p>

        {/* 첨부 PDF */}
        {thread.pdfPath && (
          <p>
            첨부 PDF: <a href={thread.pdfPath} target="_blank" rel="noopener noreferrer">{thread.pdfPath}</a>
          </p>
        )}

        {/* 지역 정보 */}
        {thread.area && <p>여행 지역: {thread.area}</p>}
      </div>

      {/* 좋아요 수 및 버튼 7/2 */} 
      <p>좋아요: {thread.heart}개</p>
      <button onClick={handleLike}
       style={{  color: thread.likedByCurrentUser ? 'red' : 'gray' }}
      >{thread.likedByCurrentUser ? '❤️ 좋아요 취소' : '🤍 좋아요'}
      </button>

      {/* 수정/삭제 버튼은 작성자 본인만 볼 수 있음 */}
      {user && user.userId === thread.userId && (
        <div className={styles.btnGroup}>
          <button onClick={() => setIsEditing(true)}>✏️ 수정</button>
          {/*<button onClick={() => navigate(`/thread/edit/${thread.threadId}`)}>✏️ 수정</button>*/}
          <button onClick={handleDelete}>🗑 삭제</button>
        </div>
      )}
       </>
         ):(
          <>
              {/* ---------------- 게시글 수정 폼 ---------------- */}
              <h2>게시글 수정</h2>
              <form onSubmit={handleEditSubmit} className={styles.editForm}>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  placeholder="제목"
                  required
                />
                <textarea
                  name="content"
                  value={editForm.content}
                  onChange={handleEditChange}
                  placeholder="내용"
                  required
                />
                <input
                  type="text"
                  name="pdfPath"
                  value={editForm.pdfPath}
                  onChange={handleEditChange}
                  placeholder="PDF 경로"
                />
                <input
                  type="text"
                  name="area"
                  value={editForm.area}
                  onChange={handleEditChange}
                  placeholder="여행 지역"
                />
                <div className={styles.btnGroup}>
                  <button type="submit">✅ 저장</button>
                  <button type="button" onClick={() => setIsEditing(false)}>❌ 취소</button>
                </div>
              </form>
            </>
          )}
        </>
      ) : (
        <Box component="form" onSubmit={handleEditSubmit}>
          <Typography variant="h4" fontWeight={600} gutterBottom>게시글 수정</Typography>
          <Stack spacing={2}>
            <TextField label="제목" name="title" value={editForm.title} onChange={handleEditChange} fullWidth required size="medium" />
            <TextField label="내용" name="content" value={editForm.content} onChange={handleEditChange} fullWidth required multiline rows={8} size="medium" />
            <TextField label="PDF 경로" name="pdfPath" value={editForm.pdfPath} onChange={handleEditChange} fullWidth size="medium" />
            <TextField label="여행 지역" name="area" value={editForm.area} onChange={handleEditChange} fullWidth size="medium" />
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" color="success" sx={{ borderRadius: 8, px: 4, py: 1.5, fontSize: '1rem' }}>✅ 저장</Button>
              <Button type="button" variant="outlined" color="secondary" onClick={() => setIsEditing(false)} sx={{ borderRadius: 8, px: 4, py: 1.5, fontSize: '1rem' }}>❌ 취소</Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ThreadDetail;