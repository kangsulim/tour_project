

import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getThreadById, deleteThread, likeThread, updateThread } from '../../services/threadApi'; 
import { Thread, ThreadRequest } from '../../types/thread';
import { AuthContext } from '../../context/AuthContext';
import styles from './ThreadDetail.module.css';
import Comments from '../Comments/Comments';

const ThreadDetail = () => {
  // ---------------------- [상태 및 훅 설정] ----------------------
  const { threadId } = useParams<{ threadId: string }>(); // URL에서 threadId 추출
  const [thread, setThread] = useState<Thread | null>(null); // 게시글 데이터 상태
  const { user } = useContext(AuthContext); // 현재 로그인한 사용자
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [liked, setLiked] = useState(false);

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
  useEffect(() => {
    if (!threadId) return;

    getThreadById(Number(threadId)) // threadId 기반으로 게시글 조회
      .then(data => {setThread(data);
        // 수정 추가: 수정 폼도 초기화
        setEditForm({
          title: data.title,
          content: data.content,
          author: data.author,
          pdfPath: data.pdfPath,
          area: data.area,
        });
        // TODO: 여기서 좋아요 여부 API 호출해서 liked 상태 업데이트 가능
        // 임시로 false로 세팅
        setLiked(false);
      })
      
     // 성공 시 상태에 저장
      .catch(err => {
        console.error('게시글 상세 조회 실패:', err);
        alert('게시글을 불러오는 데 실패했습니다.');
      });
  }, [threadId]);

  // ---------------------- [게시글 삭제 기능] ----------------------
  const handleDelete = async () => {
    if (!thread) return;

    // 작성자가 아니면 삭제 불가
    if (!user || user.userId !== thread.userId) {
      alert('본인 게시글만 삭제할 수 있습니다.');
      return;
    }

    // 사용자 확인 후 삭제 API 호출
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteThread(thread.threadId);
      alert('게시글이 삭제되었습니다.');
      navigate('/thread'); // 삭제 후 게시글 목록 페이지로 이동
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  // ---------------------- [좋아요 기능] ----------------------
  const handleLike = async () => {
    if (!thread) return;

    console.log(user)

    if (!user) {
      alert('로그인 후 좋아요를 누를 수 있습니다.');
      return;
    }

    try {
      const updatedThread = await likeThread(thread.threadId, user.userId); // 좋아요 처리
      setThread(updatedThread); // 좋아요 수 반영
      setLiked(prev => !prev); // 토글 상태 반전
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };
   // ---------------------- [수정 기능: 추가] ----------------------

  // 수정 폼 입력 변경 핸들러 (입력 필드가 변경될 때마다 editForm 상태 업데이트)
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // 수정 저장 핸들러(수정 완료 버튼 클릭 시 호출)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !user) return;

    try { // 수정 API 호출 (userId와 username은 context user에서 따로 넣어줌)
      const updated = await updateThread(thread.threadId, {
        ...editForm,
        userId: user.userId,
        author: user.username,
      });
      setThread(updated);       // 수정 후 상태 업데이트 (화면에 반영)
      setIsEditing(false);       // 수정 모드 종료 (상세보기로 돌아감)
      alert('게시글이 수정되었습니다.');
    } catch (err) {
      console.error('수정 실패:', err);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };


  // ---------------------- [로딩 처리] ----------------------
  if (!thread) {
    return <div>로딩중...</div>;
  }

  // ---------------------- [렌더링 영역] ----------------------
  return (
    <div className={styles.container}>
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

      {/* 좋아요 수 및 버튼 */}
      <p>좋아요: {thread.heart}개</p>
      <button onClick={handleLike}
       style={{ color: liked ? 'red' : 'gray', cursor: 'pointer' }}
      >{liked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
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
    
          {/* 댓글 기능 추가 */}
          <Comments threadId={thread.threadId} />
    </div>
  );
};

export default ThreadDetail;
