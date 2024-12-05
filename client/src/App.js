/**
hook의 규칙
1. 컴포넌트 최상단에서만 호출해야한다.
2. 다른 조건문, 함수선언문, 반복문 등 중첩된 함수 안에서는 호출 할 수 없다.
3. 컴포넌트 내부 함수에서 callback으로도 호출 할 수 없다.
4. 함수 컴포넌트에서 호출할 수 있다. (Custom hook에서 예외처리 가능)
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';
import PostList from './components/Post/PostList';
import PostDetail from './components/Post/PostDetail';
import NewPost from './components/Post/NewPost';
import { api } from './services/api';

function App() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /*
  React 컴포넌트가 리렌더링될 때마다 컴포넌트 내부에서 정의된 모든 변수와 함수들이 새로운 인스턴스로 재생성됩니다. 
  이로 인해 함수의 참조값(주소)이 변경되며, 
  이를 useEffect의 의존성 배열에 포함시키면 효과가 재실행되는 현상이 발생합니다.
  또한 자식 컴포넌트에 전달할 때에도 새로운 객체로 만들어서 넘겨준다.
  useCallback 함수는 이러한 문제를 해결하기 위해 사용됩니다.
  따라서 다른 곳에서 참조하지 않는다면 사용할 필요가 없다.
  */

  // react router를 이용해 페이지간 이동을 할 때 마다 호출되는 함수
  useEffect(() => {
    const loadPosts = async () => {    
      setLoading(true);
      try {
        const response = await api.getPosts();      
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        }else {        
          setPosts([]);
        }
        setError(null);    
      } finally {
        setLoading(false);
      }      
    };

    loadPosts();
  }, []);

  /*
  useEffect 내부에서 사용하는 모든 변수와 함수는 의존성 배열에 포함시켜야 합니다. 
  이는 ESLint 플러그인(eslint-plugin-react-hooks)에서 자동으로 검사하며, 
  이를 무시하면 잠재적인 버그를 초래할 수 있습니다.
  */  

  const addPost = async ({ title, content }) => {
    setLoading(true);
    try {
      const response = await api.createPost({ title, content });      
      setPosts(prevPosts => [...prevPosts, response.data]);
      setError(null);
    } catch (error) {
      console.error('게시물 작성에 실패했습니다:', error);
      setError('게시물 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>게시판</h1>      
      <nav>
        <Link to="/">목록</Link>
        <Link to="/new">새 게시물 작성</Link>
      </nav>
      {loading && <div className="loading">로딩 중...</div>}
      {error && <div className="error">{error}</div>}
      <Routes>
        <Route path="/" element={<PostList posts={posts} />} />
        <Route path="/post/:id" element={<PostDetail posts={posts} />} />
        <Route path="/new" element={<NewPost addPost={addPost} />} />
      </Routes>
    </div>
  );
}

export default App;

/** 
 * 리액트에서 <a>태그 대신 <Link> 컴포넌트를 사용해야 하는 이유
<a> 태그는 새로운 페이지 전환이 일어날 때마다 전체 페이지를 다시 렌더링하게 되어 초기 상태부터 다시 로드되며, 
그로인해 기존의 state(유저가 작성한 데이터, 또는 스크롤 위치 등)이 초기화 되는 문제가 발생한다.
반면에 Link 컴포넌트는 페이지 전환을 부드럽게 처리하기 위해 내부적으로 History API를 사용하기 때문에, 
페이지 간 전환 시에 새로고침 없이 필요한 컴포넌트만 렌더링 되어 효율적으로 작동한다.
 */

/*
useLocation 사용 시점
현재 URL의 경로 따라 다른 컴포넌트를 렌더링하거나 특정 동작을 수행해야 할 때.
라우트 기반의 로직을 구현할 때 필요합니다.
Context 사용 시점
여러 컴포넌트에서 공통으로 사용하는 데이터를 관리할 때.
프롭스 드릴링을 줄이고, 전역 상태를 효율적으로 관리하고 싶을 때 유용합니다.
*/
