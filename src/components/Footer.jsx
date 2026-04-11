import React from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo-footer gradient-text">Troudo</Link>
          <p className="footer-tagline">Биржа фриланса с комиссией 5%</p>
        </div>
        
        <div className="footer-links">
          <h4>Платформа</h4>
          <Link to="/about">О нас</Link>
          <Link to="/rules">Правила</Link>
          <Link to="/policy">Политика конфиденциальности</Link>
          <Link to="/contacts">Контакты</Link>
        </div>

        <div className="footer-social">
          <h4>Мы в соцсетях</h4>
          <div className="social-icons">
            <a href="#" className="social-btn"><Send size={18} /></a>
            <a href="#" className="social-btn" style={{fontSize: '14px', fontWeight: 700}}>VK</a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; 2024 Troudo. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
