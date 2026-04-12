import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Download, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  FileText
} from 'lucide-react';

const OrderPage = () => {
  const { id } = useParams();
  const { apiFetch, user } = useAuth();
  
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDeal();
  }, [id, apiFetch]);

  const fetchDeal = async () => {
    try {
      const data = await apiFetch(`/deals/${id}`);
      setDeal(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await apiFetch(`/deals/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      await fetchDeal();
    } catch (err) {
      alert('Ошибка: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="container loading-page">Загрузка заказа...</div>;
  if (error) return <div className="container error-page">{error}</div>;

  const isClient = user.id === deal.clientId;
  const isFreelancer = user.id === deal.freelancerId;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active': return { label: 'В работе', color: '#6366f1', icon: <Clock size={20}/> };
      case 'submitted': return { label: 'На проверке', color: '#fbbf24', icon: <FileText size={20}/> };
      case 'completed': return { label: 'Завершен', color: '#10b981', icon: <CheckCircle size={20}/> };
      case 'dispute': return { label: 'Спор', color: '#ef4444', icon: <AlertCircle size={20}/> };
      default: return { label: status, color: '#ccc', icon: null };
    }
  };

  const statusInfo = getStatusInfo(deal.status);

  return (
    <div className="order-tracking-page container">
      <div className="order-layout">
        
        {/* Main Content */}
        <div className="order-main">
          <header className="order-header glass">
            <div className="order-header-top">
              <span className="order-id">Заказ #{deal.id}</span>
              <div className="status-indicator" style={{ color: statusInfo.color }}>
                {statusInfo.icon}
                <span>{statusInfo.label}</span>
              </div>
            </div>
            <h1>{deal.project.title}</h1>
            <div className="order-price-banner">
                <DollarSign size={20} />
                <span>Стоимость сделки: <strong>{deal.amount} ₽</strong></span>
                <span className="safe-badge"><ShieldCheck size={14}/> Безопасная сделка</span>
            </div>
          </header>

          <section className="order-timeline glass">
            <h3>Ход выполнения</h3>
            <div className="timeline-items">
                <div className="timeline-item active">
                    <div className="timeline-bullet"></div>
                    <div className="timeline-content">
                        <span className="timeline-date">{new Date(deal.createdAt).toLocaleDateString()}</span>
                        <p>Сделка создана. Исполнитель приступил к работе.</p>
                    </div>
                </div>
                {deal.status === 'submitted' && (
                    <div className="timeline-item active">
                         <div className="timeline-bullet warning"></div>
                         <div className="timeline-content">
                            <p><strong>Исполнитель сдал работу на проверку.</strong></p>
                            <p>Пожалуйста, проверьте результат и подтвердите выполнение.</p>
                         </div>
                    </div>
                )}
                {deal.status === 'completed' && (
                    <div className="timeline-item active">
                         <div className="timeline-bullet success"></div>
                         <div className="timeline-content">
                            <p><strong>Заказ успешно завершен!</strong></p>
                            <p>Средства переведены исполнителю.</p>
                         </div>
                    </div>
                )}
            </div>
          </section>

          <section className="order-chat glass">
            <h3>Чат по заказу</h3>
            <div className="chat-placeholder">
                <MessageSquare size={48} />
                <p>Здесь будет чат для обсуждения деталей и передачи файлов.</p>
                <button className="btn-secondary" disabled>Открыть чат</button>
            </div>
          </section>
        </div>

        {/* Sidebar Actions */}
        <aside className="order-sidebar">
          <div className="order-participants glass">
            <h4>Участники</h4>
            <div className="participant">
                <div className="p-avatar">{deal.client.avatar}</div>
                <div>
                    <span className="p-role">Заказчик</span>
                    <span className="p-name">{deal.client.name} {isClient && '(Вы)'}</span>
                </div>
            </div>
            <div className="participant">
                <div className="p-avatar">{deal.freelancer.avatar}</div>
                <div>
                    <span className="p-role">Исполнитель</span>
                    <span className="p-name">{deal.freelancer.name} {isFreelancer && '(Вы)'}</span>
                </div>
            </div>
          </div>

          <div className="order-actions glass">
            <h4>Действия</h4>
            
            {/* Фрилансер: сдать работу */}
            {isFreelancer && deal.status === 'active' && (
                <button className="btn-primary w-full" onClick={() => updateStatus('submitted')} disabled={updating}>
                    {updating ? 'Загрузка...' : 'Сдать работу на проверку'}
                </button>
            )}

            {/* Заказчик: подтвердить */}
            {isClient && deal.status === 'submitted' && (
                <>
                    <button className="btn-primary w-full" onClick={() => updateStatus('completed')} disabled={updating}>
                        {updating ? 'Загрузка...' : 'Подтвердить выполнение'}
                    </button>
                    <button className="btn-secondary w-full" onClick={() => updateStatus('dispute')} disabled={updating}>
                        Открыть спор
                    </button>
                </>
            )}

            {deal.status === 'completed' && (
                <div className="order-success-msg">
                    <CheckCircle size={20} />
                    <span>Заказ завершен</span>
                </div>
            )}

            <button className="btn-link w-full"><Download size={16} /> Скачать ТЗ</button>
            <button className="btn-link w-full"><ExternalLink size={16} /> Помощь</button>
          </div>
        </aside>

      </div>
    </div>
  );
};

const DollarSign = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

export default OrderPage;
