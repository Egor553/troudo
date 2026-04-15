import React from 'react';
import Navbar from '../components/layout/Navbar';
import ServiceCard from '../components/ui/ServiceCard';
import { ArrowLeftRight, ShieldCheck, Zap, Star } from 'lucide-react';

const homeServices = [
  { title: 'UI/UX Дизайн мобильного приложения', category: 'Дизайн', price: '5000', author: 'Anna Design', rating: '4.9', variant: 'light' },
  { title: 'Разработка Telegram ботов на Python', category: 'Backend', price: '12000', author: 'CodeMaster', rating: '5.0', variant: 'lime' },
  { title: 'SMM Продвижение и стратегия', category: 'Маркетинг', price: '8500', author: 'GlowAgency', rating: '4.8', variant: 'dark' },
  { title: 'Профессиональный видеомонтаж Reels', category: 'Контент', price: '3000', author: 'VfxKing', rating: '4.7', variant: 'light' },
];

const Home = () => {
  return (
    <div className="min-h-screen pt-20">
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold leading-none mb-8 tracking-tighter">
              Найдите идеального исполнителя для <span className="heading-lime">ваших задач.</span>
            </h1>
            <p className="text-xl text-secondary opacity-80 mb-10 max-w-lg leading-relaxed">
              Маркетплейс услуг нового поколения. Прозрачные сделки, проверенные профессионалы и гарантированный результат в стиле Positivus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary text-xl">Начать работу</button>
              <button className="btn-outline text-xl">Найти исполнителя</button>
            </div>
          </div>
          <div className="relative">
            <div className="w-full aspect-square bg-primary rounded-positivus border-2 border-secondary shadow-positivus flex items-center justify-center p-12 overflow-hidden">
              <div className="grid grid-cols-2 gap-4 transform rotate-6 scale-110">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-40 h-40 bg-white border-2 border-secondary p-4 rounded-positivus shadow-positivus flex flex-col justify-between">
                    <div className="w-full h-2 bg-secondary/10 rounded"></div>
                    <div className="w-2/3 h-2 bg-secondary/10 rounded"></div>
                    <div className="w-full h-20 bg-primary/20 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES / SERVICES */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-20">
          <span className="heading-lime text-4xl font-bold">Популярные услуги</span>
          <p className="text-lg opacity-70 max-w-md">Выбирайте из сотен доступных категорий и заказывайте услуги в один клик с гарантией безопасности.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {homeServices.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-light py-32 border-y border-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-20">
            <span className="heading-lime text-4xl font-bold">Как это работает</span>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { num: '01', title: 'Найдите услугу', text: 'Выберите подходящего специалиста в каталоге или создайте заказ на бирже.' },
              { num: '02', title: 'Обсудите детали', text: 'Общайтесь напрямую в нашем удобном чате и согласуйте ТЗ.' },
              { num: '03', title: 'Получите результат', text: 'Оплатите работу только после того, как она будет выполнена полностью.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold border-2 border-secondary mb-6">
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="opacity-70 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="bg-secondary rounded-positivus p-12 md:p-20 text-white relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-none">Готовы масштабировать свой бизнес?</h2>
              <p className="text-xl opacity-70 mb-12 leading-relaxed">Присоединяйтесь к тысячам предпринимателей, которые находят лучших фрилансеров на нашей платформе.</p>
              <button className="bg-primary text-secondary px-10 py-5 rounded-xl text-xl font-bold hover:bg-white hover:scale-105 transition-all shadow-lg active:translate-y-1">Заказать кворк</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <ShieldCheck size={28} />, title: 'Безопасность', text: 'Средства депонируются до выполнения.' },
                { icon: <Zap size={28} />, title: 'Скорость', text: 'Найдите исполнителя за 15 минут.' },
                { icon: <ArrowLeftRight size={28} />, title: 'Прямой чат', text: 'Общайтесь без посредников.' },
                { icon: <Star size={28} />, title: 'Рейтинг', text: 'Проверенные отзывы заказчиков.' }
              ].map((f, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-positivus hover:bg-white/10 transition-colors">
                  <div className="text-primary mb-4">{f.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm opacity-50 font-light">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-secondary/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-sm transform rotate-45"></div>
          </div>
          <span className="text-2xl font-bold tracking-tight">Troudo</span>
        </div>
        <div className="flex gap-10 opacity-60 font-medium">
          <a href="#" className="hover:text-primary transition-colors">Условия</a>
          <a href="#" className="hover:text-primary transition-colors">Конфиденциальность</a>
          <a href="#" className="hover:text-primary transition-colors">Поддержка</a>
        </div>
        <p className="text-sm opacity-40">© 2026 Troudo Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
