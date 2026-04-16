import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/layout/Footer';
import { ChevronRight, Filter, Star, Clock, Zap } from 'lucide-react';

const categoryData = {
  'design': {
    title: 'Дизайн',
    desc: 'Эти профи помогут создать стиль, который влюбит в себя ваших клиентов.',
    sub: [
      { name: 'Логотипы', icon: '🎨', count: 1240 },
      { name: 'Веб-дизайн', icon: '💻', count: 850 },
      { name: 'Иллюстрации', icon: '🖋️', count: 430 },
      { name: 'ИИ-генерация', icon: '🤖', count: 120 },
    ]
  },
  'it': {
    title: 'Разработка и IT',
    desc: 'Создадим всё: от одностраничников до сложных нейросетей.',
    sub: [
      { name: 'Сайты под ключ', icon: '🚀', count: 2100 },
      { name: 'Чат-боты', icon: '🤖', count: 1540 },
      { name: 'Приложения', icon: '📱', count: 320 },
    ]
  }
};

const CategoryHub = () => {
  const { slug } = useParams();
  const cat = categoryData[slug] || categoryData['design'];

  return (
    <div className="min-h-screen bg-light">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 pt-16 md:pt-28 flex flex-col gap-12">
         {/* Breadcrumbs */}
         <div className="flex items-center gap-2 text-[10px] font-bold opacity-40 uppercase tracking-widest pt-20">
            <Link to="/" className="hover:text-primary transition-all">Главная</Link>
            <ChevronRight size={14} />
            <span className="text-secondary">{cat.title}</span>
         </div>

         {/* Hero Title */}
         <div className="max-w-2xl">
            <span className="heading-lime text-sm font-bold mb-4">Категория</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{cat.title}</h1>
            <p className="text-xl opacity-60 font-medium leading-relaxed">{cat.desc}</p>
         </div>

         <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar List */}
            <aside className="hidden lg:flex w-64 flex-col gap-8 flex-shrink-0">
               <div className="bg-white border-2 border-secondary rounded-positivus p-6 shadow-positivus">
                  <h4 className="font-bold mb-6 flex items-center gap-2">
                     <Filter size={18} /> Направления
                  </h4>
                  <ul className="flex flex-col gap-4 font-bold text-sm">
                     {cat.sub.map(s => (
                       <li key={s.name}>
                          <Link to="#" className="opacity-50 hover:opacity-100 hover:text-primary transition-all block">
                             {s.name}
                          </Link>
                       </li>
                     ))}
                  </ul>
               </div>
            </aside>

            {/* Visual Grid of Subcategories */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
               {cat.sub.map((sub, i) => (
                 <Link 
                   key={i} 
                   to={`/catalog?sub=${sub.name}`}
                   className={`card-positivus p-8 group overflow-hidden relative ${i % 2 === 0 ? 'bg-white' : 'bg-primary'}`}
                 >
                    <div className="relative z-10">
                       <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500 origin-left inline-block">
                          {sub.icon}
                       </div>
                       <h3 className="text-2xl font-bold mb-2">{sub.name}</h3>
                       <p className="text-sm font-bold opacity-40 group-hover:opacity-100 transition-all">
                          {sub.count} активных услуг
                       </p>
                    </div>
                    
                    {/* Background abstract decoration */}
                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full border-4 border-secondary/10 group-hover:scale-150 transition-all duration-700 ${i % 2 === 0 ? 'bg-primary/5' : 'bg-white/20'}`}></div>
                 </Link>
               ))}
            </div>
         </div>

         {/* SEO / Trust Block */}
         <div className="bg-secondary rounded-positivus p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 mt-12 shadow-2xl">
            <div className="max-w-lg">
               <h2 className="text-3xl font-bold mb-4">Начните свой проект в категории {cat.title}</h2>
               <p className="opacity-60 font-medium">Мы гарантируем безопасность каждой сделки и возврат средств, если результат вас не устроит.</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold tracking-tight">100%</span>
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Безопасность</span>
               </div>
               <div className="w-[1px] h-10 bg-white/10"></div>
               <button className="btn-primary shadow-none border-white/20 hover:bg-white hover:text-secondary group underline-none no-underline">
                  <Zap size={20} className="text-primary group-hover:text-secondary" /> Подобрать исполнителя
               </button>
            </div>
         </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryHub;
