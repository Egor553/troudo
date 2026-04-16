import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Wallet, ChevronDown, Menu, X,
  User, Settings, LogOut, Layers, MessageCircle,
  ShoppingBag, Building2, Plus, RefreshCw, ShoppingCart,
  Smartphone, Code, PenTool, BarChart, Video, Briefcase, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './ui/Logo';

const categories = [
  {
    name: 'Дизайн',
    icon: <PenTool size={18} />,
    sub: [
      { name: 'Логотипы', trend: true },
      { name: 'Веб-дизайн', trend: false },
      { name: 'Иллюстрации', trend: false },
      { name: 'ИИ-генерация', trend: true },
    ]
  },
  {
    name: 'Разработка и IT',
    icon: <Code size={18} />,
    sub: [
      { name: 'Сайты под ключ', trend: true },
      { name: 'Чат-боты', trend: true },
      { name: 'Мобильные приложения', trend: false },
      { name: 'Скрипты и парсеры', trend: false },
    ]
  },
  {
    name: 'Тексты',
    icon: <Globe size={18} />,
    sub: [
      { name: 'Статьи', trend: false },
      { name: 'SEO-копирайтинг', trend: true },
      { name: 'Переводы (74 языка)', trend: false },
      { name: 'Сценарии', trend: false },
    ]
  },
  {
    name: 'SEO и трафик',
    icon: <BarChart size={18} />,
    sub: [
      { name: 'Ссылки', trend: true },
      { name: 'Аналитика', trend: false },
      { name: 'Продвижение в топ', trend: true },
    ]
  },
  {
    name: 'Видео и Аудио',
    icon: <Video size={18} />,
    sub: [
      { name: 'Монтаж видео', trend: true },
      { name: 'Озвучка', trend: false },
      { name: 'ИИ-видео', trend: true },
    ]
  },
  {
    name: 'Бизнес',
    icon: <Briefcase size={18} />,
    sub: [
      { name: 'Юристы', trend: false },
      { name: 'Бухгалтерия', trend: false },
      { name: 'Помощники', trend: true },
    ]
  }
];

const Header = () => {
  const { user, isLoggedIn, logout, switchRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(null); 
  const [notifOpen, setNotifOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const megaMenuRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) setMegaMenuOpen(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/catalog?q=${searchQuery}`);
  };

  const currentRole = user?.activeRole || 'client';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-secondary/10 z-50 flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 h-full flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transform hover:scale-105 transition-transform">
            <Logo className="h-9" />
          </Link>

          {/* Search bar */}
          <form className="hidden lg:flex flex-1 max-w-xl relative" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Что вы ищете сегодня?"
              className="w-full bg-light border-2 border-transparent focus:border-secondary transition-all rounded-xl py-2 px-10 outline-none font-medium"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary text-primary px-3 py-1 rounded-lg text-sm font-bold">
              Найти
            </button>
          </form>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {!isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link to="/catalog" className="font-bold hover:text-primary transition-colors">Услуги</Link>
                <Link to="/exchange" className="font-bold hover:text-primary transition-colors">Биржа</Link>
                <Link to="/login" className="btn-outline px-6 py-2">Войти</Link>
                <Link to="/register" className="btn-primary px-6 py-2">Начать</Link>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-5 mr-4 pr-6 border-r border-secondary/10">
                  {currentRole === 'freelancer' ? (
                    <>
                      <Link to="/dashboard" className="flex items-center gap-2 font-bold text-sm hover:text-primary transition-all">
                        <Layers size={16} /> Мои кворки
                      </Link>
                      <Link to="/exchange" className="flex items-center gap-2 font-bold text-sm hover:text-primary transition-all">
                        <Building2 size={16} /> Биржа
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/orders" className="flex items-center gap-2 font-bold text-sm hover:text-primary transition-all">
                        <ShoppingBag size={16} /> Мои проекты
                      </Link>
                      <Link to="/exchange" className="flex items-center gap-2 font-bold text-sm hover:text-primary transition-all">
                        <Plus size={16} /> Создать проект
                      </Link>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link to="/chat" className="relative p-2 text-secondary/60 hover:text-secondary transition-all">
                    <MessageCircle size={22} />
                    {user.unreadMessages > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-secondary text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                        {user.unreadMessages}
                      </span>
                    )}
                  </Link>

                  <div className="relative" ref={notifRef}>
                    <button 
                      onClick={() => setNotifOpen(!notifOpen)}
                      className="p-2 text-secondary/60 hover:text-secondary transition-all"
                    >
                      <Bell size={22} />
                      {user.unreadNotifs > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-secondary text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                          {user.unreadNotifs}
                        </span>
                      )}
                    </button>
                    {notifOpen && (
                      <div className="absolute top-12 right-0 w-64 bg-white border border-secondary/10 shadow-positivus rounded-positivus p-4 z-50">
                         <p className="font-bold text-sm mb-2">Уведомления</p>
                         <div className="text-xs opacity-50">У вас нет новых уведомлений</div>
                      </div>
                    )}
                  </div>

                  <Link to="/settings/balance" className="flex items-center gap-2 px-3 py-2 bg-light rounded-xl hover:bg-primary/20 transition-all border border-transparent hover:border-primary">
                    <span className="font-bold text-sm">{(user.balance || 0).toLocaleString()} ₽</span>
                    <Wallet size={16} className="text-secondary/40" />
                  </Link>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-light transition-all"
                  >
                    <div className="w-10 h-10 bg-primary rounded-full border border-secondary flex items-center justify-center font-bold text-secondary">
                      {user.avatar || '👤'}
                    </div>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-14 right-0 w-64 bg-white border border-secondary/10 shadow-positivus rounded-positivus p-4 flex flex-col gap-2">
                       <div className="px-3 py-2 mb-2 border-b border-light pb-4">
                          <p className="font-bold text-secondary leading-none mb-1">{user.name}</p>
                          <p className="text-xs opacity-50 capitalize">{currentRole === 'client' ? 'Покупатель' : 'Исполнитель'}</p>
                       </div>
                       
                       <button 
                         onClick={() => { switchRole(currentRole === 'client' ? 'freelancer' : 'client'); setDropdownOpen(false); }}
                         className="flex items-center gap-3 px-3 py-2 text-sm font-bold bg-primary rounded-lg text-secondary border border-secondary shadow-positivus hover:translate-y-1 hover:shadow-none transition-all"
                       >
                         <RefreshCw size={16} />
                         Переключить на {currentRole === 'client' ? 'Продавца' : 'Покупателя'}
                       </button>

                       <div className="h-4" />
                       
                       <Link to="/profile" className="flex items-center gap-3 px-3 py-2 hover:bg-light rounded-lg transition-all text-sm font-medium">
                          <User size={16} /> Мой профиль
                       </Link>
                       <Link to="/settings" className="flex items-center gap-3 px-3 py-2 hover:bg-light rounded-lg transition-all text-sm font-medium border-b border-light pb-3 mb-1">
                          <Settings size={16} /> Настройки
                       </Link>
                       <button onClick={() => { logout(); navigate('/'); setDropdownOpen(false); }} className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 text-red-500 rounded-lg transition-all text-sm font-bold">
                          <LogOut size={16} /> Выход
                       </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
             <Menu size={28} />
          </button>
        </div>

        {!mobileOpen && (
          <div className="hidden md:block border-t border-secondary/5 h-12 bg-white px-6">
            <div className="max-w-7xl mx-auto h-full flex items-center gap-8 overflow-x-auto no-scrollbar">
               {categories.map((cat) => (
                 <div 
                   key={cat.name} 
                   className="relative group h-full"
                   onMouseEnter={() => setMegaMenuOpen(cat.name)}
                   onMouseLeave={() => setMegaMenuOpen(null)}
                 >
                   <button className="h-full flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-all border-b-2 border-transparent hover:border-primary pt-1">
                      {cat.name}
                   </button>
                   
                   {megaMenuOpen === cat.name && (
                     <div className="absolute top-12 left-0 w-64 bg-white border border-secondary/10 shadow-positivus rounded-positivus p-6 z-50 animate-in fade-in slide-in-from-top-2">
                        <h4 className="font-bold mb-4 text-xs tracking-widest uppercase opacity-40">{cat.name}</h4>
                        <ul className="flex flex-col gap-3">
                           {cat.sub.map((sub) => (
                             <li key={sub.name} className="flex items-center justify-between group/item">
                               <Link to={`/catalog?sub=${sub.name}`} className="text-sm font-medium hover:text-primary transition-all">
                                 {sub.name}
                               </Link>
                               {sub.trend && <span className="text-xs">🔥</span>}
                             </li>
                           ))}
                        </ul>
                     </div>
                   )}
                 </div>
               ))}
            </div>
          </div>
        )}
      </header>

      <div className="h-20 md:h-32" />
    </>
  );
};

export default Header;
