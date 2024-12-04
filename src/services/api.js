import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const api = {
  getPosts: () => axios.get(`${API_URL}/posts`),
  getPost: (id) => axios.get(`${API_URL}/posts/${id}`),
  createPost: (post) => axios.post(`${API_URL}/posts`, post),
  updatePost: (id, post) => axios.put(`${API_URL}/posts/${id}`, post),
  deletePost: (id) => axios.delete(`${API_URL}/posts/${id}`)
}; 