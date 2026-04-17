import React from 'react';
import Header from '../components/Header';
import { Plus, ArrowUpRight, Search, Filter, Clock, Tag, User2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Exchange = () => {
  const { user } = useAuth();

  const connectsLeft = 24;

  const projects = [
    {
      title: 'Нужно собрать базу данных 100 тыс. контактов',
      desc: 'Требуется парсинг сайта объявлений. Данные в Excel: телефон, имя, категория.',
      budgetMin: '8 000 ₽',
      budgetMax: '15 000 ₽',
      responses: 12,
      time: '2 часа назад',
      buyer: { name: 'IT Solutions', projects: 42, country: 'Россия' },
    },
    {
      title: 'Настройка контекстной рекламы в Яндекс.Директ',
      desc: 'Для ниши отопительных систем. Бюджет на рекламу 100к. Нужно собрать семантику.',
      budgetMin: '4 000 ₽',
      budgetMax: '7 000 ₽',
      responses: 5,
      time: '40 минут назад',
      buyer: { name: 'Global Invest', projects: 3, country: 'Казахстан' },
    },
    {
      title: 'Создать лендинг для IT-стартапа',
      desc: 'Нужен современный одностраничник: структура, дизайн, адаптив и подключение формы.',
      budgetMin: '10 000 ₽',
      budgetMax: '18 000 ₽',
      responses: 9,
      time: '1 час назад',
      buyer: { name: 'StartLab', projects: 11, country: 'Беларусь' },
    },
  ];

  return (
    <div className="min-h-screen bg-light">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 pt-28">
         {/* Head Area */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
               <h1 className="text-4xl font-bold mb-2 tracking-tight">Биржа проектов</h1>
               <p className="opacity-50 font-medium">Найдите подходящую задачу и предложите свои услуги.</p>
            </div>
            <div className="flex items-center gap-4">
               {user?.activeRole === 'client' ? (
                  <button className="btn-primary flex items-center gap-2 px-8 py-4">
                     <Plus size={20} /> Создать проект
                  </button>
               ) : (
                  <div className="bg-white border-2 border-secondary rounded-xl p-4 flex items-center gap-6 shadow-sm">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Осталось откликов (connects)</span>
                        <span className="text-xl font-bold">{connectsLeft} / 30</span>
                     </div>
                     <button className="bg-primary text-secondary w-10 h-10 rounded-lg flex items-center justify-center border border-secondary shadow-positivus hover:translate-y-1 hover:shadow-none transition-all">
                        <Plus size={20} />
                     </button>
                  </div>
               )}
            </div>
         </div>

         <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 flex flex-col gap-8">
               <div className="bg-white border-2 border-secondary rounded-positivus p-6 shadow-positivus">
                  <h4 className="font-bold flex items-center gap-2 mb-6">
                     <Filter size={18} className="text-primary" /> Фильтры
                  </h4>
                  
                  <div className="flex flex-col gap-6">
                     <div>
                        <label className="text-xs font-bold opacity-40 uppercase mb-3 block">Цена</label>
                        <div className="flex items-center gap-2">
                           <input type="text" placeholder="От" className="w-full bg-light border-b border-secondary/10 p-2 text-sm focus:border-primary outline-none" />
                           <input type="text" placeholder="До" className="w-full bg-light border-b border-secondary/10 p-2 text-sm focus:border-primary outline-none" />
                        </div>
                     </div>
                     
                     <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold opacity-40 uppercase block">Уровень покупателя</label>
                        {['Новичок', 'Опытный', 'Топ-клиент'].map(l => (
                           <label key={l} className="flex items-center gap-3 cursor-pointer group">
                              <div className="w-5 h-5 border-2 border-secondary rounded flex items-center justify-center group-hover:bg-primary/20 transition-all"></div>
                              <span className="text-sm font-medium">{l}</span>
                           </label>
                        ))}
                     </div>
                  </div>
               </div>
            </aside>

            {/* Project List */}
            <div className="flex-1 flex flex-col gap-6">
               <div className="flex items-center gap-4 bg-white border-2 border-secondary rounded-xl p-2 px-4 shadow-sm">
                  <Search size={20} className="opacity-20" />
                  <input type="text" placeholder="Поиск по задачам..." className="flex-1 bg-transparent py-2 outline-none font-medium" />
               </div>

               {projects.map((project, i) => (
                  <div key={i} className="bg-white border-2 border-secondary rounded-positivus p-8 shadow-positivus hover:shadow-2xl transition-all group flex flex-col md:flex-row gap-8">
                     <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                           <span className="bg-primary/20 border border-primary text-secondary text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                              <Tag size={12} /> IT & Разработка
                           </span>
                           <span className="text-xs opacity-40 font-bold flex items-center gap-1">
                              <Clock size={14} /> {project.time}
                           </span>
                        </div>
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors leading-tight">
                           {project.title}
                        </h3>
                        <p className="opacity-70 text-sm leading-relaxed line-clamp-2">
                           {project.desc}
                        </p>
                        <div className="flex items-center gap-6 mt-2">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Откликов</span>
                              <span className="font-bold text-sm text-primary">{project.responses}</span>
                           </div>
                           <div className="flex flex-col border-l border-secondary/10 pl-6">
                              <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Заказчик</span>
                              <span className="font-bold text-sm flex items-center gap-1">
                                <User2 size={14} className="opacity-50" /> {project.buyer.name}
                              </span>
                           </div>
                           <div className="flex flex-col border-l border-secondary/10 pl-6">
                              <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Данные заказчика</span>
                              <span className="font-bold text-sm">
                                {project.buyer.projects} проектов, {project.buyer.country}
                              </span>
                           </div>
                        </div>
                     </div>
                     <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-secondary/10 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                        <div>
                           <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Бюджет (мин/макс)</span>
                           <p className="text-2xl font-bold text-secondary">
                             {project.budgetMin} - {project.budgetMax}
                           </p>
                        </div>
                        <button className="btn-primary w-full py-4 flex items-center justify-center gap-2 group-hover:shadow-positivus transition-all">
                           Откликнуться <ArrowUpRight size={18} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </main>
    </div>
  );
};

export default Exchange;
