import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, Clock, CheckCircle, ChevronRight, MessageSquare, AlertCircle, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OrdersHistory = () => {
    const { apiFetch, user } = useAuth();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('purchases'); // 'purchases' | 'sales'

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                // Fetch all deals where the user is either client or freelancer
                const data = await apiFetch('/deals');
                setDeals(data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, [apiFetch]);

    const purchases = deals.filter(d => d.clientId === user.id);
    const sales = deals.filter(d => d.freelancerId === user.id);

    const shownDeals = activeTab === 'purchases' ? purchases : sales;

    const getStatusInfo = (status) => {
        switch (status) {
            case 'active': return { label: 'В работе', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' };
            case 'submitted': return { label: 'На проверке', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' };
            case 'completed': return { label: 'Завершен', color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
            case 'dispute': return { label: 'Спор', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
            default: return { label: status, color: '#ccc', bg: 'rgba(255,255,255,0.05)' };
        }
    };

    return (
        <div className="orders-history-page container fade-in">
            <header className="page-header-simple">
                <h1>История заказов</h1>
                <p className="subtitle">Управляйте своими покупками и продажами услуг</p>
            </header>

            <div className="tabs-container glass">
                <button 
                    className={`tab-btn ${activeTab === 'purchases' ? 'active' : ''}`}
                    onClick={() => setActiveTab('purchases')}
                >
                    <ShoppingBag size={18} />
                    <span>Покупки <strong>{purchases.length}</strong></span>
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sales')}
                >
                    <Package size={18} />
                    <span>Продажи <strong>{sales.length}</strong></span>
                </button>
            </div>

            <div className="orders-list-content">
                {loading ? (
                    <div className="loading-placeholder glass">Загрузка ваших заказов...</div>
                ) : shownDeals.length > 0 ? (
                    <div className="orders-grid-history">
                        {shownDeals.map(deal => {
                            const status = getStatusInfo(deal.status);
                            return (
                                <Link to={`/order/${deal.id}`} key={deal.id} className="order-history-card glass">
                                    <div className="card-top">
                                        <div className="card-status" style={{ color: status.color, backgroundColor: status.bg }}>
                                            {status.label}
                                        </div>
                                        <span className="card-date">{new Date(deal.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <h3 className="card-title">{deal.title || 'Безымянный заказ'}</h3>
                                    
                                    <div className="card-meta">
                                        <div className="meta-item">
                                            <span className="label">{activeTab === 'purchases' ? 'Продавец' : 'Заказчик'}</span>
                                            <span className="value">{deal.counterpartName}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="label">Сумма</span>
                                            <span className="value price-hl">{deal.amount} ₽</span>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className="action-hint">Перейти в сделку <ChevronRight size={16} /></div>
                                        {deal.paymentStatus === 'succeeded' && (
                                            <div className="paid-badge" title="Оплачено">
                                                <CheckCircle size={14} color="#10b981" />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-history glass">
                        <AlertCircle size={48} />
                        <h3>{activeTab === 'purchases' ? 'Вы еще ничего не покупали' : 'У вас пока нет продаж'}</h3>
                        <p>{activeTab === 'purchases' ? 'Самое время найти классную услугу в каталоге!' : 'Разместите свои кворки в каталоге, чтобы получить первые заказы.'}</p>
                        <Link to="/catalog" className="btn-primary">Перейти в каталог</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersHistory;
