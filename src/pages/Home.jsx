import React from 'react';
import Header from '../components/Header';
import Footer from '../components/layout/Footer';
import ServiceCard from '../components/ui/ServiceCard';
import { ArrowLeftRight, ShieldCheck, Zap, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const homeServices = [
  { title: 'UI/UX Дизайн мобильного приложения', category: 'Дизайн', price: '5000', author: 'Anna Design', rating: '4.9', variant: 'light' },
  { title: 'Разработка Telegram ботов на Python', category: 'Backend', price: '12000', author: 'CodeMaster', rating: '5.0', variant: 'lime' },
  { title: 'SMM Продвижение и стратегия', category: 'Маркетинг', price: '8500', author: 'GlowAgency', rating: '4.8', variant: 'dark' },
  { title: 'Профессиональный видеомонтаж Reels', category: 'Контент', price: '3000', author: 'VfxKing', rating: '4.7', variant: 'light' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO SECTION */}
      <section className="bg-white py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 md:mb-8 tracking-tighter">
              Найдите идеального исполнителя для <span className="heading-lime">ваших задач.</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary opacity-80 mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Маркетплейс услуг нового поколения. Прозрачные сделки, проверенные профессионалы и гарантированный результат.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {user ? (
                <Link to="/dashboard" className="btn-primary text-xl">Перейти в кабинет</Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-xl">Начать работу</Link>
                  <Link to="/catalog" className="btn-outline text-xl">Посмотреть услуги</Link>
                </>
              )}
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="w-full aspect-square bg-primary rounded-positivus border-2 border-secondary shadow-positivus flex items-center justify-center p-8 overflow-hidden">
               <div className="grid grid-cols-2 gap-4 transform rotate-6 scale-110">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-32 h-32 lg:w-40 lg:h-40 bg-white border-2 border-secondary p-4 rounded-positivus shadow-positivus flex flex-col justify-between">
                      <div className="w-full h-2 bg-secondary/10 rounded"></div>
                      <div className="w-full h-16 lg:h-20 bg-primary/20 rounded"></div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-32">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 mb-12 md:mb-20">
          <span className="heading-lime text-3xl md:text-4xl font-bold text-center w-full md:w-auto">Популярные услуги</span>
          <p className="text-base md:text-lg opacity-70 max-w-md text-center md:text-left">Выбирайте из сотен доступных категорий и заказывайте услуги в один клик.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {homeServices.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-light py-16 md:py-32 border-y border-secondary/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
           <div className="text-center mb-16 md:mb-20">
            <span className="heading-lime text-3xl md:text-4xl font-bold">Как это работает</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
            {[
              { num: '01', title: 'Найдите услугу', text: 'Выберите подходящего специалиста в каталоге или создайте заказ на бирже.' },
              { num: '02', title: 'Обсудите детали', text: 'Общайтесь напрямую в нашем удобном чате и согласуйте ТЗ.' },
              { num: '03', title: 'Получите результат', text: 'Оплатите работу только после того, как она будет выполнена полностью.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-xl md:text-2xl font-bold border-2 border-secondary mb-6">
                  {step.num}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">{step.title}</h3>
                <p className="opacity-70 leading-relaxed text-sm md:text-base">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-32">
        <div className="bg-secondary rounded-3xl md:rounded-positivus p-8 md:p-20 text-white relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight">Готовы к результату?</h2>
              <p className="text-lg md:text-xl opacity-70 mb-8 md:mb-12 leading-relaxed">Присоединяйтесь к тысячам предпринимателей, которые находят лучших фрилансеров на нашей платформе.</p>
              <button className="bg-primary text-secondary px-8 md:px-10 py-4 md:py-5 rounded-xl text-lg md:text-xl font-bold hover:bg-white transition-all shadow-lg w-full md:w-auto">Заказать кворк</button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: <ShieldCheck className="size-6 md:size-8" />, title: 'Безопасно', text: 'Сделки защищены' },
                { icon: <Zap className="size-6 md:size-8" />, title: 'Быстро', text: 'Исполнитель за 15м' },
                { icon: <ArrowLeftRight className="size-6 md:size-8" />, title: 'Чат', text: 'Прямая связь' },
                { icon: <Star className="size-6 md:size-8" />, title: 'Рейтинг', text: 'Отзывы 5.0' }
              ].map((f, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl md:rounded-positivus hover:bg-white/10 transition-colors">
                  <div className="text-primary mb-3 md:mb-4">{f.icon}</div>
                  <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">{f.title}</h3>
                  <p className="text-[10px] md:text-sm opacity-50 font-light">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;
