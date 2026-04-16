import React from 'react';
import { 
  LayoutDashboard, MessageSquare, Briefcase, Settings, 
  LogOut, Bell, User, PlusCircle, Bookmark, ShieldCheck,
  TrendingUp, Clock
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../Header';
import Logo from '../ui/Logo';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout, switchRole } = useAuth();
  
  const currentRole = user?.activeRole || 'client';

  const menuItems = currentRole === 'freelancer' ? [
    { icon: <LayoutDashboard size={20} />, label: 'Обзор', path: '/dashboard' },
    { icon: <Briefcase size={20} />, label: 'Мои кворки', path: '/freelancer/kworks' },
    { icon: <MessageSquare size={20} />, label: 'Чат', path: '/chat' },
    { icon: <TrendingUp size={20} />, label: 'Аналитика', path: '/analytics' },
    { icon: <Settings size={20} />, label: 'Настройки', path: '/settings' },
  ] : [
    { icon: <LayoutDashboard size={20} />, label: 'Мои проекты', path: '/dashboard' },
    { icon: <PlusCircle size={20} />, label: 'Создать кворк', path: '/create' },
    { icon: <MessageSquare size={20} />, label: 'Чат', path: '/chat' },
    { icon: <Bookmark size={20} />, label: 'Избранное', path: '/favorites' },
    { icon: <Settings size={20} />, label: 'Настройки', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-light flex flex-col font-space">
      <Header />
      
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col gap-6 flex-shrink-0">
          {/* Logo in Sidebar */}
          <div className="px-6 mb-2">
             <Logo className="h-10" />
          </div>
          
          {/* Profile Card */}
          <div className="bg-white border-2 border-secondary rounded-positivus p-6 shadow-positivus">
             <div className="flex items-center gap-4 mb-6 pb-6 border-b border-light">
                <div className="w-14 h-14 bg-primary rounded-full border-2 border-secondary flex items-center justify-center text-xl font-bold">
                  {user.avatar || '👤'}
                </div>
                <div>
                  <p className="font-bold text-lg leading-none mb-1">{user.name}</p>
                  <p className="text-xs opacity-50 uppercase tracking-wider">{currentRole === 'client' ? 'Покупатель' : 'Продавец'}</p>
                </div>
             </div>

             {/* Role Info / Quick Stats */}
             <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <span className="text-sm opacity-60">Баланс</span>
                   <span className="font-bold">{(user.balance || 0).toLocaleString()} ₽</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-sm opacity-60">Рейтинг</span>
                   <div className="flex items-center gap-1 font-bold text-sm">
                      <TrendingUp size={14} className="text-primary" /> 5.0
                   </div>
                </div>
             </div>
          </div>

          {/* KPI Bars (Only for Sellers) */}
          {currentRole === 'freelancer' && (
            <div className="bg-white border-2 border-secondary rounded-positivus p-6 shadow-positivus flex flex-col gap-5">
               <h4 className="font-bold text-sm uppercase opacity-40">Показатели</h4>
               
               {[
                 { label: 'Ответственность', val: 98 },
                 { label: 'Заказы вовремя', val: 100 },
                 { label: 'Скорость ответа', val: 92 },
               ].map(kpi => (
                 <div key={kpi.label} className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span>{kpi.label}</span>
                       <span>{kpi.val}%</span>
                    </div>
                    <div className="w-full h-2 bg-light rounded-full overflow-hidden border border-secondary/5">
                       <div className="h-full bg-primary" style={{ width: `${kpi.val}%` }}></div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  location.pathname === item.path
                    ? 'bg-primary border-2 border-secondary shadow-positivus'
                    : 'text-secondary/60 hover:text-secondary hover:bg-white hover:border-2 hover:border-secondary transition-all'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all mt-auto"
          >
            <LogOut size={20} />
            Выйти
          </button>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 min-w-0">
          {children}
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
