import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Wallet, ChevronDown, Menu, X,
  User, Settings, LogOut, Layers, MessageCircle,
  ShoppingBag, Building2, Plus, RefreshCw, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isLoggedIn, logout, switchRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();


  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/catalog?q=${searchQuery}`);
  };

  return (
    <>
      <header className="header glass">
        <div className="container header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="gradient-text">Troudo</span>
          </Link>

          {/* Search (shown when logged in) */}
          {isLoggedIn && (
            <form className="header-search" onSubmit={handleSearch}>
              <Search size={16} color="var(--text-secondary)" />
              <input 
                type="text" 
                placeholder="Найти услуги" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </form>
          )}

          {/* Desktop Nav */}
          <nav className="nav-desktop">
            {!isLoggedIn ? (
              /* Guest nav */
              <>
                <Link to="/catalog" className="nav-link">Услуги</Link>
                <Link to="/exchange" className="nav-link">Биржа</Link>
                <Link to="/login" className="nav-link">Вход</Link>
                <Link to="/register" className="btn-primary">Регистрация</Link>
              </>
            ) : (
              /* Logged-in nav — кворки, заказы, биржа, чат, колокол, баланс, аватар */
              <>
                {/* Main Nav Links */}
                <Link to="/freelancer/dashboard" className="header-nav-item" id="nav-kworks">
                  <Layers size={16} />
                  <span>Кворки</span>
                </Link>
                <Link to="/orders" className="header-nav-item" id="nav-orders">
                  <ShoppingBag size={16} />
                  <span>Заказы</span>
                </Link>
                <Link to="/catalog" className="header-nav-item" id="nav-catalog">
                  <ShoppingCart size={16} />
                  <span>Услуги</span>
                </Link>
                <Link to="/exchange" className="header-nav-item" id="nav-exchange">
                  <Building2 size={16} />
                  <span>Биржа</span>
                </Link>

                {/* Messages */}
                <Link to="/messages" className="header-icon-btn" id="nav-messages" title="Сообщения">
                  <MessageCircle size={20} />
                  {user.unreadMessages > 0 && (
                    <span className="notif-badge">{user.unreadMessages}</span>
                  )}
                </Link>

                {/* Notifications */}
                <div className="notif-wrap" ref={notifRef}>
                  <button 
                    className="header-icon-btn" 
                    id="nav-notifications"
                    onClick={() => setNotifOpen(!notifOpen)}
                    title="Уведомления"
                  >
                    <Bell size={20} />
                    {user.unreadNotifs > 0 && (
                      <span className="notif-badge">{user.unreadNotifs}</span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="notif-dropdown glass">
                      <div className="notif-header">
                        <span>Уведомления</span>
                        <button className="mark-read-btn">Прочитать все</button>
                      </div>
                      <div className="notif-item unread">
                        <div className="notif-dot" />
                        <div className="notif-content">
                          <p>Новый отзыв на ваш кворк</p>
                          <span>5 минут назад</span>
                        </div>
                      </div>
                      <div className="notif-item">
                        <div className="notif-dot read" />
                        <div className="notif-content">
                          <p>Заказ #42 завершён</p>
                          <span>2 часа назад</span>
                        </div>
                      </div>
                      <Link to="/notifications" className="notif-all-link">Все уведомления →</Link>
                    </div>
                  )}
                </div>

                {/* Balance */}
                <Link to="/settings/balance" className="header-balance" id="nav-balance" title="Баланс">
                  <span className="balance-amount">{(user.balance || 0).toLocaleString()} ₽</span>
                  <Wallet size={16} />
                </Link>

                {/* Avatar + Dropdown */}
                <div className="avatar-wrap" ref={dropdownRef}>
                  <button 
                    className="avatar-btn" 
                    id="nav-profile-menu"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {user.avatar?.length > 4 ? (
                      <img src={user.avatar} alt={user.name} className="header-avatar" />
                    ) : (
                      <div className="header-avatar-emoji">{user.avatar || '👤'}</div>
                    )}
                    <ChevronDown size={14} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="avatar-dropdown glass">
                      <div className="dropdown-user">
                        {user.avatar?.length > 4 ? (
                          <img src={user.avatar} alt={user.name} className="dd-avatar" />
                        ) : (
                          <div className="dd-avatar-emoji">{user.avatar || '👤'}</div>
                        )}
                        <div>
                          <div className="dd-name">{user.name}</div>
                          <div className="dd-username">@{user.username}</div>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <Link to={`/user/${user.username}`} className="dropdown-item">
                        <User size={16} /> Мой профиль
                      </Link>
                      <Link to="/freelancer/dashboard" className="dropdown-item">
                        <Layers size={16} /> Мои кворки
                      </Link>
                      <Link to="/orders" className="dropdown-item">
                        <ShoppingBag size={16} /> Мои заказы
                      </Link>
                      <Link to="/freelancer/create-kwork" className="dropdown-item">
                        <Plus size={16} /> Создать кворк
                      </Link>
                      {/* Role switcher */}
                      {user.roles?.includes('freelancer') && user.roles?.includes('client') && (
                        <>
                          <div className="dropdown-divider" />
                          <button
                            className="dropdown-item"
                            onClick={() => { switchRole(user.activeRole === 'client' ? 'freelancer' : 'client'); setDropdownOpen(false); }}
                          >
                            <RefreshCw size={16} />
                            {user.activeRole === 'client' ? 'Переключиться на фрилансера' : 'Переключиться на клиента'}
                          </button>
                        </>
                      )}
                      <div className="dropdown-divider" />
                      <Link to="/settings" className="dropdown-item">
                        <Settings size={16} /> Настройки
                      </Link>
                      {user.roles?.includes('admin') && (
                        <Link to="/admin" className="dropdown-item admin-item">
                          Панель администратора
                        </Link>
                      )}
                      <div className="dropdown-divider" />
                      <button className="dropdown-item danger" onClick={() => { logout(); navigate('/'); setDropdownOpen(false); }}>
                        <LogOut size={16} /> Выйти
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="menu-mobile" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Category Sub-nav */}
        <div className="category-subnav">
          <div className="container subnav-inner">
            {['Дизайн', 'Разработка и IT', 'Тексты', 'SEO и трафик', 'Соцсети и маркетинг', 'Аудио, видео', 'Бизнес'].map(cat => (
              <Link key={cat} to={`/catalog?cat=${encodeURIComponent(cat)}`} className="subnav-link">{cat}</Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu glass">
            <div className="mobile-menu-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span className="logo" style={{ fontSize: '20px' }}><span className="gradient-text">Troudo</span></span>
                <button onClick={() => setMobileOpen(false)}><X size={24} /></button>
            </div>
            
            {isLoggedIn ? (
              <>
                <Link to={`/user/${user.username}`} className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  <User size={20} /> Мой профиль
                </Link>
                <Link to="/freelancer/dashboard" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  <Layers size={20} /> Мои кворки
                </Link>
                <Link to="/orders" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  <ShoppingBag size={20} /> Мои заказы
                </Link>
                <Link to="/catalog" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  <ShoppingCart size={20} /> Услуги
                </Link>
                <Link to="/exchange" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  <Building2 size={20} /> Биржа
                </Link>
                <Link to="/settings" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  <Settings size={20} /> Настройки
                </Link>
                <div className="dropdown-divider" style={{ margin: '15px 0' }} />
                <button 
                  className="mobile-menu-item" 
                  style={{ color: 'var(--error)' }} 
                  onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
                >
                  <LogOut size={20} /> Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/catalog" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  <ShoppingCart size={20} /> Услуги
                </Link>
                <Link to="/exchange" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  <Building2 size={20} /> Биржа
                </Link>
                <div className="dropdown-divider" style={{ margin: '15px 0' }} />
                <Link to="/login" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  <LogOut size={20} /> Вход
                </Link>
                <Link to="/register" className="btn-primary w-full" style={{ marginTop: '10px' }} onClick={() => setMobileOpen(false)}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Header;
