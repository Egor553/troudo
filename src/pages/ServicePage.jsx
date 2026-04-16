import React, { useState } from 'react';
import Header from '../components/Header';
import { 
  Star, Clock, Check, Info, ShieldCheck, 
  ChevronRight, MessageSquare, Heart, Share2 
} from 'lucide-react';

const ServicePage = () => {
  const [activeTab, setActiveTab] = useState('standard'); // economy, standard, business

  const pricing = {
    economy: { price: '5,000', delivery: '2 дня', revisions: '1 правка', info: 'Базовая настройка и 1 вариант дизайна.' },
    standard: { price: '12,000', delivery: '4 дня', revisions: '3 правки', info: 'Полный пакет: исходники + адаптив + 3 варианта дизайна.' },
    business: { price: '25,000', delivery: '7 дней', revisions: 'Безлимитно', info: 'VIP поддержка: приоритет + брендбук + личный менеджер.' },
  };

  const matrix = [
    { label: 'Исходный код', economy: true, standard: true, business: true },
    { label: 'Адаптивность', economy: false, standard: true, business: true },
    { label: 'SEO-оптимизация', economy: false, standard: false, business: true },
    { label: 'Интеграция API', economy: false, standard: true, business: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col lg:flex-row gap-12 pt-28">
        
        {/* Left Column: Content */}
        <div className="flex-1 flex flex-col gap-10">
           {/* Breadcrumbs */}
           <div className="flex items-center gap-2 text-xs font-bold opacity-40 uppercase tracking-widest">
              <span className="hover:text-primary cursor-pointer">Главная</span>
              <ChevronRight size={14} />
              <span className="hover:text-primary cursor-pointer">Разработка и IT</span>
              <ChevronRight size={14} />
              <span className="text-secondary">Скрипты и боты</span>
           </div>

           {/* Hero section */}
           <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-none mb-6">Создание Telegram бота на Python под ключ</h1>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-secondary border border-secondary">А</div>
                    <span className="font-bold">Anna Dev</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <Star size={16} className="fill-primary text-primary" />
                    <span className="font-bold">4.9</span>
                    <span className="opacity-40 text-sm">(124 отзыва)</span>
                 </div>
                 <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/20 text-secondary text-xs font-bold rounded border border-primary">
                    ВЫСШИЙ РЕЙТИНГ
                 </div>
              </div>
           </div>

           {/* Main Image */}
           <div className="aspect-video w-full bg-light rounded-positivus border-2 border-secondary overflow-hidden shadow-positivus relative">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-2/3 h-2/3 bg-white border-2 border-secondary rounded-xl flex items-center justify-center">
                    <div className="text-8xl">🤖</div>
                 </div>
              </div>
           </div>

           {/* Description */}
           <div className="flex flex-col gap-6 max-w-3xl">
              <h3 className="text-2xl font-bold underline decoration-primary decoration-4 underline-offset-4">О кворке</h3>
              <p className="text-lg leading-relaxed opacity-80">
                 Я предлагаю профессиональную разработку Telegram ботов любой сложности. 
                 Работаю на Python с использованием библиотек aiogram или telebot. 
                 Опыт работы более 3 лет, создано более 100 ботов для бизнеса и личного пользования.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {['Интеграция платежей', 'Базы данных (PostgreSQL)', 'Админ-панель', 'Рассылки', 'ИИ-функционал'].map(f => (
                   <li key={f} className="flex items-center gap-2 font-medium">
                      <Check size={18} className="text-primary" /> {f}
                   </li>
                 ))}
              </ul>
           </div>

           {/* Comparison Matrix */}
           <div className="bg-light/30 border-2 border-secondary rounded-positivus p-8 mt-6">
              <h3 className="text-2xl font-bold mb-8">Сравнение пакетов</h3>
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b-2 border-secondary/10">
                       <th className="pb-4 font-bold opacity-40 uppercase text-xs">Параметр</th>
                       <th className="pb-4 text-center font-bold">Эконом</th>
                       <th className="pb-4 text-center font-bold">Стандарт</th>
                       <th className="pb-4 text-center font-bold">Бизнес</th>
                    </tr>
                 </thead>
                 <tbody>
                    {matrix.map((row) => (
                      <tr key={row.label} className="border-b border-secondary/5">
                        <td className="py-4 font-medium opacity-70">{row.label}</td>
                        <td className="py-4 text-center">{row.economy ? <Check className="mx-auto text-primary" /> : <X className="mx-auto opacity-20" size={16} />}</td>
                        <td className="py-4 text-center">{row.standard ? <Check className="mx-auto text-primary" /> : <X className="mx-auto opacity-20" size={16} />}</td>
                        <td className="py-4 text-center">{row.business ? <Check className="mx-auto text-primary" /> : <X className="mx-auto opacity-20" size={16} />}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Instructions for order */}
           <div className="bg-primary/10 border-2 border-primary rounded-positivus p-8">
              <div className="flex items-center gap-3 mb-4">
                 <Info className="text-secondary" />
                 <h3 className="text-2xl font-bold">Что нужно для заказа</h3>
              </div>
              <p className="font-medium opacity-70">Пожалуйста, подготовьте краткое ТЗ: описание логики бота, список команд и данные для тестов. Если нужен хостинг, я помогу с настройкой VDS.</p>
           </div>
        </div>

        {/* Right Column: Sticky Sidebar with Pricing */}
        <aside className="w-full lg:w-[400px] flex flex-col gap-6">
           <div className="sticky top-28 bg-white border-2 border-secondary rounded-positivus shadow-positivus overflow-hidden flex flex-col">
              {/* Tabs */}
              <div className="flex border-b-2 border-secondary">
                 {['economy', 'standard', 'business'].map((t) => (
                   <button 
                     key={t}
                     onClick={() => setActiveTab(t)}
                     className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest transition-all ${
                       activeTab === t ? 'bg-primary text-secondary' : 'bg-white hover:bg-light opacity-40'
                     }`}
                   >
                     {t === 'economy' ? 'Эконом' : t === 'standard' ? 'Стандарт' : 'Бизнес'}
                   </button>
                 ))}
              </div>

              {/* Price Area */}
              <div className="p-8 flex flex-col gap-6">
                 <div className="flex items-center justify-between">
                    <h4 className="text-3xl font-bold">{pricing[activeTab].price} ₽</h4>
                    <span className="text-sm font-bold opacity-40">от 500 ₽ / час</span>
                 </div>
                 
                 <p className="text-sm font-medium leading-relaxed opacity-60">
                    {pricing[activeTab].info}
                 </p>

                 <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm font-bold">
                       <span className="flex items-center gap-2 opacity-40"><Clock size={16} /> Срок выполнения</span>
                       <span>{pricing[activeTab].delivery}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold">
                       <span className="flex items-center gap-2 opacity-40"><RefreshCw size={16} /> Количество правок</span>
                       <span>{pricing[activeTab].revisions}</span>
                    </div>
                 </div>

                 <button className="btn-primary w-full py-5 text-lg shadow-positivus hover:translate-y-1 hover:shadow-none transition-all">
                    Заказать за {pricing[activeTab].price} ₽
                 </button>

                 <div className="flex items-center justify-center gap-6 mt-2">
                    <button className="flex items-center gap-2 text-sm font-bold opacity-40 hover:opacity-100 transition-all hover:text-red-500">
                       <Heart size={18} /> В избранное
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold opacity-40 hover:opacity-100 transition-all hover:text-primary">
                       <Share2 size={18} /> Поделиться
                    </button>
                 </div>
              </div>
              
              <div className="bg-light p-4 text-center border-t border-secondary/10">
                 <p className="text-xs font-bold opacity-40 flex items-center justify-center gap-2 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-primary" /> Безопасная сделка
                 </p>
              </div>
           </div>

           {/* Message Seller */}
           <button className="w-full bg-secondary text-white py-5 rounded-positivus font-bold flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all shadow-positivus hover:translate-y-1 hover:shadow-none">
              <MessageSquare size={20} className="text-primary" /> Написать продавцу
           </button>
        </aside>
      </main>
    </div>
  );
};

export default ServicePage;
