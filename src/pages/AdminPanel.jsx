import React, { useState } from 'react';
import { 
  Users, 
  Layers, 
  AlertTriangle, 
  BarChart2, 
  Check, 
  X, 
  Gavel,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';

const tabs = ['Фрилансеры', 'Кворки', 'Споры'];

const freelancerApps = [
  { id: 1, name: 'Алексей Морозов', categories: 'Дизайн, Иллюстрации', date: '11.04.2026', skills: 'Figma, Photoshop, AI' },
  { id: 2, name: 'Ксения Лебедева', categories: 'Тексты, Маркетинг', date: '10.04.2026', skills: 'SEO, Copywriting' },
  { id: 3, name: 'Вадим Сергеев', categories: 'Программирование', date: '10.04.2026', skills: 'React, Node.js, TypeScript' },
];

const pendingKworks = [
  { id: 1, title: 'Профессиональная 3D-анимация персонажей', author: 'Ivan P.', price: '8000', category: 'Видео' },
  { id: 2, title: 'SEO-аудит сайта и оптимизация', author: 'Maria K.', price: '3500', category: 'Маркетинг' },
];

const disputes = [
  { id: 1, order: 'Логотип для кофейни', client: 'Егор Г.', freelancer: 'Том Б.', opened: '09.04.2026', reason: 'Низкое качество' },
  { id: 2, order: 'SEO-статья', client: 'Алена В.', freelancer: 'Ксения Л.', opened: '10.04.2026', reason: 'Нарушение срока' },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="container admin-page fade-in">
      <div className="admin-top-header">
        <h1>Панель администратора</h1>
        <span className="admin-badge">Admin</span>
      </div>

      {/* Stats Row */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card glass">
          <div className="stat-icon"><Users size={24} /></div>
          <div>
            <div className="stat-num">12,847</div>
            <div className="stat-label">Всего пользователей</div>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon orange"><ShoppingBag size={24} /></div>
          <div>
            <div className="stat-num">384</div>
            <div className="stat-label">Активных заказов</div>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon green"><TrendingUp size={24} /></div>
          <div>
            <div className="stat-num">4,230,000 ₽</div>
            <div className="stat-label">Оборот за месяц</div>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon purple"><BarChart2 size={24} /></div>
          <div>
            <div className="stat-num">211,500 ₽</div>
            <div className="stat-label">Комиссия Troudo (5%)</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs glass">
        {tabs.map((tab, i) => (
          <button 
            key={tab} 
            className={`admin-tab ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {i === 0 && <Users size={16} />}
            {i === 1 && <Layers size={16} />}
            {i === 2 && <AlertTriangle size={16} />}
            <span>{tab}</span>
            {i === 0 && <span className="badge-count">{freelancerApps.length}</span>}
            {i === 1 && <span className="badge-count">{pendingKworks.length}</span>}
            {i === 2 && <span className="badge-count badge-red">{disputes.length}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 0 && (
          <div className="moderation-list">
            {freelancerApps.map(app => (
              <div key={app.id} className="mod-card glass">
                <div className="mod-card-main">
                  <div className="mod-avatar">{app.name[0]}</div>
                  <div className="mod-info">
                    <h3>{app.name}</h3>
                    <div className="mod-meta">
                      <span>📁 {app.categories}</span>
                      <span>🛠 {app.skills}</span>
                      <span>📅 Заявка от {app.date}</span>
                    </div>
                  </div>
                </div>
                <div className="mod-actions">
                  <button className="action-approve"><Check size={18} /> Одобрить</button>
                  <button className="action-reject"><X size={18} /> Отклонить</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 1 && (
          <div className="moderation-list">
            {pendingKworks.map(kw => (
              <div key={kw.id} className="mod-card glass">
                <div className="mod-card-main">
                  <div className="mod-kwork-icon">
                    <Layers size={24} />
                  </div>
                  <div className="mod-info">
                    <h3>{kw.title}</h3>
                    <div className="mod-meta">
                      <span>👤 {kw.author}</span>
                      <span>💰 от {kw.price} ₽</span>
                      <span>📁 {kw.category}</span>
                    </div>
                  </div>
                </div>
                <div className="mod-actions">
                  <button className="action-approve"><Check size={18} /> Опубликовать</button>
                  <button className="action-reject"><X size={18} /> Отклонить</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div className="moderation-list">
            {disputes.map(d => (
              <div key={d.id} className="mod-card glass">
                <div className="mod-card-main">
                  <div className="mod-avatar dispute-icon">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="mod-info">
                    <h3>{d.order}</h3>
                    <div className="mod-meta">
                      <span>👤 Клиент: {d.client}</span>
                      <span>💼 Фрилансер: {d.freelancer}</span>
                      <span>⚠️ {d.reason}</span>
                      <span>📅 Открыт: {d.opened}</span>
                    </div>
                  </div>
                </div>
                <div className="mod-actions">
                  <button className="action-gavel"><Gavel size={18} /> Вынести решение</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-page { padding: 40px 0 80px; }
        .admin-top-header { display: flex; align-items: center; gap: 20px; margin-bottom: 40px; }
        .admin-top-header h1 { font-size: 36px; }
        .admin-badge { background: rgba(239, 68, 68, 0.1); color: var(--error); border: 1px solid rgba(239, 68, 68, 0.2); padding: 4px 16px; border-radius: 100px; font-weight: 700; font-size: 14px; }

        .admin-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .admin-stat-card { padding: 24px; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 20px; transition: var(--transition); }
        .admin-stat-card:hover { transform: translateY(-4px); }
        .stat-icon { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); background: rgba(99, 102, 241, 0.1); color: var(--accent-primary); }
        .stat-icon.green { background: rgba(16, 185, 129, 0.1); color: var(--accent-secondary); }
        .stat-icon.orange { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .stat-icon.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        .stat-num { font-size: 22px; font-weight: 800; }
        .stat-label { font-size: 13px; color: var(--text-secondary); }

        .admin-tabs { display: flex; border-radius: var(--radius-lg); padding: 8px; gap: 8px; margin-bottom: 32px; }
        .admin-tab { display: flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: var(--radius-md); flex: 1; justify-content: center; font-weight: 600; color: var(--text-secondary); transition: var(--transition); }
        .admin-tab.active { background: var(--accent-primary); color: white; }
        .badge-count { background: rgba(255, 255, 255, 0.15); padding: 2px 8px; border-radius: 100px; font-size: 12px; }
        .badge-red { background: rgba(239, 68, 68, 0.8); }

        .moderation-list { display: flex; flex-direction: column; gap: 16px; }
        .mod-card { padding: 24px; border-radius: var(--radius-lg); display: flex; justify-content: space-between; align-items: center; gap: 20px; transition: var(--transition); }
        .mod-card:hover { border-color: rgba(99, 102, 241, 0.4); }
        .mod-card-main { display: flex; gap: 20px; align-items: center; flex-grow: 1; }
        .mod-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--accent-primary); font-size: 20px; flex-shrink: 0; }
        .dispute-icon { background: rgba(239, 68, 68, 0.1); color: var(--error); border-radius: var(--radius-md); }
        .mod-kwork-icon { width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(99, 102, 241, 0.1); display: flex; align-items: center; justify-content: center; color: var(--accent-primary); flex-shrink: 0; }
        .mod-info h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
        .mod-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; color: var(--text-secondary); }
        
        .mod-actions { display: flex; gap: 10px; flex-shrink: 0; }
        .action-approve { padding: 10px 20px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); color: var(--accent-secondary); border: 1px solid rgba(16, 185, 129, 0.2); font-weight: 600; display: flex; align-items: center; gap: 6px; font-size: 14px; }
        .action-approve:hover { background: var(--accent-secondary); color: white; }
        .action-reject { padding: 10px 20px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); color: var(--error); border: 1px solid rgba(239, 68, 68, 0.2); font-weight: 600; display: flex; align-items: center; gap: 6px; font-size: 14px; }
        .action-reject:hover { background: var(--error); color: white; }
        .action-gavel { padding: 10px 20px; border-radius: 8px; background: rgba(168, 85, 247, 0.1); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.2); font-weight: 600; display: flex; align-items: center; gap: 6px; font-size: 14px; }
        .action-gavel:hover { background: #a855f7; color: white; }

        @media (max-width: 1024px) { .admin-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { 
          .admin-stats-grid { grid-template-columns: 1fr; }
          .mod-card { flex-direction: column; align-items: flex-start; }
          .mod-actions { width: 100%; }
          .action-approve, .action-reject, .action-gavel { flex: 1; justify-content: center; }
          .admin-tabs { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
