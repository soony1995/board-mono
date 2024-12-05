// src/PostDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import '../../styles/App.css';

/*
리액트에서 렌더링이 발생하는 조건은 주로 다음과 같습니다:
1. 상태(State) 변경 시
2. 프로퍼티(Props) 변경 시
3. 컨텍스트(Context) 변경 시
4. 부모 컴포넌트의 리렌더링
5. 강제 리렌더링 시
6. 키(Key) 변경 시
7. 상태 관리 라이브러리의 업데이트
*/

function PostDetail() {
  // 현재 URL의 파라미터를 접근할 수 있게 해줍니다. 주로 URL에 포함된 동적 세그먼트(예: /post/:id)의 값을 가져올 때 사용됩니다.
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await api.getPost(id);
        setPost(response.data);
      } catch (error) {
        console.error('게시물을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="PostDetail">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <button onClick={() => navigate(-1)}>뒤로 가기</button>
    </div>
  );
}

export default PostDetail;
