// src/NewPost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

function NewPost({ addPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    addPost({ title, content });
    navigate('/');
  };

  const onCancel = () => {
    navigate('/');
  };

  return (
    <div className="NewPost">
      <h2>새 게시물 작성</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">등록</button>
        <button type="button" onClick={onCancel}>
          취소
        </button>
      </form>
    </div>
  );
}

export default NewPost;