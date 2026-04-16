import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/layout/Footer';
import { 
  User, Shield, Wallet, Bell, Camera, 
  ChevronRight, Save, Clock, Globe, Lock, Smartphone 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // profile, general, finance, notifications
  const [aboutMe, setAboutMe] = useState('');

  const tabs = [
    { id: 'general', label: 'Общие', icon: <Lock size={18} /> },
    { id: 'profile', label: 'Профиль', icon: <User size={18} /> },
    { id: 'finance', label: 'Финансы', icon: <Wallet size={18} /> },
    { id: 'notifications', label: 'Рассылки', icon: <Bell size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-light">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-12 pt-28 pb-32">
         <div className="flex items-center gap-2 text-[10px] font-bold opacity-40 uppercase tracking-widest mb-10 pt-10">
            <span>Кабинет</span>
            <ChevronRight size={14} />
            <span className="text-secondary">Настройки</span>
         </div>

         <h1 className="text-4xl font-bold mb-12">Настройки аккаунта</h1>

         <div className="flex flex-col lg:flex-row gap-12">
            {/* Tabs Sidebar */}
            <aside className="w-full lg:w-64 flex flex-col gap-2">
               {tabs.map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all text-sm ${
                     activeTab === tab.id 
                       ? 'bg-primary border-2 border-secondary shadow-positivus' 
                       : 'bg-white border-2 border-transparent hover:border-secondary/20 opacity-60 hover:opacity-100'
                   }`}
                 >
                    {tab.icon} {tab.label}
                 </button>
               ))}
            </aside>

            {/* Content Area */}
            <div className="flex-1 bg-white border-2 border-secondary rounded-positivus p-8 md:p-12 shadow-positivus relative min-h-[500px]">
               
               {/* TAB: PROFILE */}
               {activeTab === 'profile' && (
                 <div className="flex flex-col gap-10 animate-in fade-in duration-300">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                       <div className="relative group">
                          <div className="w-24 h-24 bg-primary rounded-full border-2 border-secondary flex items-center justify-center text-3xl font-bold overflow-hidden">
                             {user?.avatar || '👤'}
                          </div>
                          <button className="absolute -bottom-1 -right-1 bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white hover:bg-primary hover:text-secondary hover:scale-110 transition-all">
                             <Camera size={14} />
                          </button>
                       </div>
                       <div>
                          <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
                          <p className="text-sm opacity-50 font-medium uppercase tracking-wider">ID: 882731</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase opacity-40">Специализация</label>
                          <input type="text" placeholder="Например: UI/UX Дизайнер" className="bg-light border-b-2 border-secondary/5 focus:border-primary outline-none py-2 font-medium" />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase opacity-40">Страна / Город</label>
                          <input type="text" placeholder="Москва, Россия" className="bg-light border-b-2 border-secondary/5 focus:border-primary outline-none py-2 font-medium" />
                       </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <div className="flex justify-between items-end">
                          <label className="text-xs font-bold uppercase opacity-40">О себе</label>
                          <span className={`text-[10px] font-bold ${aboutMe.length < 200 ? 'text-red-500' : 'text-green-500'}`}>
                             {aboutMe.length} / 1200 симв. {aboutMe.length < 200 && '(Минимум 200)'}
                          </span>
                       </div>
                       <textarea 
                         className="w-full bg-light border-2 border-secondary/5 focus:border-primary outline-none p-4 rounded-xl min-h-[160px] font-medium leading-relaxed"
                         placeholder="Расскажите о своем опыте..."
                         value={aboutMe}
                         onChange={(e) => setAboutMe(e.target.value)}
                       />
                    </div>
                 </div>
               )}

               {/* TAB: FINANCE */}
               {activeTab === 'finance' && (
                 <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                    <div className="bg-light p-8 rounded-positivus border-2 border-secondary border-dashed flex items-center justify-between gap-8">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-secondary shadow-sm">
                             <Smartphone size={24} className="text-primary" />
                          </div>
                          <div>
                             <h4 className="font-bold mb-1">Верификация телефона</h4>
                             <p className="text-xs opacity-50 font-medium">Обязательно для вывода средств</p>
                          </div>
                       </div>
                       <button className="btn-primary py-3 px-6 shadow-none border-secondary/20">Подтвердить</button>
                    </div>

                    <div className="flex flex-col gap-6 pt-6 border-t border-light">
                       <h4 className="font-bold text-xl">Способы вывода</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {['СБП (Номер телефона)', 'Карты РФ (Мир/Visa)', 'WebMoney (WMZ)', 'USDT (TRC20)'].map(m => (
                            <button key={m} className="p-6 border-2 border-light rounded-xl flex items-center justify-between group hover:border-secondary hover:shadow-positivus transition-all">
                               <span className="font-bold">{m}</span>
                               <span className="text-xs font-bold opacity-0 group-hover:opacity-40 transition-all uppercase tracking-widest">Привязать</span>
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
               )}

               {/* TAB: NOTIFICATIONS */}
               {activeTab === 'notifications' && (
                 <div className="flex flex-col gap-10 animate-in fade-in duration-300">
                    <div className="flex flex-col gap-6">
                       <h4 className="font-bold text-xl pb-4 border-b border-light">E-mail уведомления</h4>
                       {[
                         { title: 'Заказы и проекты', desc: 'Новые отклики, изменения статусов и споры' },
                         { title: 'Чат и сообщения', desc: 'Уведомлять, если я не в сети более 15 минут' },
                         { title: 'Биржа проектов', desc: 'Новые заказы по моим специализациям' },
                         { title: 'Новости платформы', desc: 'Опросы, обновления и полезные материалы' },
                       ].map((item, i) => (
                         <label key={i} className="flex items-start justify-between gap-8 cursor-pointer group">
                            <div className="flex-1">
                               <p className="font-bold mb-1 group-hover:text-primary transition-all">{item.title}</p>
                               <p className="text-xs opacity-50 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                            <div className="relative inline-flex items-center cursor-pointer pt-1">
                               <input type="checkbox" defaultChecked className="sr-only peer" />
                               <div className="w-11 h-6 bg-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-secondary/10"></div>
                            </div>
                         </label>
                       ))}
                    </div>
                 </div>
               )}

               {/* TAB: GENERAL */}
               {activeTab === 'general' && (
                 <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase opacity-40">Email адрес</label>
                          <input type="email" value="alex***@gmail.com" disabled className="bg-light/50 border-b-2 border-secondary/5 py-2 font-medium opacity-50" />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase opacity-40">Часовой пояс</label>
                          <select className="bg-transparent border-b-2 border-secondary/5 focus:border-primary outline-none py-2 font-medium appearance-none">
                             <option>(GMT+03:00) Москва</option>
                             <option>(GMT+00:00) London</option>
                             <option>(GMT+05:00) Dubai</option>
                          </select>
                       </div>
                    </div>
                    <div className="pt-6 border-t border-light flex flex-col gap-4">
                       <h4 className="font-bold">Безопасность</h4>
                       <button className="text-sm font-bold text-secondary/60 hover:text-red-500 w-max transition-all">Сбросить пароль</button>
                    </div>
                 </div>
               )}

               {/* BOTTOM ACTION BAR */}
               <div className="absolute -bottom-10 right-0 left-0 lg:left-auto lg:right-0">
                  <button className="btn-primary py-5 px-12 text-lg w-full lg:w-max flex items-center justify-center gap-3">
                     <Save size={20} /> Сохранить изменения
                  </button>
               </div>
            </div>
         </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
