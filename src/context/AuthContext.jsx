import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Имитация первоначальных данных пользователя
  const initialUserData = {
    id: 1,
    name: 'Александр М.',
    username: 'alex_trudo',
    avatar: '👤',
    balance: 45600,
    unreadMessages: 2,
    unreadNotifs: 5,
    roles: ['client', 'freelancer'],
    activeRole: 'client', // 'client' (buyer) или 'freelancer' (seller)
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Для демонстрации при первом запуске установим демо-пользователя
      // В реальном приложении здесь будет проверка сессии через API
      // login(initialUserData); 
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const fullUser = { ...initialUserData, ...userData };
    setUser(fullUser);
    localStorage.setItem('user', JSON.stringify(fullUser));
  };

  const logout = () => {
    setUser(null);
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
    <AuthContext.Provider value={{ user, login, logout, switchRole, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
