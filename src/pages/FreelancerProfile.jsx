import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Star, Phone, Calendar, Circle, Heart, Share2, 
  MessageCircle, ShoppingCart, CheckCircle, Award,
  Clock, Package, ChevronRight, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FreelancerProfile = () => {
  const { id } = useParams(); // Can be username or ID
  const { apiFetch } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [kworks, setKworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kworks');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await apiFetch(`/users/${id}`);
        setProfile(userData);

        const userKworks = await apiFetch(`/kworks?freelancerId=${userData.id}`);
        setKworks(userKworks);
      } catch (err) {
        console.error('Profile load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, apiFetch]);

  if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Загрузка профиля...</div>;
  if (!profile) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Пользователь не найден</div>;

  return (
    <div className="profile-page fade-in">
      <div className="profile-cover">
        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=300&fit=crop" alt="Cover" className="cover-img" />
        <div className="cover-overlay" />
      </div>

      <div className="container profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap glass">
             {profile.avatar?.length > 4 ? (
                <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
             ) : (
                <div className="profile-avatar-emoji" style={{ fontSize: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>{profile.avatar || '👤'}</div>
             )}
            <span className="online-badge online">
              <Circle size={8} fill="currentColor" /> Онлайн
            </span>
          </div>

          <div className="profile-meta glass">
            <div className="meta-item"><Phone size={14} /><span>Телефон подтверждён</span></div>
            <div className="meta-item"><Calendar size={14} /><span>На сайте с {new Date(profile.createdAt).toLocaleDateString()}</span></div>
          </div>

          <div className="profile-actions">
            <button className="btn-primary w-full"><MessageCircle size={18} /> Написать</button>
          </div>
        </aside>

        <main className="profile-main">
          <div className="profile-header glass">
            <div className="profile-header-left">
              <div className="profile-name-row">
                <h1>{profile.name}</h1>
                <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}>
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button className="share-btn"><Share2 size={20} /></button>
              </div>
              <p className="profile-title">{profile.specialization || 'Фрилансер Troudo'}</p>
              <div className="profile-rating-row">
                <Star size={16} fill="var(--warning)" color="var(--warning)" />
                <span className="profile-rating-num">5.0</span>
                <span className="profile-reviews-count">(0 отзывов)</span>
              </div>
            </div>

            <div className="profile-stats-block glass">
              <div className="profile-level"><Award size={16} color="var(--accent-primary)" /><span>Стандарт</span></div>
              <div className="profile-stat-row"><span className="ps-label">Заказов выполнено</span><span className="ps-val">0</span></div>
              <div className="profile-stat-row"><span className="ps-label">Успешных заказов</span><span className="ps-val success">100%</span></div>
            </div>
          </div>

          <div className="profile-bio glass">
            <p>{profile.bio || 'Пользователь еще не заполнил информацию о себе.'}</p>
          </div>

          <div className="profile-tabs glass">
            {[
              { id: 'kworks', label: `Кворки (${kworks.length})`, icon: <Package size={16} /> },
              { id: 'reviews', label: `Отзывы (0)`, icon: <Star size={16} /> },
            ].map(tab => (
              <button key={tab.id} className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'kworks' && (
            <div className="profile-kworks-grid">
              {kworks.length > 0 ? kworks.map(kwork => (
                <Link key={kwork.id} to={`/kwork/${kwork.id}`} className="profile-kwork-card glass">
                  <div className="pkwork-img">
                    <Layers size={48} color="rgba(255,255,255,0.2)" />
                    <span className="pkwork-cat">{kwork.category}</span>
                  </div>
                  <div className="pkwork-body">
                    <p className="pkwork-title">{kwork.title}</p>
                    <div className="pkwork-meta">
                      <div className="pkwork-rating"><Star size={13} fill="var(--warning)" color="var(--warning)" /> 5.0 (0)</div>
                      <span className="pkwork-price">от {kwork.price} ₽</span>
                    </div>
                  </div>
                </Link>
              )) : <div className="empty-reviews glass w-full">У пользователя пока нет активных кворков.</div>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FreelancerProfile;
