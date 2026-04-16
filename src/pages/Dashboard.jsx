import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  ShoppingBag, Star, Clock, CheckCircle, 
  ArrowUpRight, AlertCircle, Sparkles, Briefcase, PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const currentRole = user?.activeRole || 'client';

  // Demo stats logic
  const sellerStats = [
    { label: 'Активные заказы', value: '0', icon: <Clock size={20} />, color: 'bg-white' },
    { label: 'Заработано', value: '0 ₽', icon: <Sparkles size={20} />, color: 'bg-primary' },
    { label: 'Просмотры кворков', value: '0', icon: <Star size={20} />, color: 'bg-white' },
  ];

  const buyerStats = [
    { label: 'Мои проекты', value: '0', icon: <Briefcase size={20} />, color: 'bg-white' },
    { label: 'Всего потрачено', value: '0 ₽', icon: <ShoppingBag size={20} />, color: 'bg-primary' },
    { label: 'Ждут отзыва', value: '0', icon: <AlertCircle size={20} />, color: 'bg-white' },
  ];

  const currentStats = currentRole === 'freelancer' ? sellerStats : buyerStats;

  // Set to empty to show EmptyState in action based on your requirement
  const demoOrders = []; 

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Рабочий стол {currentRole === 'freelancer' ? 'продавца' : 'покупателя'}</h1>
            <p className="opacity-50 font-medium">Рады вас видеть, {user?.name}! 🍀</p>
          </div>
          {currentRole === 'client' ? (
            <Link to="/exchange" className="btn-primary flex items-center gap-2">
               <PlusCircle size={20} /> Создать проект
            </Link>
          ) : (
            <button className="btn-outline flex items-center gap-2">
               Мой публичный профиль <ArrowUpRight size={18} />
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentStats.map((stat, i) => (
            <div key={i} className={`card-positivus p-8 ${stat.color === 'bg-primary' ? 'bg-primary shadow-positivus border-secondary border-2' : 'bg-white'} flex flex-col justify-between h-40`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold text-sm uppercase ${stat.color === 'bg-primary' ? 'opacity-80' : 'opacity-40'}`}>
                  {stat.label}
                </span>
                <div className="p-2 bg-secondary/5 rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Onboarding Widget (Steps to success) */}
        {currentRole === 'freelancer' && (
          <div className="bg-secondary rounded-positivus p-8 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-bold mb-4">5 простых шагов до первого успеха 🚀</h3>
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-secondary text-xs font-bold">✓</div>
                      <span className="text-sm font-medium">Заполнить профиль "О себе"</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-secondary text-xs font-bold">✓</div>
                      <span className="text-sm font-medium">Загрузить аватар</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white/40">3</div>
                      <span className="text-sm font-medium">Создать первый кворк</span>
                   </div>
                   <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '40%' }}></div>
                   </div>
                </div>
             </div>
             <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent hidden md:block"></div>
          </div>
        )}

        {/* Recent Activity / Orders */}
        <div className="flex flex-col gap-6">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Активные заказы</h3>
              {demoOrders.length > 0 && <Link to="/orders" className="text-sm font-bold opacity-40 hover:opacity-100 hover:text-primary transition-all">Смотреть все</Link>}
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {demoOrders.length > 0 ? (
                demoOrders.map((order, i) => (
                  <div key={i} className="bg-white border-2 border-secondary rounded-xl p-6 flex items-center justify-between shadow-sm hover:shadow-positivus transition-all group">
                     {/* Order content */}
                  </div>
                ))
              ) : (
                <EmptyState 
                  icon={currentRole === 'client' ? '🪄' : '📦'} 
                  title={currentRole === 'client' ? 'У вас нет активных проектов' : 'У вас нет активных заказов'}
                  subtitle={currentRole === 'client' ? 'Создайте свой первый проект на Бирже, чтобы найти исполнителя.' : 'Здесь будут отображаться заказы, которые вы взяли в работу.'}
                  actionText={currentRole === 'client' ? 'Создать проект' : 'Найти работу'}
                  actionPath={currentRole === 'client' ? '/exchange' : '/exchange'}
                />
              )}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
