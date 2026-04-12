import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Clock, RefreshCw, ShieldCheck, 
  ChevronRight, MessageSquare, ShoppingCart, 
  ArrowLeft, Check, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const KworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch, user } = useAuth();
  
  const [kwork, setKwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePackage, setActivePackage] = useState(0);

  useEffect(() => {
    const fetchKwork = async () => {
      try {
        const data = await apiFetch(`/kworks/${id}`);
        setKwork(data);
      } catch (err) {
        console.error('Failed to fetch kwork:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKwork();
  }, [id, apiFetch]);

  if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Загрузка услуги...</div>;
  if (!kwork) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Услуга не найдена</div>;

  const currentPkg = kwork.packages?.[activePackage] || { name: 'Базовый', price: kwork.price, period: 1 };

  return (
    <div className="kwork-detail-page container fade-in">
      <div className="breadcrumb">
        <Link to="/catalog">Маркетплейс</Link>
        <ChevronRight size={14} />
        <span>{kwork.category}</span>
      </div>

      <div className="kwork-detail-layout">
        {/* Main Content */}
        <main className="kwork-detail-main">
          <header className="kwork-header-section">
            <button onClick={() => navigate(-1)} className="back-btn">
                <ArrowLeft size={18} /> Назад
            </button>
            <h1>{kwork.title}</h1>
            
            <div className="kwork-owner-line">
                <Link to={`/user/${kwork.freelancer.username}`} className="owner-avatar-link">
                    {kwork.freelancer.avatar?.length > 4 ? (
                        <img src={kwork.freelancer.avatar} alt={kwork.freelancer.name} />
                    ) : (
                        <div className="owner-avatar-emoji">{kwork.freelancer.avatar || '👤'}</div>
                    )}
                    <span>{kwork.freelancer.name}</span>
                </Link>
                <div className="owner-divider" />
                <div className="owner-rating">
                    <Star size={16} fill="var(--warning)" color="var(--warning)" />
                    <strong>5.0</strong>
                    <span>(0 отзывов)</span>
                </div>
                <div className="owner-divider" />
                <span className="owner-orders-count">0 заказов в очереди</span>
            </div>
          </header>

          <div className="kwork-gallery glass">
            <div className="gallery-placeholder">
                <Layers size={64} color="rgba(255,255,255,0.1)" />
                <p>Изображения работы появятся здесь</p>
            </div>
          </div>

          <section className="kwork-description-section">
            <h3>Описание услуги</h3>
            <div className="description-text">
                {kwork.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
          </section>
        </main>

        {/* Sidebar Pricing Card */}
        <aside className="kwork-detail-sidebar">
          <div className="pricing-card glass sticky">
            <div className="pricing-tabs">
                {(kwork.packages || []).map((pkg, i) => (
                    <button 
                        key={i} 
                        className={`pkg-tab ${activePackage === i ? 'active' : ''}`}
                        onClick={() => setActivePackage(i)}
                    >
                        {pkg.name}
                    </button>
                ))}
            </div>
            
            <div className="pricing-body">
                <div className="price-line">
                    <span className="price-label">Стоимость</span>
                    <span className="price-value">{currentPkg.price} ₽</span>
                </div>
                
                <p className="pkg-desc">{currentPkg.desc || 'Классический набор услуг для быстрого старта.'}</p>
                
                <div className="pkg-features">
                    <div className="feature"><Clock size={16} /> <span>Срок выполнения: {currentPkg.period} дн.</span></div>
                    <div className="feature"><RefreshCw size={16} /> <span>Доработки включены</span></div>
                </div>

                <div className="pricing-actions">
                    <button className="btn-primary w-full" disabled={user?.id === kwork.freelancerId}>
                        <ShoppingCart size={18} /> Купить за {currentPkg.price} ₽
                    </button>
                    <button className="btn-secondary w-full">
                        <MessageSquare size={18} /> Связаться
                    </button>
                </div>

                <div className="safe-deal-info">
                    <ShieldCheck size={16} color="#10b981" />
                    <span>Оплата через Маркетплейс гарантирует 100% возврат средств при невыполнении условий.</span>
                </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default KworkDetail;
