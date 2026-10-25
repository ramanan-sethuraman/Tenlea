import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { db } from '../firebase/config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

        // Record login timestamp in Firestore
        const userId = userData._id || userData.id;
        if (userId) {
          try {
            await setDoc(doc(db, 'users', String(userId)), {
              lastLogin: serverTimestamp(),
            }, { merge: true });
            console.log('✅ [Firestore Success]: Updated login timestamp for user:', userId);
          } catch (fsErr) {
            console.warn('Firestore login timestamp note:', fsErr.code, fsErr.message);
          }
        }

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
    let userData = null;
    let userId = null;

    // 1. Attempt backend registration
    try {
      const res = await api.post('/auth/register', formData);
      if (res && res.success) {
        localStorage.setItem('tenlea_token', res.token);
        userData = {
          ...res.data,
          username: res.data.username || (res.data.name || 'user').toLowerCase().replace(/\s+/g, '')
        };
        userId = userData._id || userData.id;
      }
    } catch (apiErr) {
      console.warn('Backend API register note, attempting direct Firestore save:', apiErr.message);
      // Generate a document reference ID for direct client registration
      const newDocRef = doc(collection(db, 'users'));
      userId = newDocRef.id;
      userData = {
        _id: userId,
        id: userId,
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone,
        role: formData.role || 'VEHICLE_OWNER',
        accountStatus: 'ACTIVE',
        kycStatus: 'PENDING',
        username: (formData.name || 'user').toLowerCase().replace(/\s+/g, ''),
      };
      localStorage.setItem('tenlea_token', `token_${userId}`);
    }

    // 2. Direct Cloud Firestore write
    if (userId) {
      try {
        const firestoreUserData = {
          _id: userId,
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim(),
          role: formData.role === 'LANDOWNER' ? 'LANDOWNER' : 'VEHICLE_OWNER',
          accountStatus: 'ACTIVE',
          kycStatus: 'PENDING',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        console.log('📝 [Firestore]: Saving new user document to "users" collection...', firestoreUserData);
        await setDoc(doc(db, 'users', String(userId)), firestoreUserData, { merge: true });
        console.log('✅ [Firestore Success]: Saved user document to Firestore with ID:', userId);
      } catch (fsErr) {
        console.error('❌ [Firestore User Write Error]:', fsErr.code, fsErr.message);
      }
    }

    if (userData) {
      localStorage.setItem('tenlea_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }

    throw new Error('Could not complete user registration.');
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

        // Sync to Firestore
        const userId = userData._id || userData.id;
        if (userId) {
          try {
            await setDoc(doc(db, 'users', String(userId)), {
              name: userData.name,
              email: userData.email,
              role: userData.role,
              lastLogin: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }, { merge: true });
            console.log('✅ [Firestore Success]: Synced social login user to Firestore:', userId);
          } catch (fsErr) {
            console.warn('Firestore social sync note:', fsErr.code, fsErr.message);
          }
        }

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

      const userId = user._id || user.id;
      if (userId) {
        setDoc(doc(db, 'users', String(userId)), { role: newRole.toUpperCase() }, { merge: true })
          .then(() => console.log('✅ [Firestore Success]: Updated user role in Firestore:', newRole))
          .catch((e) => console.warn('Firestore switchRole note:', e.message));
      }
    }
  };

  const updateUserProfile = async (newFields) => {
    if (user) {
      const userId = user._id || user.id;

      // 1. Direct Cloud Firestore write
      if (userId) {
        try {
          console.log('📝 [Firestore]: Updating user profile in "users" collection:', userId);
          await setDoc(doc(db, 'users', String(userId)), {
            ...newFields,
            updatedAt: serverTimestamp(),
          }, { merge: true });
          console.log('✅ [Firestore Success]: Updated user profile in Firestore for ID:', userId);
        } catch (fsErr) {
          console.error('❌ [Firestore Profile Update Error]:', fsErr.code, fsErr.message);
        }
      }

      // 2. Sync to API backend
      try {
        const res = await api.put('/auth/profile', newFields);
        const serverData = res?.data || newFields;
        const updated = { ...user, ...serverData };
        localStorage.setItem('tenlea_user', JSON.stringify(updated));
        setUser(updated);
        return updated;
      } catch (err) {
        console.warn('API profile update warn, falling back to local state:', err.message);
        const updated = { ...user, ...newFields };
        localStorage.setItem('tenlea_user', JSON.stringify(updated));
        setUser(updated);
        return updated;
      }
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
