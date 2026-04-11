import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, PlusCircle, MessageSquare, Handshake, TrendingUp, MoreVertical, Plus } from 'lucide-react';

const myKworks = [
  { id: 1, title: 'Профессиональный логотип для вашего бизнеса', price: '1500', status: 'Активен', views: 1240, sales: 42 },
  { id: 2, title: 'Верстка сайта на React/Next.js', price: '5000', status: 'На модерации', views: 12, sales: 0 },
];

const FreelancerDashboard = () => {
  return (
    <div className="dashboard-container container">
      <aside className="sidebar glass">
        <div className="sidebar-nav">
          <Link to="/freelancer/dashboard" className="nav-item active"><Layers size={20} /><span>Мои кворки</span></Link>
          <Link to="/freelancer/create-kwork" className="nav-item"><PlusCircle size={20} /><span>Создать кворк</span></Link>
          <Link to="/freelancer/offers" className="nav-item"><MessageSquare size={20} /><span>Отклики</span></Link>
          <Link to="/freelancer/deals" className="nav-item"><Handshake size={20} /><span>Мои сделки</span></Link>
          <Link to="/freelancer/stats" className="nav-item"><TrendingUp size={20} /><span>Статистика</span></Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Мои кворки</h1>
          <Link to="/freelancer/create-kwork" className="btn-primary"><Plus size={18} />Создать кворк</Link>
        </header>

        <div className="stats-row">
          <div className="stat-card glass">
            <span className="stat-label">Доход за месяц</span>
            <span className="stat-value text-green">45,200 ₽</span>
          </div>
          <div className="stat-card glass">
            <span className="stat-label">Активных сделок</span>
            <span className="stat-value">8</span>
          </div>
          <div className="stat-card glass">
            <span className="stat-label">Рейтинг</span>
            <span className="stat-value text-yellow">4.98</span>
          </div>
        </div>

        <div className="kworks-list">
          {myKworks.map(kwork => (
            <div key={kwork.id} className="kwork-item glass">
              <div className="kwork-item-info">
                <div className="kwork-item-img"></div>
                <div>
                  <h3>{kwork.title}</h3>
                  <div className="kwork-item-meta">
                    <span className={kwork.status === 'Активен' ? 'status-active' : 'status-mod'}>{kwork.status}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>от {kwork.price} ₽</span>
                  </div>
                </div>
              </div>
              <div className="kwork-item-stats">
                <div className="stat"><span>{kwork.views}</span>Просмотры</div>
                <div className="stat"><span>{kwork.sales}</span>Продажи</div>
                <button className="icon-btn"><MoreVertical size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FreelancerDashboard;
