/**
hook의 규칙
1. 컴포넌트 최상단에서만 호출해야한다.
2. 다른 조건문, 함수선언문, 반복문 등 중첩된 함수 안에서는 호출 할 수 없다.
3. 컴포넌트 내부 함수에서 callback으로도 호출 할 수 없다.
4. 함수 컴포넌트에서 호출할 수 있다. (Custom hook에서 예외처리 가능)
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PostList from './PostList';
import PostDetail from './PostDetail';
import NewPost from './NewPost';
import { api } from './services/api';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await api.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('게시물을 불러오는데 실패했습니다:', error);
    }
  };

  const addPost = async ({ title, content }) => {
    try {
      const response = await api.createPost({ title, content });
      setPosts([...posts, response.data]);
    } catch (error) {
      console.error('게시물 작성에 실패했습니다:', error);
    }
  };

  return (
    <div className="App">
      <h1>게시판</h1>      
      <nav>
        <Link to="/">목록</Link>
        <Link to="/new">새 게시물 작성</Link>
      </nav>
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
현재 URL의 경로에 따라 다른 컴포넌트를 렌더링하거나 특정 동작을 수행해야 할 때.
라우트 기반의 로직을 구현할 때 필요합니다.
Context 사용 시점
여러 컴포넌트에서 공통으로 사용하는 데이터를 관리할 때.
프롭스 드릴링을 줄이고, 전역 상태를 효율적으로 관리하고 싶을 때 유용합니다.
*/