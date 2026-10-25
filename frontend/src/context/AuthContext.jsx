import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('tenlea_token');
      const savedUserStr = localStorage.getItem('tenlea_user');

      if (savedUserStr) {
        try {
          setUser(JSON.parse(savedUserStr));
        } catch (e) {
          console.warn('Failed to parse cached user:', e);
        }
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res && res.success) {
          setUser(prev => {
            const merged = { ...prev, ...res.data };
            localStorage.setItem('tenlea_user', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        if (!savedUserStr) {
          localStorage.removeItem('tenlea_token');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password, requestedRole) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res && res.success) {
        localStorage.setItem('tenlea_token', res.token);
        const userData = {
          ...res.data,
          username: res.data.username || (res.data.name || 'user').toLowerCase().replace(/\s+/g, '')
        };
        localStorage.setItem('tenlea_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.error('Backend login error:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Cannot connect to Tenlea backend server. Please make sure the backend is running.';
      throw new Error(errorMsg);
    }
  };

  const registerUser = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res && res.success) {
        localStorage.setItem('tenlea_token', res.token);
        const userData = {
          ...res.data,
          username: res.data.username || (res.data.name || 'user').toLowerCase().replace(/\s+/g, '')
        };
        localStorage.setItem('tenlea_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.error('Backend registration error:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Cannot connect to Tenlea backend server. Please make sure the backend is running.';
      throw new Error(errorMsg);
    }
  };

  const socialLogin = async (provider, requestedRole = 'VEHICLE_OWNER') => {
    try {
      const rawRole = (requestedRole || 'VEHICLE_OWNER').toUpperCase();
      const roleUpper = rawRole === 'VEHICLE' ? 'VEHICLE_OWNER' : rawRole;
      const res = await api.post('/auth/social', { provider, role: roleUpper });
      if (res && res.success) {
        localStorage.setItem('tenlea_token', res.token);
        const userData = {
          ...res.data,
          username: res.data.username || (res.data.name || 'user').toLowerCase().replace(/\s+/g, '')
        };
        localStorage.setItem('tenlea_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.error('Social auth error:', err);
      throw new Error(err.response?.data?.message || err.message || 'Social sign-in failed');
    }
  };

  const switchRole = (newRole) => {
    if (user) {
      const updated = { ...user, role: newRole.toUpperCase() };
      localStorage.setItem('tenlea_user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  const updateUserProfile = (newFields) => {
    if (user) {
      const updated = { ...user, ...newFields };
      localStorage.setItem('tenlea_user', JSON.stringify(updated));
      setUser(updated);
      return updated;
    }
  };

  const logout = () => {
    localStorage.removeItem('tenlea_token');
    localStorage.removeItem('tenlea_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, registerUser, socialLogin, switchRole, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
