import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- СОСТОЯНИЕ ---
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role') || 'buyer'); // buyer / seller
  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ИНИЦИАЛИЗАЦИЯ ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsAuth(true);
      setUser(JSON.parse(savedUser));
      // Здесь в реальном приложении был бы запрос за актуальным балансом и уведомлениями
      setBalance(45600); // Демо
    }
    setLoading(false);
  }, []);

  // --- ФУНКЦИИ ---
  
  // Логин: сохраняем токен, юзера и начальную роль
  const login = async (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', 'buyer'); // По умолчанию заходим как покупатель
    
    setUser(userData);
    setIsAuth(true);
    setRole('buyer');
    setBalance(userData.balance || 0);
  };

  // Выход: чистим всё
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    setIsAuth(false);
    setUser(null);
    setRole('buyer');
    setBalance(0);
    setNotifications([]);
  };

  // Смена роли: сохраняем в localStorage и меняем стейт
  const switchRole = () => {
    const newRole = role === 'buyer' ? 'seller' : 'buyer';
    setRole(newRole);
    localStorage.setItem('role', newRole);
  };

  // Мемоизируем значение контекста для оптимизации
  const value = useMemo(() => ({
    isAuth,
    role,
    user,
    balance,
    notifications,
    loading,
    login,
    logout,
    switchRole,
    setBalance,
    setNotifications
  }), [isAuth, role, user, balance, notifications, loading]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Хук для удобного использования в компонентах
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
