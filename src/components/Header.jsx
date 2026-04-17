import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Wallet, RefreshCw, Bell, User } from 'lucide-react';
import Logo from './ui/Logo';

const megaMenuColumns = [
  {
    title: 'Дизайн',
    items: [
      { name: 'Логотипы', popular: true },
      { name: 'Баннеры и креативы' },
      { name: 'UI/UX дизайн', popular: true },
      { name: 'Иллюстрации' },
    ],
  },
  {
    title: 'Разработка',
    items: [
      { name: 'Сайты под ключ', popular: true },
      { name: 'Frontend / React' },
      { name: 'Backend / API' },
      { name: 'Telegram боты' },
    ],
  },
  {
    title: 'Маркетинг',
    items: [
      { name: 'Таргетированная реклама', popular: true },
      { name: 'Контекстная реклама' },
      { name: 'SEO-продвижение' },
      { name: 'Email-маркетинг' },
    ],
  },
  {
    title: 'Тексты',
    items: [
      { name: 'Копирайтинг', popular: true },
      { name: 'Сценарии для видео' },
      { name: 'Карточки товаров' },
      { name: 'Редактура и корректура' },
    ],
  },
];

const Header = () => {
  // Достаем всё необходимое из нашего глобального состояния
  const { isAuth, role, balance, logout, switchRole, user } = useAppContext();

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-secondary/10 z-50 px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/">
          <Logo className="h-8" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <div className="group relative">
            <button
              type="button"
              className="font-bold text-sm text-secondary/80 transition-colors hover:text-secondary"
            >
              Категории
            </button>

            <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-5 w-[920px] -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="animate-mega-menu rounded-positivus border-2 border-secondary bg-white p-6 shadow-2xl">
                <div className="grid grid-cols-4 gap-6">
                  {megaMenuColumns.map((column) => (
                    <div key={column.title}>
                      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-secondary/50">
                        {column.title}
                      </h4>
                      <ul className="space-y-2">
                        {column.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              to="/catalog"
                              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-secondary transition hover:bg-light"
                            >
                              <span>{item.name}</span>
                              {item.popular ? (
                                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-secondary">
                                  🔥 популярное
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link to="/exchange" className="font-bold text-sm text-secondary/70 hover:text-secondary transition-colors">
            Биржа
          </Link>
        </nav>

        {isAuth ? (
          <div className="flex items-center gap-6">
            
            {/* Баланс (из контекста) */}
            <div className="flex items-center gap-2 px-4 py-2 bg-light rounded-xl font-bold text-sm">
              <Wallet size={16} className="text-primary" />
              <span>{balance.toLocaleString()} ₽</span>
            </div>

            {/* Кнопка смены роли (из контекста) */}
            <button 
              onClick={switchRole}
              className="flex items-center gap-2 px-4 py-2 border-2 border-secondary rounded-xl text-xs font-bold uppercase transition-all hover:bg-primary active:translate-y-1"
            >
              <RefreshCw size={14} />
              {role === 'buyer' ? 'Режим продавца' : 'Режим покупателя'}
            </button>

            {/* Иконки */}
            <div className="flex items-center gap-4 text-secondary/40">
               <Bell size={20} className="hover:text-secondary cursor-pointer transition-colors" />
               <div className="w-10 h-10 bg-light rounded-full flex items-center justify-center border border-secondary/5">
                  <User size={20} className="text-secondary" />
               </div>
            </div>

            {/* Кнопка выхода */}
            <button onClick={logout} className="text-sm font-bold opacity-40 hover:opacity-100 transition-all">
              Выйти
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="font-bold text-sm">Войти</Link>
            <Link to="/register" className="btn-primary px-6 py-2 text-sm">Начать</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
