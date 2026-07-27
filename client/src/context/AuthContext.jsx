import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('tenlea_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.success) {
          setUser(res.data);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        localStorage.removeItem('tenlea_token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('tenlea_token', res.token);
      setUser(res.data);
      return res.data;
    }
  };

  const registerUser = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.success) {
      localStorage.setItem('tenlea_token', res.token);
      setUser(res.data);
      return res.data;
    }
  };

  const socialLogin = async (provider, requestedRole = 'ADMIN') => {
    const roleUpper = (requestedRole || 'ADMIN').toUpperCase();
    const mockUser = {
      id: `usr_${provider}_${Date.now()}`,
      name: 'Ramanan Sethuraman',
      email: 'ramanans.master@gmail.com',
      role: roleUpper === 'LANDOWNER' ? 'ADMIN' : roleUpper,
      provider: provider,
      verified: true,
    };
    localStorage.setItem('tenlea_token', `token_${provider}_${Date.now()}`);
    setUser(mockUser);
    return mockUser;
  };

  const switchRole = (newRole) => {
    if (user) {
      const updated = { ...user, role: newRole.toUpperCase() };
      setUser(updated);
    }
  };

  const logout = () => {
    localStorage.removeItem('tenlea_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, registerUser, socialLogin, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
