import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // include HTTP-only refresh cookies
});

let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Attach access token to headers
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle 401 errors by refreshing token
api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    // Don't intercept the refresh call itself, let AuthContext handle it
    if (originalRequest.url && originalRequest.url.includes('/api/auth/refresh')) {
      return Promise.reject(error);
    }
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return api.post('/api/auth/refresh')
        .then(res => {
          const newToken = res.data.token;
          localStorage.setItem('accessToken', newToken);
          api.defaults.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch(err => {
          processQueue(err, null);
          return Promise.reject(err);
        })
        .finally(() => { isRefreshing = false; });
    }
    return Promise.reject(error);
  }
);

export default api; 