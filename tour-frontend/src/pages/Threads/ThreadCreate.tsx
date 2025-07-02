import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../../services/threadApi';
import { AuthContext } from '../../context/AuthContext';
import { Box, Button, TextField, Typography } from '@mui/material';

const ThreadCreate = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    pdfPath: '',
    area: '',
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('로그인 후 게시글을 작성할 수 있습니다.');
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      await createThread({
        ...form,
        userId: user.userId,
        author: user.username,
      });
      navigate('/thread');
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box
  sx={{
    maxWidth: 1140, // 💡 960 → 1140 으로 더 넓게 설정
    margin: '2rem auto',
    padding: '2.5rem',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  }}
>
      <Typography variant="h4" sx={{ marginBottom: '1.5rem', color: '#1976d2', fontWeight: 'bold' }}>
        ✍️ 게시글 작성
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <TextField
          label="제목"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="내용"
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          multiline
          rows={8}
          fullWidth
        />

        <TextField
          label="첨부할 PDF 경로 (선택)"
          name="pdfPath"
          value={form.pdfPath}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="여행 지역 (선택)"
          name="area"
          value={form.area}
          onChange={handleChange}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            padding: '0.75rem',
            borderRadius: '25px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#1565c0',
              transform: 'translateY(-2px)',
            },
          }}
        >
          작성 완료
        </Button>
      </Box>
    </Box>
  );
};

export default ThreadCreate;
