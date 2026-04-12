import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);
const API_URL = 'http://93.77.162.174/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('troudo_token') || null);
  const [loading, setLoading] = useState(true);

  // ── Глобальный хелпер для запросов ──────────────────────
  const apiFetch = useCallback(async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка запроса');
    return data;
  }, [token]);

  // ── ВЫЙТИ ────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('troudo_token');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const userData = await apiFetch('/auth/me');
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Auth sync failed:', err.message);
      logout();
    }
  }, [token, apiFetch, logout]);

  // ── Синхронизация при загрузке ──────────────────────────
  useEffect(() => {
    setLoading(true);
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  // ── РЕГИСТРАЦИЯ ──────────────────────────────────────────
  const register = useCallback(async ({ email, password }) => {
    return await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }, [apiFetch]);

  // ── ПОДТВЕРДИТЬ EMAIL ─────────────────────────────────────
  const verifyEmail = useCallback(async (token) => {
    return await apiFetch('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }, [apiFetch]);

  // ── ВОЙТИ ────────────────────────────────────────────────
  const login = useCallback(async ({ email, password, remember }) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, remember }),
    });

    localStorage.setItem('troudo_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, [apiFetch]);

  // ── ОБНОВИТЬ ПРОФИЛЬ (в т.ч. роль) ────────────────────────
  const updateProfile = useCallback(async (updates) => {
    const updatedUser = await apiFetch('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    setUser(updatedUser);
    return updatedUser;
  }, [apiFetch]);

  // ── ПЕРЕКЛЮЧИТЬ РОЛЬ ──────────────────────────────────────
  const switchRole = useCallback(async (role) => {
    if (!user) return;
    await updateProfile({ activeRole: role });
  }, [user, updateProfile]);

  const value = {
    user,
    token,
    loading,
    isLoggedIn: !!user,
    isClient: user?.activeRole === 'client',
    isFreelancer: user?.activeRole === 'freelancer',
    isAdmin: user?.roles?.includes('admin'),
    register,
    verifyEmail,
    login,
    logout,
    updateProfile,
    switchRole,
    refreshUser,
    apiFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
