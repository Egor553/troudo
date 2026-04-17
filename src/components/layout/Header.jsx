import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Bell, LayoutDashboard, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Dummy categories – replace with real data as needed
const categories = [
  { name: 'Категории', path: '/categories' },
  { name: 'Курсы', path: '/courses' },
  { name: 'Фриланс', path: '/freelance' },
];

const Header = () => {
  const { user, balance, notifications, role, switchRole, logout } = useApp();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement actual search logic here
    const query = e.target.search.value.trim();
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const toggleRole = () => {
    const newRole = role === 'buyer' ? 'seller' : 'buyer';
    switchRole(newRole);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight">Troudo</span>
        </Link>

        {/* Categories */}
        <nav className="hidden md:flex space-x-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 mx-4 max-w-[500px]">
          <div className="relative">
            <input
              name="search"
              type="text"
              placeholder="Поиск…"
              className="w-full rounded-full border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Balance */}
          <div className="text-sm font-medium text-gray-700 hidden sm:block">
            Баланс: {balance?.toLocaleString() || 0} ₽
          </div>

          {/* Chat */}
          <button
            onClick={() => navigate('/chat')}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Чат"
          >
            <MessageSquare size={20} className="text-gray-600" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Уведомления"
          >
            <Bell size={20} className="text-gray-600" />
            {notifications?.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Avatar */}
          <Link
            to="/profile"
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                {user?.name?.[0] ?? 'U'}
              </div>
            )}
          </Link>

          {/* Role switcher */}
          <button
            onClick={toggleRole}
            className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded hover:bg-primary/20 transition"
          >
            {role === 'buyer' ? 'Продавец' : 'Покупатель'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
