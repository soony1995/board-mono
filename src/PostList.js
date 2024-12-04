import React from 'react';
import { Link } from 'react-router-dom';
import { api } from './services/api';
import './PostList.css';

function PostList({ posts }) {  
  const handleDelete = async (id) => {
    try {
      await api.deletePost(id);
      // 삭제 후 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('게시물 삭제에 실패했습니다:', error);
    }
  };

  return (
    <div className="PostList">
      <h2>게시물 목록</h2>      
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`}>
              {post.title}
            </Link>
            <button 
              onClick={() => handleDelete(post.id)}
              className="delete-button"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;