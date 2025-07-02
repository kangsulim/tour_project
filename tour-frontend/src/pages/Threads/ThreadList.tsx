
import { useEffect, useState, useContext } from 'react';
import { getThreads, searchThreads } from '../../services/threadApi';  // 게시글 목록을 가져오는 API 함수
import { Thread } from '../../types/thread';
import { AuthContext } from '../../context/AuthContext'; // 로그인 정보 받아오기 위함
import { useNavigate } from 'react-router-dom';
import styles from './ThreadList.module.css'; //아직 안함 
// MUI에서 공식 문서에 나오는 Pagination 컴포넌트 가져오기
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ThreadList = () => {
  // 전체 게시글 목록을 담는 상태, 초기값은 빈 배열
  const [threads, setThreads] = useState<Thread[]>([]);
  //검색 키워드 입력 상태
  const [keyword, setKeyword] = useState('');
  // 검색 기준 ('author' 또는 'title_content')
  const [searchType, setSearchType] = useState<'author' | 'title_content'>('title_content'); 
  // 정렬 기준
  const [sortBy, setSortBy] = useState<'createDate' | 'views' | 'likes'>('createDate');

  // 현재 페이지 번호 상태 저장 (초기값: 1페이지)
  const [currentPage, setCurrentPage] = useState(1);
   // 한 페이지당 게시글 개수
   const threadsPerPage = 20;

  // 로그인한 사용자 정보(context에서 가져옴)
  const { user } = useContext(AuthContext);

  // 페이지 이동 기능을 위한 useNavigate 훅
  const navigate = useNavigate();

  // 컴포넌트가 처음 렌더링 될 때 게시글 목록을 서버에서 가져오는 함수 실행
  useEffect(() => {
    getThreads()
      .then(setThreads)  // API 성공 시 받은 게시글 배열로 상태 업데이트
      .catch(err => {
        console.error('게시글 목록 불러오기 실패:', err);
      });
  }, []);

    //  검색 버튼 클릭 시 검색 API 호출
    const handleSearch = async () => {
      if (keyword.trim() === '') {
        // 검색어 비었으면 전체 글 다시 가져옴
        const all = await getThreads();
        setThreads(all);
        return;
      }
      try {
        const result = await searchThreads(keyword, searchType, sortBy);
        setThreads(result);
        setCurrentPage(1); // 검색 결과는 첫 페이지부터 보기
      } catch (err) {
        console.error('검색 실패:', err);
        alert('검색 중 오류 발생');
      }
    };

   // 전체 페이지 수 계산 (총 글 수 ÷ 페이지당 글 수)
   const totalPages = Math.ceil(threads.length / threadsPerPage);

   // 현재 페이지에서 보여줄 게시글만 잘라내기
  const startIdx = (currentPage - 1) * threadsPerPage;
  const endIdx = startIdx + threadsPerPage;
  const currentThreads = threads.slice(startIdx, endIdx);

  // 게시글 제목을 클릭하면 해당 게시글 상세 페이지로 이동하는 함수
  const handleTitleClick = (threadId: number) => {
    navigate(`/thread/${threadId}`);
  };

  // '새 게시글 작성' 버튼 클릭 시 실행 (로그인 여부 확인 후 작성 페이지로 이동)
  const handleCreateClick = () => {
    if (!user) {
      alert('로그인 후 게시글을 작성할 수 있습니다.');
      return;
    }
    navigate('/thread/create');
  };

    // 페이지 번호 클릭 시 실행되는 함수
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentPage(value); // 현재 페이지 상태를 바꿔줌
    };

  return (
    <div className={styles.container}>
      <h2>📝 게시글 목록</h2>

       {/* 검색 기준 선택 UI 추가 */}
       <div style={{ marginBottom: '16px' }}>
       <select value={sortBy}
       onChange={e => setSortBy(e.target.value as 'createDate' | 'views' | 'likes')}>
       <option value="createDate">최신순</option>
       <option value="views">조회수</option>
       <option value="likes">좋아요수</option>
     </select>
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value as 'author' | 'title_content')} // 검색 기준 변경
          style={{ padding: '6px 10px', marginRight: '8px' }}
        >
          <option value="title_content">제목 + 내용</option>
          <option value="author">작성자</option>
        </select>

       {/*  검색 입력창과 버튼 추가 */}
       <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="키워드 입력하세요."
          style={{ padding: '6px 10px', width: '300px' }}
        />
          <button onClick={handleSearch} style={{ marginLeft: '8px', padding: '6px 12px' }}>
          🔍 검색
        </button>
        </div> 
        

      {/* 게시글 작성 버튼: 로그인 사용자만 클릭 가능 */}
      <button onClick={handleCreateClick} className={styles.createBtn}>
        새 게시글 작성
      </button>
      </div>
      {/* 게시글 리스트를 테이블 형태로 보여줌 */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No.</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>좋아요</th>
          </tr>
        </thead>
        <tbody>
          {/* threads 배열을 순회하며 각 게시글을 행으로 렌더링 */}
          {currentThreads.map(thread => (
            <tr key={thread.threadId}>
              <td>{thread.threadId}</td>

              {/* 제목 클릭 시 상세 페이지로 이동, 클릭 가능하다는 UI 표시 */}
              <td
                className={styles.title}
                onClick={() => handleTitleClick(thread.threadId)}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              >
                {thread.title}
              </td>

              <td>{thread.author}</td>
              <td>{new Date(thread.createDate).toLocaleDateString()}</td>
              <td>{thread.count}</td>
              <td>{thread.heart}</td>
            </tr>
          ))}
        </tbody>
      </table>
         {/*  페이지네이션 영역: MUI 공식 문서 방식 그대로 사용 */}
         <Stack spacing={2} alignItems="center" marginTop={4}>
        <Pagination
          count={Math.min(totalPages, 10)} // 최대 10페이지까지만 보이게 제한
          page={currentPage}               // 현재 선택된 페이지
          onChange={handlePageChange}      // 클릭 시 페이지 변경
          color="primary"
        />
      </Stack>
    </div>
    );
  };



export default ThreadList;
