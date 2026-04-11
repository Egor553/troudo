import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, Search, Wallet, Settings, MessageSquare, MoreVertical } from 'lucide-react';

const orders = [
  { id: 1, name: 'Логотип для кофейни', budget: '5,000 ₽', status: 'В работе', freelancer: 'Алексей М.' },
  { id: 2, name: 'Сайт-визитка на React', budget: '25,000 ₽', status: 'Открыт', freelancer: '-' },
  { id: 3, name: 'Текст для блога', budget: '2,000 ₽', status: 'Завершен', freelancer: 'Марина К.' },
];

const statusClass = (s) => {
  if (s === 'В работе') return 'status-badge status-work';
  if (s === 'Завершен') return 'status-badge status-done';
  return 'status-badge status-open';
};

const ClientDashboard = () => {
  return (
    <div className="dashboard-container container">
      <aside className="sidebar glass">
        <div className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active"><Briefcase size={20} /><span>Мои заказы</span></Link>
          <Link to="/create-order" className="nav-item"><PlusCircle size={20} /><span>Создать заказ</span></Link>
          <Link to="/catalog" className="nav-item"><Search size={20} /><span>Поиск фрилансеров</span></Link>
          <Link to="/balance" className="nav-item"><Wallet size={20} /><span>Баланс</span></Link>
          <Link to="/settings" className="nav-item"><Settings size={20} /><span>Настройки</span></Link>
          <Link to="/become-freelancer" className="nav-item" style={{ marginTop: 'auto', color: 'var(--accent-primary)' }}>
            <PlusCircle size={20} /><span>Стать фрилансером</span>
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Мои заказы</h1>
          <Link to="/create-order" className="btn-primary"><PlusCircle size={18} />Создать заказ</Link>
        </header>

        <section className="orders-section glass">
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Бюджет</th>
                  <th>Статус</th>
                  <th>Исполнитель</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td><Link to={`/order/${order.id}`} className="order-name">{order.name}</Link></td>
                    <td className="budget-cell">{order.budget}</td>
                    <td><span className={statusClass(order.status)}>{order.status}</span></td>
                    <td>{order.freelancer}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" title="Написать"><MessageSquare size={16} /></button>
                        <button className="icon-btn" title="Подробнее"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClientDashboard;
