import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Users, ShoppingBag } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
  const [onlineCount, setOnlineCount] = useState(1240);
  const [lastOrderTime] = useState('2 мин. назад');

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-secondary/10 bg-white px-4 py-12 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/">
              <Logo className="h-8" />
            </Link>
            <p className="mt-3 max-w-sm text-sm text-secondary/60">
              Платформа для безопасной работы с фриланс-услугами.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-secondary">О проекте</h4>
            <ul className="space-y-2 text-sm text-secondary/60">
              <li><Link to="/about" className="hover:text-secondary">О нас</Link></li>
              <li><Link to="/team" className="hover:text-secondary">Команда</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-secondary">Помощь</h4>
            <ul className="space-y-2 text-sm text-secondary/60">
              <li><Link to="/faq" className="hover:text-secondary">FAQ</Link></li>
              <li><Link to="/support" className="hover:text-secondary">Поддержка</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-secondary">Правила</h4>
            <ul className="space-y-2 text-sm text-secondary/60">
              <li><Link to="/terms" className="hover:text-secondary">Соглашение</Link></li>
              <li><Link to="/privacy" className="hover:text-secondary">Конфиденциальность</Link></li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-positivus border border-secondary/15 bg-light p-4 md:grid-cols-3">
          <div className="flex items-center gap-2 text-sm font-medium text-secondary">
            <Users size={16} className="text-primary" />
            Онлайн пользователи: <span className="font-bold">{onlineCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-secondary">
            <ShoppingBag size={16} className="text-primary" />
            Последний заказ: <span className="font-bold">{lastOrderTime}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-secondary">
            <span className="font-bold">Блог</span>
            <Link to="/blog" className="text-secondary/60 hover:text-secondary">Статьи</Link>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-secondary/10 pt-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <a href="https://t.me/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-secondary/20 px-3 py-2 text-sm text-secondary hover:bg-light">
              <Send size={14} /> Telegram
            </a>
            <a href="https://vk.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-secondary/20 px-3 py-2 text-sm text-secondary hover:bg-light">
              VK
            </a>
          </div>
          <p className="text-xs text-secondary/50">© 2026 Troudo</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
