import React, { createContext, useContext, useEffect, useState } from 'react';
import api from './api';

const AuthContext = createContext({
  token: null,
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try refresh on mount
  useEffect(() => {
    api.post('/api/auth/refresh')
      .then(res => {
        const newToken = res.data.token;
        setToken(newToken);
        localStorage.setItem('accessToken', newToken);
        
        // Set user data from refresh token response
        if (res.data.user) {
          setUser(res.data.user);
        }
        // If no user data in response, fall back to fetching it
        else {
          return api.get('/api/users/me');
        }
      })
      .then(res => {
        if (res && res.data) {
          setUser(res.data);
        }
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const accessToken = res.data.token;
    setToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (email, username, password) => {
    const res = await api.post('/api/auth/register', { email, username, password });
    const accessToken = res.data.token;
    setToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setToken(null);
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  // Automatically logout on 401 errors to clear auth and cart
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => { api.interceptors.response.eject(interceptor); };
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}; 