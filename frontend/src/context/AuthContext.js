import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bad_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bad_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => {
        const merged = { ...data.user, doctorProfile: data.doctorProfile };
        setUser(merged);
        localStorage.setItem('bad_user', JSON.stringify(merged));
      })
      .catch(() => {
        localStorage.removeItem('bad_token');
        localStorage.removeItem('bad_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('bad_token', data.token);
    localStorage.setItem('bad_user', JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('bad_token', data.token);
    localStorage.setItem('bad_user', JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('bad_token');
    localStorage.removeItem('bad_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
