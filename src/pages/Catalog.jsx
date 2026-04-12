import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = ['Все категории', 'Дизайн', 'Разработка и IT', 'Тексты', 'Маркетинг', 'Видео', 'Соцсети', 'Аудио'];

const Catalog = () => {
  const [kworks, setKworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Все категории');
  const { apiFetch } = useAuth();

  useEffect(() => {
    fetchKworks();
  }, [activeCat, search]);

  const fetchKworks = async () => {
    setLoading(true);
    try {
      let url = `/kworks?q=${search}`;
      if (activeCat !== 'Все категории') {
        url += `&category=${encodeURIComponent(activeCat)}`;
      }
      const data = await apiFetch(url);
      setKworks(data);
    } catch (err) {
      console.error('Failed to fetch kworks:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="catalog-page container fade-in">
      <header className="catalog-header">
        <div className="catalog-hero-minimal glass">
          <h1>Каталог услуг</h1>
          <p>Профессиональные фриланс-услуги для вашего бизнеса по фиксированной цене</p>
          <div className="catalog-search-bar">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Что вы ищете? Например: Логотип" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn-primary" onClick={fetchKworks}>Найти услуги</button>
          </div>
        </div>
      </header>

      <div className="catalog-content-layout">
        <aside className="catalog-sidebar">
          <div className="filter-group glass">
            <h3>Категории</h3>
            <div className="filter-list">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`filter-item ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group glass mt-4">
            <h3>Бюджет</h3>
            <div className="price-filters">
              <input type="number" placeholder="От 500 ₽" className="glass-input" />
              <input type="number" placeholder="До" className="glass-input" />
            </div>
          </div>
        </aside>

        <main className="catalog-results">
          {loading ? (
            <div className="catalog-loading">Загрузка лучших предложений...</div>
          ) : (
            <div className="kworks-grid">
              {kworks.length > 0 ? (
                kworks.map(kwork => (
                  <Link to={`/kwork/${kwork.id}`} key={kwork.id} className="kwork-card-link">
                    <div className="kwork-card glass">
                      <div className="kwork-card-preview">
                        <div className="preview-placeholder">
                          <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${kwork.id}`} alt="preivew" />
                        </div>
                        <div className="kwork-card-badge">{kwork.category}</div>
                      </div>
                      <div className="kwork-card-info">
                        <div className="kwork-card-author">
                          <div className="author-avatar">{kwork.freelancer.avatar || '👤'}</div>
                          <span>{kwork.freelancer.name}</span>
                        </div>
                        <h3 className="kwork-card-title">{kwork.title}</h3>
                        <div className="kwork-card-meta">
                          <div className="meta-rating">
                            <Star size={14} fill="var(--warning)" color="var(--warning)" />
                            <span>5.0</span>
                          </div>
                          <div className="meta-price">
                            <span className="label">от</span>
                            <span className="value">{kwork.price} ₽</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-kworks glass">
                  <h3>Услуг не найдено</h3>
                  <p>Попробуйте изменить параметры поиска или категорию</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
