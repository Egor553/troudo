import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Базовый URL API (в проде может быть другим)
  const API_URL = '/api/auth';

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка входа');

    const { token, user: userData } = data;
    
    // Сохраняем и токен, и данные пользователя
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return userData;
  };

  const register = async ({ email, password }) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка регистрации');

    return data; // Возвращаем успех (обычно { email, message })
  };

  const resendVerification = async (email) => {
    const res = await fetch(`${API_URL}/resend-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка отправки');
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const switchRole = (newRole) => {
    if (user && user.roles.includes(newRole)) {
      const updatedUser = { ...user, activeRole: newRole };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isLoggedIn = useMemo(() => !!user, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      resendVerification, 
      switchRole, 
      isLoggedIn, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
