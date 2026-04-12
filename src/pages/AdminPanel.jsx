import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Layers, 
  AlertTriangle, 
  BarChart2, 
  Check, 
  X, 
  Gavel,
  TrendingUp,
  ShoppingBag,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { apiFetch } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await apiFetch('/admin/stats');
        setStats(statsData);

        const usersData = await apiFetch('/admin/users');
        setUsers(usersData);

        const dealsData = await apiFetch('/deals'); // Admin usually has access to all or a separate endpoint
        setDeals(dealsData);
      } catch (err) {
        console.error('Admin data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiFetch]);

  if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Загрузка панели управления...</div>;

  return (
    <div className="container admin-page fade-in">
      <div className="admin-top-header">
        <h1>Панель администратора</h1>
        <span className="admin-badge">Система Trudo</span>
      </div>

      {/* Real Stats Row */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card glass">
          <div className="stat-icon"><Users size={24} /></div>
          <div>
            <div className="stat-num">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Всего пользователей</div>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon orange"><ShoppingBag size={24} /></div>
          <div>
            <div className="stat-num">{stats?.activeDeals || 0}</div>
            <div className="stat-label">Активных сделок</div>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon green"><TrendingUp size={24} /></div>
          <div>
            <div className="stat-num">{(stats?.turnover || 0).toLocaleString()} ₽</div>
            <div className="stat-label">Оборот платформы</div>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon purple"><BarChart2 size={24} /></div>
          <div>
            <div className="stat-num">{((stats?.turnover || 0) * 0.05).toLocaleString()} ₽</div>
            <div className="stat-label">Профит системы (5%)</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs glass">
        {['stats', 'users', 'deals'].map((tab) => (
          <button 
            key={tab} 
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'stats' && <TrendingUp size={16} />}
            {tab === 'users' && <Users size={16} />}
            {tab === 'deals' && <ShoppingBag size={16} />}
            <span style={{ marginLeft: '8px' }}>
                {tab === 'stats' ? 'Обзор' : tab === 'users' ? 'Пользователи' : 'Сделки'}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'users' && (
          <div className="moderation-list">
            {users.map(u => (
              <div key={u.id} className="mod-card glass">
                <div className="mod-card-main">
                  <div className="mod-avatar">{u.avatar?.length > 4 ? <img src={u.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : u.avatar || '👤'}</div>
                  <div className="mod-info">
                    <h3>{u.name} (@{u.username})</h3>
                    <div className="mod-meta">
                      <span>👤 Роль: <strong>{u.activeRole}</strong></span>
                      <span>💰 Баланс: {u.balance} ₽</span>
                      <span>📅 Регистрация: {new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="mod-actions">
                  <button className="action-approve"><Check size={18} /> Управление</button>
                  <button className="action-reject"><X size={18} /> Блок</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="moderation-list">
            {deals.length > 0 ? (
                deals.map(d => (
                    <div key={d.id} className="mod-card glass">
                      <div className="mod-card-main">
                        <div className="mod-avatar dispute-icon">
                          <ShoppingBag size={24} />
                        </div>
                        <div className="mod-info">
                          <h3>Заказ #{d.id}</h3>
                          <div className="mod-meta">
                            <span>🛠 Статус: <strong>{d.status === 'active' ? 'В работе' : d.status === 'completed' ? 'Завершен' : d.status}</strong></span>
                            <span>💰 Сумма: {d.amount} ₽</span>
                            <span>👥 Контрагент: {d.counterpartName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mod-actions">
                        <Link to={`/order/${d.id}`} className="action-gavel"><Gavel size={18} /> Просмотр</Link>
                      </div>
                    </div>
                  ))
            ) : (
                <div className="empty-state glass w-full"><p>На платформе пока нет активных или завершенных сделок.</p></div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
            <div className="admin-overview-tab glass">
                <div className="overview-header">
                    <h3>Общая аналитика</h3>
                    <p>Данные в реальном времени на основе текущей базы пользователей и сделок.</p>
                </div>
                <div className="overview-content">
                    <p>Платформа работает стабильно. Все системы синхронизированы с базой данных <code>database.json</code>.</p>
                    <div className="overview-actions" style={{ marginTop: '20px' }}>
                        <button className="btn-secondary" onClick={() => window.location.reload()}><RefreshCw size={16} /> Обновить данные</button>
                    </div>
                </div>
            </div>
        )}
      </div>

      <style jsx>{`
        .admin-page { padding: 40px 10px 80px; }
        .admin-top-header { display: flex; align-items: center; gap: 20px; margin-bottom: 40px; }
        .admin-top-header h1 { font-size: 32px; }
        .admin-badge { background: rgba(99, 102, 241, 0.1); color: var(--accent-primary); border: 1px solid rgba(99, 102, 241, 0.2); padding: 4px 16px; border-radius: 100px; font-weight: 700; font-size: 14px; }

        .admin-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .admin-stat-card { padding: 24px; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 20px; }
        .stat-icon { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); background: rgba(99, 102, 241, 0.1); color: var(--accent-primary); }
        .stat-icon.green { background: rgba(16, 185, 129, 0.1); color: var(--accent-secondary); }
        .stat-icon.orange { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .stat-icon.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        .stat-num { font-size: 20px; font-weight: 800; }
        .stat-label { font-size: 12px; color: var(--text-secondary); }

        .admin-tabs { display: flex; border-radius: var(--radius-lg); padding: 8px; gap: 8px; margin-bottom: 32px; }
        .admin-tab { display: flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: var(--radius-md); flex: 1; justify-content: center; font-weight: 600; color: var(--text-secondary); transition: var(--transition); border: none; background: transparent; cursor: pointer; }
        .admin-tab.active { background: var(--accent-primary); color: white; }

        .moderation-list { display: flex; flex-direction: column; gap: 16px; }
        .mod-card { padding: 20px; border-radius: var(--radius-lg); display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .mod-card-main { display: flex; gap: 15px; align-items: center; flex-grow: 1; }
        .mod-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--accent-primary); font-size: 18px; flex-shrink: 0; overflow: hidden; }
        .dispute-icon { background: rgba(239, 68, 68, 0.1); color: var(--error); }
        .mod-info h3 { font-size: 15px; font-weight: 600; margin-bottom: 5px; }
        .mod-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 12px; color: var(--text-secondary); }
        
        .mod-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .action-approve { padding: 8px 16px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); color: var(--accent-secondary); border: 1px solid rgba(16, 185, 129, 0.2); font-weight: 600; display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; }
        .action-reject { padding: 8px 16px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); color: var(--error); border: 1px solid rgba(239, 68, 68, 0.2); font-weight: 600; display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; }
        .action-gavel { padding: 8px 16px; border-radius: 8px; background: rgba(168, 85, 247, 0.1); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.2); font-weight: 600; display: flex; align-items: center; gap: 6px; font-size: 13px; text-decoration: none; }

        .admin-overview-tab { padding: 30px; border-radius: var(--radius-lg); }
        .overview-header h3 { font-size: 20px; margin-bottom: 10px; }
        .overview-header p { color: var(--text-secondary); font-size: 14px; margin-bottom: 20px; }

        @media (max-width: 1024px) { .admin-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { 
          .admin-stats-grid { grid-template-columns: 1fr; }
          .mod-card { flex-direction: column; align-items: flex-start; }
          .mod-actions { width: 100%; }
          .admin-tabs { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
