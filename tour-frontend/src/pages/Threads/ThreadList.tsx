  // 스타일 적용된 ThreadList.tsx - TravelPlan 게시판 UI 기반 (확장된 크기 버전)
  import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
  } from '@mui/material';
  import { useContext, useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { AuthContext } from '../../context/AuthContext';
  import { getThreads, searchThreads } from '../../services/threadApi';
  import { Thread } from '../../types/thread';

  const ThreadList = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState<'author' | 'title_content'>('title_content');
    const [sortBy, setSortBy] = useState<'createDate' | 'views' | 'likes'>('createDate');
    const [currentPage, setCurrentPage] = useState(1);
    const threadsPerPage = 20;
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      getThreads()
        .then(setThreads)
        .catch((err) => {
          console.error('게시글 목록 불러오기 실패:', err);
        });
    }, []);

    const handleSearch = async () => {
      if (keyword.trim() === '') {
        const all = await getThreads();
        setThreads(all);
        return;
      }
      try {
        const result = await searchThreads(keyword, searchType, sortBy);
        setThreads(result);
        setCurrentPage(1);
      } catch (err) {
        console.error('검색 실패:', err);
        alert('검색 중 오류 발생');
      }
    };

    const totalPages = Math.ceil(threads.length / threadsPerPage);
    const startIdx = (currentPage - 1) * threadsPerPage;
    const endIdx = startIdx + threadsPerPage;
    const currentThreads = threads.slice(startIdx, endIdx);

    const handleTitleClick = (threadId: number) => {
      navigate(`/thread/${threadId}`);
    };

    const handleCreateClick = () => {
      if (!user) {
        alert('로그인 후 게시글을 작성할 수 있습니다.');
        return;
      }
      navigate('/thread/create');
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentPage(value);
    };

    return (
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 4 }}>
        {/* 헤더 배너 */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            p: 5,
            borderRadius: 3,
            mb: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" fontWeight={700}>💬 여행 공유</Typography>
          <Typography variant="h6" mt={1}>여행 경험을 공유하고 다른 여행자들과 소통해보세요</Typography>
        </Box>

        {/* 필터 & 검색 */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <FormControl size="medium" sx={{ minWidth: 150 }}>
              <InputLabel>정렬</InputLabel>
              <Select
                value={sortBy}
                label="정렬"
                onChange={(e: SelectChangeEvent<'createDate' | 'views' | 'likes'>) =>
                  setSortBy(e.target.value as 'createDate' | 'views' | 'likes')
                }
              >
                <MenuItem value="createDate">최신순</MenuItem>
                <MenuItem value="views">조회수</MenuItem>
                <MenuItem value="likes">좋아요수</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="medium" sx={{ minWidth: 180 }}>
              <InputLabel>검색 기준</InputLabel>
              <Select
                value={searchType}
                label="검색 기준"
                onChange={(e: SelectChangeEvent<'author' | 'title_content'>) =>
                  setSearchType(e.target.value as 'author' | 'title_content')
                }
              >
                <MenuItem value="title_content">제목 + 내용</MenuItem>
                <MenuItem value="author">작성자</MenuItem>
              </Select>
            </FormControl>

            <TextField
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              size="medium"
              sx={{ minWidth: 300 }}
            />

            <Button variant="contained" color="primary" size="large" onClick={handleSearch}>
              🔍 검색
            </Button>
          </Stack>
        </Paper>

        {/* 글쓰기 버튼 */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCreateClick}
            sx={{ borderRadius: 999 }}
          >
            ✏️ 글쓰기
          </Button>
        </Box>

        {/* 게시글 테이블 */}
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell align="center" sx={{ fontSize: '1rem' }}>번호</TableCell>
                <TableCell align="left" sx={{ fontSize: '1rem' }}>제목</TableCell>
                <TableCell align="center" sx={{ fontSize: '1rem' }}>작성자</TableCell>
                <TableCell align="center" sx={{ fontSize: '1rem' }}>작성일</TableCell>
                <TableCell align="center" sx={{ fontSize: '1rem' }}>조회</TableCell>
                <TableCell align="center" sx={{ fontSize: '1rem' }}>좋아요</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentThreads.map((thread) => (
                <TableRow key={thread.threadId} hover>
                  <TableCell align="center">{thread.threadId}</TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { color: '#1976d2' },
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}
                    onClick={() => handleTitleClick(thread.threadId)}
                  >
                    {thread.title}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.95rem' }}>{thread.author}</TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.95rem' }}>
                    {new Date(thread.createDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 500 }}>{thread.count}</TableCell>
                  <TableCell align="center" sx={{ color: '#f44336', fontWeight: 500 }}>{thread.heart}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 페이지네이션 */}
        <Stack spacing={2} alignItems="center" mt={5}>
          <Pagination
            count={Math.min(totalPages, 10)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
          />
        </Stack>
      </Box>
    );
  };

  export default ThreadList;