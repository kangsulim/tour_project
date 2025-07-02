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
import { getThreadById, deleteThread, likeThread, updateThread } from '../../services/threadApi';
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
        setLiked(false);
      })
      .catch(err => {
        console.error('게시글 상세 조회 실패:', err);
        alert('게시글을 불러오는 데 실패했습니다.');
      });
  }, [threadId]);

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
          <Typography variant="h3" fontWeight={700} color="primary.main" gutterBottom>{thread.title}</Typography>
          <Typography color="text.secondary" gutterBottom fontSize={18}>
            작성자: {thread.author} | 작성일: {new Date(thread.createDate).toLocaleDateString()}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }} fontSize={17}>조회수: {thread.count}</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap', mb: 3, fontSize: '1.05rem' }}>{thread.content}</Typography>
          {thread.pdfPath && (
            <Typography mb={2}>
              첨부 PDF: <Link href={thread.pdfPath} target="_blank" rel="noopener" underline="hover">{thread.pdfPath}</Link>
            </Typography>
          )}
          {thread.area && <Chip label={`여행 지역: ${thread.area}`} variant="outlined" sx={{ mb: 2, fontSize: '0.95rem' }} />}

          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Typography>좋아요: {thread.heart}개</Typography>
            <IconButton onClick={handleLike} color={liked ? 'error' : 'default'}>
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Stack>

          {user && user.userId === thread.userId && (
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} sx={{ borderRadius: 8, px: 4, py: 1.5, fontSize: '1rem' }}>✏️ 수정</Button>
              <Button variant="outlined" color="error" onClick={handleDelete} sx={{ borderRadius: 8, px: 4, py: 1.5, fontSize: '1rem' }}>🗑 삭제</Button>
            </Stack>
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