import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : 'https://aganwadi.onrender.com/api');

// Create an Axios instance pointing to your backend API
const api = axios.create({
  baseURL,
});

// Automatically attach the JWT token to every request if the user is logged in
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
