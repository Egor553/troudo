import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Star, Phone, Calendar, Circle, Heart, Share2, 
  MessageCircle, ShoppingCart, CheckCircle, Award,
  TrendingUp, Clock, Package, ChevronRight
} from 'lucide-react';

// Mock data
const freelancer = {
  username: 'tokarevegor',
  displayName: 'Токарев Егор',
  title: 'Разработчик Telegram-ботов и Mini Apps',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tokarevegor',
  coverImg: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=300&fit=crop',
  bio: 'Разрабатываю Telegram-боты, Mini Apps и сайты с 2022 года. Более 50 выполненных проектов, оборот по некоторым ботам — несколько миллионов в месяц.',
  specializations: [
    'Telegram-боты любой сложности (магазины, воронки, крипто, игры, админки)',
    'Telegram Mini Apps (полноценные веб-приложения внутри Telegram)',
    'Сайты и лендинги (React / Next.js / Node.js / Python)',
    'Интеграции: платежи (ЮКасса, CryptoBot, Wallet Pay и др.), 1С, CRM, API',
  ],
  skills: ['Telegram Bot API', 'Mini Apps', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'React', 'Next.js', 'PostgreSQL', 'MongoDB', 'Crypto Pay', 'ЮКасса', 'Docker', 'REST API', 'Webhook'],
  memberSince: '25 июля 2023',
  isOnline: true,
  phoneVerified: true,
  stats: {
    ordersCompleted: 12,
    reviewsReceived: 8,
    successRate: 100,
    onTimeRate: 95,
    repeatClients: 33,
  },
  level: 'Стандарт',
  rating: 4.9,
};

const myKworks = [
  { id: 1, title: 'Разработаю мощного Telegram-бота под ваш бизнес, магазин, крипто', price: '3500', img: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=300&h=200&fit=crop', rating: 4.9, sales: 8, category: 'Боты' },
  { id: 2, title: 'Создам Telegram Mini App — полноценное веб-приложение в Telegram', price: '5000', img: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=300&h=200&fit=crop', rating: 5.0, sales: 4, category: 'Mini Apps' },
  { id: 3, title: 'Настрою платёжную систему в боте (ЮКасса, CryptoBot, Wallet Pay)', price: '2000', img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop', rating: 4.8, sales: 6, category: 'Интеграции' },
];

const reviews = [
  { id: 1, author: 'Максим К.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maxim', rating: 5, date: '10.04.2026', text: 'Отличный разработчик! Бот сделал быстро, всё работает как надо. Все хотелки учёл, на связи был всегда. Рекомендую!', kwork: 'Telegram-бот' },
  { id: 2, author: 'Анастасия В.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anastasia', rating: 5, date: '28.03.2026', text: 'Очень доволен результатом. Интегрировал ЮКассу в нашего бота, всё работает. Быстро и качественно.', kwork: 'Интеграция платежей' },
  { id: 3, author: 'Дмитрий Н.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dmitriy', rating: 5, date: '15.03.2026', text: 'Сделал Mini App для нашего интернет-магазина. Всё работает стабильно, покупатели довольны. Спасибо!', kwork: 'Telegram Mini App' },
];

const FreelancerProfile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('kworks');
  const [liked, setLiked] = useState(false);

  return (
    <div className="profile-page fade-in">
      {/* Cover Banner */}
      <div className="profile-cover">
        <img src={freelancer.coverImg} alt="Cover" className="cover-img" />
        <div className="cover-overlay" />
      </div>

      <div className="container profile-layout">
        {/* Left Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap glass">
            <img src={freelancer.avatar} alt={freelancer.displayName} className="profile-avatar" />
            <span className={`online-badge ${freelancer.isOnline ? 'online' : 'offline'}`}>
              <Circle size={8} fill="currentColor" />
              {freelancer.isOnline ? 'Онлайн' : 'Не в сети'}
            </span>
          </div>

          <div className="profile-meta glass">
            <div className="meta-item">
              <Phone size={14} />
              <span>Телефон подтверждён</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} />
              <span>На сайте с {freelancer.memberSince}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-primary w-full">
              <MessageCircle size={18} /> Написать
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          {/* Header Info */}
          <div className="profile-header glass">
            <div className="profile-header-left">
              <div className="profile-name-row">
                <h1>{freelancer.displayName}</h1>
                <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}>
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button className="share-btn">
                  <Share2 size={20} />
                </button>
              </div>
              <p className="profile-title">{freelancer.title}</p>
              <div className="profile-rating-row">
                <Star size={16} fill="var(--warning)" color="var(--warning)" />
                <span className="profile-rating-num">{freelancer.rating}</span>
                <span className="profile-reviews-count">({reviews.length} отзыва)</span>
              </div>
            </div>

            {/* Right Stats Block */}
            <div className="profile-stats-block glass">
              <div className="profile-level">
                <Award size={16} color="var(--accent-primary)" />
                <span>{freelancer.level}</span>
              </div>
              <div className="profile-stat-row">
                <span className="ps-label">Заказов выполнено</span>
                <span className="ps-val">{freelancer.stats.ordersCompleted}</span>
              </div>
              <div className="profile-stat-row">
                <span className="ps-label">Отзывов получено</span>
                <span className="ps-val">{freelancer.stats.reviewsReceived}</span>
              </div>
              <div className="profile-stat-row">
                <span className="ps-label">Успешных заказов</span>
                <span className="ps-val success">{freelancer.stats.successRate}%</span>
              </div>
              <div className="profile-stat-row">
                <span className="ps-label">Сдано вовремя</span>
                <span className="ps-val success">{freelancer.stats.onTimeRate}%</span>
              </div>
              <div className="profile-stat-row">
                <span className="ps-label">Повторных клиентов</span>
                <span className="ps-val">{freelancer.stats.repeatClients}%</span>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="profile-bio glass">
            <p>{freelancer.bio}</p>
            <h3>Специализация:</h3>
            <ul className="spec-list">
              {freelancer.specializations.map((s, i) => (
                <li key={i}><CheckCircle size={14} color="var(--accent-secondary)" /> {s}</li>
              ))}
            </ul>
            <div className="skills-cloud">
              {freelancer.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs glass">
            {[
              { id: 'kworks', label: `Кворки (${myKworks.length})`, icon: <Package size={16} /> },
              { id: 'reviews', label: `Отзывы (${reviews.length})`, icon: <Star size={16} /> },
            ].map(tab => (
              <button
                key={tab.id}
                className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Kworks Tab */}
          {activeTab === 'kworks' && (
            <div className="profile-kworks-grid">
              {myKworks.map(kwork => (
                <Link key={kwork.id} to={`/kwork/${kwork.id}`} className="profile-kwork-card glass">
                  <div className="pkwork-img">
                    <img src={kwork.img} alt={kwork.title} />
                    <span className="pkwork-cat">{kwork.category}</span>
                  </div>
                  <div className="pkwork-body">
                    <p className="pkwork-title">{kwork.title}</p>
                    <div className="pkwork-meta">
                      <div className="pkwork-rating">
                        <Star size={13} fill="var(--warning)" color="var(--warning)" />
                        {kwork.rating} ({kwork.sales})
                      </div>
                      <span className="pkwork-price">от {kwork.price} ₽</span>
                    </div>
                    <div className="pkwork-footer">
                      <span className="online-dot">
                        <Circle size={8} fill="var(--accent-secondary)" color="var(--accent-secondary)" />
                        {freelancer.username}
                      </span>
                      <button className="btn-buy-sm"><ShoppingCart size={14} /> Купить</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="reviews-section">
              {reviews.length === 0 ? (
                <div className="empty-reviews glass">
                  <Star size={48} color="var(--text-secondary)" />
                  <p>Пока нет отзывов</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="review-item glass">
                    <div className="review-top">
                      <div className="review-author-info">
                        <img src={review.avatar} alt={review.author} className="review-avatar" />
                        <div>
                          <div className="review-author-name">{review.author}</div>
                          <div className="review-kwork-ref">Заказ: {review.kwork}</div>
                        </div>
                      </div>
                      <div className="review-meta-right">
                        <div className="review-stars">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={14} fill="var(--warning)" color="var(--warning)" />
                          ))}
                        </div>
                        <div className="review-date">{review.date}</div>
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FreelancerProfile;
