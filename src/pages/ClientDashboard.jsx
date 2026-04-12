import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, Search, Wallet, Settings, MessageSquare, ExternalLink, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ClientDashboard = () => {
  const { apiFetch, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects created by this client
        const allProjects = await apiFetch('/projects');
        const myProjects = allProjects.filter(p => p.clientId === user.id);
        setProjects(myProjects);

        // Fetch active deals/orders
        // In a real app we'd have /api/deals endpoint
        // For now, let's just fetch projects. Deals will be added later.
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiFetch, user.id]);

  const statusClass = (s) => {
    if (s === 'in_progress') return 'status-badge status-work';
    if (s === 'completed') return 'status-badge status-done';
    return 'status-badge status-open';
  };

  const statusText = (s) => {
    if (s === 'in_progress') return 'В работе';
    if (s === 'completed') return 'Завершен';
    return 'Открыт';
  };

  return (
    <div className="dashboard-container container">
      <aside className="sidebar glass">
        <div className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active"><Briefcase size={20} /><span>Мои заказы</span></Link>
          <Link to="/create-order" className="nav-item"><PlusCircle size={20} /><span>Создать заказ</span></Link>
          <Link to="/catalog" className="nav-item"><Search size={20} /><span>Биржа</span></Link>
          <Link to="/settings" className="nav-item"><Settings size={20} /><span>Настройки</span></Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Мои проекты</h1>
            <p className="subtitle">Управляйте вашими задачами на бирже</p>
          </div>
          <Link to="/create-order" className="btn-primary"><PlusCircle size={18} />Разместить проект</Link>
        </header>

        <section className="dashboard-stats-grid">
            <div className="stat-card glass">
                <span className="stat-value">{projects.length}</span>
                <span className="stat-label">Всего проектов</span>
            </div>
            <div className="stat-card glass">
                <span className="stat-value">{user.balance || 0} ₽</span>
                <span className="stat-label">Баланс</span>
            </div>
        </section>

        <section className="orders-section glass">
          <div className="table-responsive">
            {loading ? (
                <div className="loading-state">Загрузка данных...</div>
            ) : projects.length > 0 ? (
                <table className="orders-table">
                <thead>
                    <tr>
                    <th>Название проекта</th>
                    <th>Бюджет</th>
                    <th>Статус</th>
                    <th>Отклики</th>
                    <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                    <tr key={project.id}>
                        <td>
                            <div className="order-info-cell">
                                <span className="order-name-text">{project.title}</span>
                                <span className="order-date-text"><Clock size={12}/> {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </td>
                        <td className="budget-cell">{project.budget} ₽</td>
                        <td><span className={statusClass(project.status)}>{statusText(project.status)}</span></td>
                        <td>
                            <Link to={`/project/${project.id}/offers`} className="offers-count-link">
                                <MessageSquare size={14} /> {project.offersCount} предложений
                            </Link>
                        </td>
                        <td>
                        <div className="action-buttons">
                            <Link to={`/project/${project.id}/offers`} className="icon-btn-text" title="Посмотреть отклики">
                                <ExternalLink size={16} /> Посмотреть
                            </Link>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <div className="empty-state">
                    <h3>У вас пока нет активных проектов</h3>
                    <p>Разместите свой первый заказ на бирже прямо сейчас</p>
                    <Link to="/create-order" className="btn-secondary">Создать проект</Link>
                </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClientDashboard;
