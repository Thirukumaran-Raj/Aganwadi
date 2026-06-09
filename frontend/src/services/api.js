import axios from 'axios';

// Create an Axios instance pointing to your backend API
const api = axios.create({
  baseURL: 'https://aganwadi.onrender.com/api',
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
