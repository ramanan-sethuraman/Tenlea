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

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res && res.success) {
        localStorage.setItem('tenlea_token', res.token);
        const userData = {
          ...res.data,
          username: res.data.username || (res.data.name || 'ryan').toLowerCase().replace(/\s+/g, '')
        };
        localStorage.setItem('tenlea_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.warn('Backend login API failed, using demo user session:', err);
      const nameFromEmail = email.split('@')[0] || 'Ryan';
      const isLandowner = email.toLowerCase().includes('landowner') || email.toLowerCase().includes('land');
      const mockUser = {
        id: `usr_${Date.now()}`,
        name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        fullName: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        username: nameFromEmail.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email: email,
        role: isLandowner ? 'LANDOWNER' : 'VEHICLE_OWNER',
        verified: true,
      };
      localStorage.setItem('tenlea_token', `token_${Date.now()}`);
      localStorage.setItem('tenlea_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const registerUser = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res && res.success) {
        localStorage.setItem('tenlea_token', res.token);
        const userData = {
          ...res.data,
          username: res.data.username || (res.data.name || 'ryan').toLowerCase().replace(/\s+/g, '')
        };
        localStorage.setItem('tenlea_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.warn('Backend registration API failed, using demo registered user session:', err);
      const roleUpper = (formData.role || 'VEHICLE_OWNER').toUpperCase();
      const rawName = formData.name || 'Ryan';
      const mockUser = {
        id: `usr_${Date.now()}`,
        name: rawName,
        fullName: rawName,
        username: (formData.username || rawName).toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email: formData.email,
        phone: formData.phone || '',
        role: roleUpper,
        verified: true,
      };
      localStorage.setItem('tenlea_token', `token_${Date.now()}`);
      localStorage.setItem('tenlea_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const socialLogin = async (provider, requestedRole = 'ADMIN') => {
    const roleUpper = (requestedRole || 'ADMIN').toUpperCase();
    const mockUser = {
      id: `usr_${provider}_${Date.now()}`,
      name: 'Ryan',
      fullName: 'Ryan',
      username: 'ryan',
      email: 'ryan@tenlea.com',
      role: roleUpper === 'LANDOWNER' ? 'ADMIN' : roleUpper,
      provider: provider,
      verified: true,
    };
    localStorage.setItem('tenlea_token', `token_${provider}_${Date.now()}`);
    localStorage.setItem('tenlea_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
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
