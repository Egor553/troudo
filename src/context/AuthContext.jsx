import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * AuthContext — глобальное состояние авторизации.
 * Теперь подключено к реальному backend API.
 */

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // При старте читаем сессию из localStorage
  useEffect(() => {
    try {
      const session = localStorage.getItem('troudo_session');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.token) {
          // В реале: можно сделать /api/auth/me для проверки токена
          setUser(parsed.user);
        } else {
          localStorage.removeItem('troudo_session');
        }
      }
    } catch { }
    setLoading(false);
  }, []);

  // ── РЕГИСТРАЦИЯ ──────────────────────────────────────────
  const register = useCallback(async ({ email, password }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка регистрации');
    
    return { email, token: data.dev_token }; // dev_token только для отладки, если почта не настроена
  }, []);

  // ── ПОДТВЕРДИТЬ EMAIL ─────────────────────────────────────
  const verifyEmail = useCallback(async (token) => {
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка подтверждения');
    
    return true;
  }, []);

  // ── ВОЙТИ ────────────────────────────────────────────────
  const login = useCallback(async ({ email, password, remember }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember }),
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка входа');

    localStorage.setItem('troudo_session', JSON.stringify({ 
        user: data.user, 
        token: data.token 
    }));
    setUser(data.user);
    return data.user;
  }, []);

  // ── ВЫЙТИ ────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('troudo_session');
    setUser(null);
  }, []);

  // Остальные функции (forgot/reset) пока оставим заглушками или добавим позже
  const forgotPassword = useCallback(async (email) => {
    // В будущем: POST /api/auth/forgot
    console.log('Forgot password for:', email);
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    // В будущем: POST /api/auth/reset
    console.log('Resetting password with token:', token);
  }, []);

  const switchRole = useCallback((role) => {
    if (!user) return;
    const updated = { ...user, activeRole: role };
    setUser(updated);
    const session = JSON.parse(localStorage.getItem('troudo_session') || '{}');
    session.user = updated;
    localStorage.setItem('troudo_session', JSON.stringify(session));
  }, [user]);

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isClient: user?.activeRole === 'client',
    isFreelancer: user?.activeRole === 'freelancer',
    isAdmin: user?.roles?.includes('admin'),
    register,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword,
    switchRole,
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
