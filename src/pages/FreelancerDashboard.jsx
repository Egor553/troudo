import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, PlusCircle, MessageSquare, Handshake, TrendingUp, MoreVertical, Plus, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FreelancerDashboard = () => {
  const { apiFetch, user } = useAuth();
  const [kworks, setKworks] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myKworks = await apiFetch(`/kworks?freelancerId=${user.id}`);
        setKworks(myKworks);

        const myDeals = await apiFetch('/deals');
        setDeals(myDeals.filter(d => d.freelancerId === user.id));
      } catch (err) {
        console.error('Freelancer dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiFetch, user.id]);

  const activeDeals = deals.filter(d => d.status === 'active' || d.status === 'submitted');
  const completedDeals = deals.filter(d => d.status === 'completed');
  const totalIncome = completedDeals.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="dashboard-container container">
      <aside className="sidebar glass">
        <div className="sidebar-nav">
          <Link to="/freelancer/dashboard" className="nav-item active"><Layers size={20} /><span>Мои кворки</span></Link>
          <Link to="/freelancer/create-kwork" className="nav-item"><PlusCircle size={20} /><span>Создать кворк</span></Link>
          <Link to="/freelancer/deals" className="nav-item"><Handshake size={20} /><span>Мои сделки</span></Link>
          <Link to="/settings" className="nav-item"><PlusCircle size={20} /><span>Настройки</span></Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Панель фрилансера</h1>
            <p className="subtitle">Управляйте своими услугами и заказами</p>
          </div>
          <Link to="/freelancer/create-kwork" className="btn-primary"><Plus size={18} />Создать кворк</Link>
        </header>

        <section className="dashboard-stats-row">
          <div className="stat-card glass">
            <span className="stat-label">Доход (всего)</span>
            <span className="stat-value text-green">{totalIncome.toLocaleString()} ₽</span>
          </div>
          <div className="stat-card glass">
            <span className="stat-label">В работе</span>
            <span className="stat-value">{activeDeals.length}</span>
          </div>
          <div className="stat-card glass">
            <span className="stat-label">Баланс</span>
            <span className="stat-value">{user.balance || 0} ₽</span>
          </div>
        </section>

        <section className="dashboard-section-title">
            <h3>Активные сделки</h3>
        </section>

        <section className="orders-section glass">
            <div className="table-responsive">
                {loading ? (
                    <div className="loading-state">Загрузка сделок...</div>
                ) : activeDeals.length > 0 ? (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Проект</th>
                                <th>Бюджет</th>
                                <th>Статус</th>
                                <th>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeDeals.map(deal => (
                                <tr key={deal.id}>
                                    <td>
                                        <div className="order-info-cell">
                                            <span className="order-name-text">{deal.title}</span>
                                            <span className="order-date-text"><Clock size={12}/> Заказчик: {deal.counterpartName}</span>
                                        </div>
                                    </td>
                                    <td className="budget-cell">{deal.amount} ₽</td>
                                    <td>
                                        <span className={`status-badge ${deal.status === 'active' ? 'status-work' : 'status-done'}`}>
                                            {deal.status === 'active' ? 'В работе' : 'На проверке'}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/order/${deal.id}`} className="icon-btn-text">Управление</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <p>У вас пока нет активных заказов. Откликайтесь на проекты на <Link to="/catalog">Бирже</Link>.</p>
                    </div>
                )}
            </div>
        </section>

        <section className="dashboard-section-title" style={{ marginTop: '40px' }}>
            <h3>Мои кворки ({kworks.length})</h3>
        </section>

        <div className="kworks-list">
          {kworks.length > 0 ? (
            kworks.map(kwork => (
                <div key={kwork.id} className="kwork-item glass">
                  <div className="kwork-item-info">
                    <div className="kwork-item-img">
                        <Layers size={24} color="var(--accent-primary)" />
                    </div>
                    <div>
                      <h3>{kwork.title}</h3>
                      <div className="kwork-item-meta">
                        <span className="status-active">Активен</span>
                        <span style={{ color: 'var(--text-secondary)' }}>от {kwork.price} ₽</span>
                      </div>
                    </div>
                  </div>
                  <div className="kwork-item-stats">
                    <div className="stat"><span>{kwork.sales || 0}</span>Продажи</div>
                    <button className="icon-btn"><MoreVertical size={18} /></button>
                  </div>
                </div>
              ))
          ) : (
            <div className="empty-state glass w-full">
                <p>У вас еще нет созданных кворков. Создайте услугу, чтобы клиенты могли вас найти.</p>
                <Link to="/freelancer/create-kwork" className="btn-secondary">Создать кворк</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FreelancerDashboard;
