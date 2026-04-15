import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-light">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-sm transform rotate-45"></div>
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight">Troudo</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/catalog" className="text-secondary font-medium hover:text-primary transition-colors">Каталог</Link>
          <Link to="/exchange" className="text-secondary font-medium hover:text-primary transition-colors">Биржа</Link>
          
          {user ? (
            <div className="flex items-center gap-6 border-l border-light pl-6">
              <Link to="/chat" className="text-secondary font-medium hover:text-primary transition-colors">Чат</Link>
              <Link to="/dashboard" className="flex items-center gap-2 font-bold hover:text-primary transition-colors">
                 <LayoutDashboard size={18} />
                 Кабинет
              </Link>
              <button onClick={handleLogout} className="text-red-500 opacity-60 hover:opacity-100 transition-all">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="btn-outline px-6 py-2 h-auto text-base">Войти</Link>
              <Link to="/register" className="btn-primary px-6 py-2 h-auto text-base">Начать</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-secondary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-light shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link to="/catalog" className="text-xl font-bold" onClick={() => setIsOpen(false)}>Каталог</Link>
          <Link to="/exchange" className="text-xl font-bold" onClick={() => setIsOpen(false)}>Биржа</Link>
          
          <div className="border-t border-light pt-6 flex flex-col gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                  <LayoutDashboard size={20} /> Личный кабинет
                </Link>
                <Link to="/chat" className="btn-outline flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                  Чат
                </Link>
                <button onClick={handleLogout} className="text-red-500 font-bold py-2">Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-center" onClick={() => setIsOpen(false)}>Войти</Link>
                <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Регистрация</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
