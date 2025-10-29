import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Set to false since we're using token auth
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    // Add content type for JSON
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
};

export const protestAPI = {
  getProtests: (filters = {}) => api.get('/protests/', { params: filters }),
  getProtest: (id) => api.get(`/protests/${id}/`),
  createProtest: (protestData) => api.post('/protests/', protestData),
  supportProtest: (protestId) => api.post(`/protests/${protestId}/support/`),
};
// Add to your existing api.js file
export const awarenessAPI = {
  getBlogPosts: () => api.get('/awareness/posts/'),
  getBlogPost: (id) => api.get(`/awareness/posts/${id}/`),
  createBlogPost: (postData) => api.post('/awareness/posts/', postData),
  likeBlogPost: (postId) => api.post(`/awareness/posts/${postId}/like/`),
  getComments: (postId) => api.get(`/awareness/posts/${postId}/comments/`),
  createComment: (postId, commentData) => api.post(`/awareness/posts/${postId}/comments/`, commentData),
};

export default api;