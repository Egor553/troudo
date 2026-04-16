import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Globe, Smartphone, Zap } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
  const [onlineCount, setOnlineCount] = useState(1240);
  const [lastOrderTime, setLastOrderTime] = useState('2 мин. назад');

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-white border-t border-secondary/5 pt-20 pb-10 px-4 md:px-6 font-space">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col gap-6">
             <Link to="/">
                <Logo className="h-9" />
             </Link>
             <p className="opacity-50 text-sm leading-relaxed">
               Маркетплейс фриланс-услуг, где идеи превращаются в реальность. 
               Мы создаем среду для профессионального роста и безопасных сделок.
             </p>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-primary hover:text-secondary transition-all">
                  <Send size={20} />
                </a>
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-primary hover:text-secondary transition-all">
                  <Globe size={20} />
                </a>
              </div>
          </div>

          <div className="flex flex-col gap-6">
             <h4 className="font-bold text-sm uppercase tracking-widest opacity-40">О проекте</h4>
             <ul className="flex flex-col gap-4 font-bold text-sm">
                <li><Link to="/about" className="hover:text-primary transition-all">О Trudo</Link></li>
                <li><Link to="/agreements" className="hover:text-primary transition-all">Соглашение</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-all">Политику конфиденциальности</Link></li>
                <li><Link to="/career" className="hover:text-primary transition-all flex items-center gap-2">Карьера <span className="bg-primary text-[10px] px-1 rounded text-secondary">Hiring</span></Link></li>
             </ul>
          </div>

          <div className="flex flex-col gap-6">
             <h4 className="font-bold text-sm uppercase tracking-widest opacity-40">Пользователям</h4>
             <ul className="flex flex-col gap-4 font-bold text-sm">
                <li><Link to="/help/buyer" className="hover:text-primary transition-all">Покупателям</Link></li>
                <li><Link to="/help/freelancer" className="hover:text-primary transition-all">Фрилансерам</Link></li>
                <li><Link to="/faq" className="hover:text-primary transition-all">Вопросы и ответы</Link></li>
                <li><Link to="/support" className="hover:text-primary transition-all">Техподдержка</Link></li>
             </ul>
          </div>

          <div className="flex flex-col gap-6">
             <h4 className="font-bold text-sm uppercase tracking-widest opacity-40">Мобильные приложения</h4>
             <div className="flex flex-col gap-4">
                <button className="bg-secondary text-white p-4 rounded-xl flex items-center gap-3 hover:translate-y-1 transition-all shadow-positivus">
                   <Smartphone size={24} className="text-primary" />
                   <div className="text-left">
                      <p className="text-[10px] opacity-40 uppercase font-bold leading-none">Download on the</p>
                      <p className="font-bold text-lg leading-none">App Store</p>
                   </div>
                </button>
                <button className="bg-secondary text-white p-4 rounded-xl flex items-center gap-3 hover:translate-y-1 transition-all shadow-positivus">
                   <Globe size={24} className="text-primary" />
                   <div className="text-left">
                      <p className="text-[10px] opacity-40 uppercase font-bold leading-none">Get it on</p>
                      <p className="font-bold text-lg leading-none">Google Play</p>
                   </div>
                </button>
             </div>
          </div>
        </div>

        <div className="border-t border-secondary/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#B9FF66]"></div>
                 <span className="text-xs font-bold uppercase tracking-widest opacity-40">Онлайн: {onlineCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 border-l border-secondary/5 pl-8">
                 <span className="text-xs font-bold uppercase tracking-widest opacity-40">Последний заказ: {lastOrderTime}</span>
              </div>
           </div>
           
           <p className="text-xs font-bold opacity-30 uppercase tracking-widest">
              © 2026 Troudo Marketplace. All rights reserved.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
