
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../../services/threadApi'; // 게시글 작성 API 호출 함수
import { AuthContext } from '../../context/AuthContext'; // 로그인 정보 context
import styles from './ThreadCreate.module.css';

const ThreadCreate = () => {
  // 게시글 작성 폼 상태: 제목, 내용, PDF 경로, 여행 지역
  const [form, setForm] = useState({
    title: '',
    content: '',
    pdfPath: '',
    area: '',
  });

  // 로그인한 사용자 정보 context에서 가져오기
  const { user } = useContext(AuthContext);

  // 페이지 이동 함수
  const navigate = useNavigate();

  // 폼 입력 변경 시 호출됨 (input, textarea 공통)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // 기존 상태를 복사한 뒤 변경된 항목만 업데이트
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 폼 제출 시 호출되는 함수 (게시글 작성 요청 처리)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 이벤트 막음(새로고침 방지)

    // 로그인 여부 확인
    if (!user) {
      alert('로그인 후 게시글을 작성할 수 있습니다.');
      return;
    }

    // 제목, 내용 필수 체크
    if (!form.title.trim() || !form.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      // API에 userId, author 추가하여 작성 요청
      await createThread({
        ...form,
        userId: user.userId,
        author: user.username,
      });

      // 작성 성공 시 게시글 목록 페이지로 이동
      navigate('/thread');
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>게시글 작성</h2>

      {/* 게시글 작성 폼 */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 제목 입력 */}
        <input
          type="text"
          name="title"
          placeholder="제목을 입력하세요"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* 내용 입력 */}
        <textarea
          name="content"
          placeholder="내용을 입력하세요"
          value={form.content}
          onChange={handleChange}
          required
          rows={10}
        />

        {/* PDF 첨부 경로 입력 (선택) */}
        <input
          type="text"
          name="pdfPath"
          placeholder="첨부할 PDF 경로 (선택)"
          value={form.pdfPath}
          onChange={handleChange}
        />

        {/* 여행 지역 입력 (선택) */}
        <input
          type="text"
          name="area"
          placeholder="여행 지역 (선택)"
          value={form.area}
          onChange={handleChange}
        />

        {/* 제출 버튼 */}
        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
};

export default ThreadCreate;
