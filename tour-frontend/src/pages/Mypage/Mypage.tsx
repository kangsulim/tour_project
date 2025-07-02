

import { useEffect, useState, useContext } from 'react';
import {
  getUserProfile,
  updateUserProfile,
  getUserIdByUsername,
} from '../../services/userApi'; // API 함수들
import {
  UserResponse,
  UserUpdateRequest,
} from '../../types/user'; // 타입
import { AuthContext } from '../../context/AuthContext'; // 인증 정보

const Mypage = () => {
  const { token } = useContext(AuthContext);

  const [user, setUser] = useState<UserResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState<UserUpdateRequest>({
    username: '',
    name: '',
    email: '',
    phone: '',
    nickname: '',
    password: '',
  });

  // 컴포넌트 마운트 시 사용자 정보 조회
  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload);
      const username = payload.sub;

      if (!username) {
        setError('유효하지 않은 사용자입니다.');
        setLoading(false);
        return;
      }

      // username → userId → userProfile 조회
      getUserIdByUsername(username)
        .then((userId) => getUserProfile(userId))
        .then((data) => {
          setUser(data);
          setForm(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('사용자 정보를 불러오는데 실패했습니다.');
          setLoading(false);
        });
    } catch (err) {
      console.error(err);
      setError('토큰 파싱 오류');
      setLoading(false);
    }
  }, [token]);

  // input 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 저장 버튼 클릭 시 사용자 정보 수정
  const handleSave = async () => {
    if (!token || !user) return;

    try {
      const updatedUser = await updateUserProfile(user.userId, form);
      setUser(updatedUser);
      setIsEditing(false);
      alert('정보가 성공적으로 수정되었습니다!');
    } catch (err) {
      console.error(err);
      alert('수정 실패');
    }
  };

  // 로딩 중
  if (loading) return <p>로딩 중...</p>;

  // 에러 발생 시
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>마이페이지</h2>
      {user && (
        <>
          {/*<p>User Id: {user.userId}</p>*/}
          <p>User Name: {user.username}</p>
          <p>이름: {user.name}</p>
          <p>닉네임: {user.nickname}</p>
          <p>이메일: {user.email}</p>
          <p>폰번호: {user.phone}</p>
          <button onClick={() => setIsEditing(true)}>회원정보 수정</button>
        </>
      )}

      {/* 수정 폼 */}
      {user && isEditing && (
        <>
          {/*<p>User Id: {user.userId}</p>*/}
          <p>User Name: {user.username}</p>
          <div>
          <label htmlFor="name">이름</label><br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="이름"
          /> </div>
            <div>
          <label htmlFor="nickname">닉네임</label><br />
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="닉네임"
          /></div>
          <div>
          <label htmlFor="email">이메일</label><br />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="이메일"
          /></div>
          <br />
          <button onClick={handleSave}>저장</button>
          <button onClick={() => setIsEditing(false)}>취소</button>
        </>
      )}
    </div>
  );
};

export default Mypage;
