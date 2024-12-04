// src/PostDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from './services/api';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [id]);

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
