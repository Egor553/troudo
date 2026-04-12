import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, MessageSquare, DollarSign, ChevronRight, Send, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = ['Все категории', 'Дизайн', 'Разработка и IT', 'Тексты', 'SEO и трафик', 'Соцсети и маркетинг', 'Аудио, видео', 'Бизнес'];

const Exchange = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(null); // Для модалки отклика
  const [offerData, setOfferData] = useState({ price: '', message: '' });
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState('');

  const { user, apiFetch, isFreelancer } = useAuth();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialCat = queryParams.get('cat') || 'Все категории';
  const [activeCat, setActiveCat] = useState(initialCat);

  useEffect(() => {
    fetchProjects();
  }, [activeCat, search]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let url = `/projects?q=${search}`;
      if (activeCat !== 'Все категории') {
        url += `&category=${encodeURIComponent(activeCat)}`;
      }
      const data = await apiFetch(url);
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    if (!isFreelancer) {
        setOfferError('Только фрилансеры могут оставлять отклики.');
        return;
    }
    setOfferLoading(true);
    setOfferError('');
    try {
        await apiFetch(`/projects/${selectedProject.id}/offers`, {
            method: 'POST',
            body: JSON.stringify(offerData)
        });
        setSelectedProject(null);
        setOfferData({ price: '', message: '' });
        fetchProjects(); // Обновляем счетчик предложений
    } catch (err) {
        setOfferError(err.message);
    } finally {
        setOfferLoading(false);
    }
  };

  return (
    <div className="exchange-page container">
      <section className="exchange-hero">
        <div className="exchange-hero-content">
          <h1>Биржа проектов</h1>
          <p>Найдите идеальный заказ для своей работы или предложите свои услуги</p>
          <div className="exchange-search-wrap glass">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Поиск по задачам..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn-primary" onClick={fetchProjects}>Найти</button>
          </div>
        </div>
      </section>

      <div className="exchange-layout">
        <aside className="exchange-sidebar">
          <div className="filter-card glass">
            <div className="filter-header"><Filter size={18} /><h3>Категории</h3></div>
            <div className="cat-list">
              {categories.map(cat => (
                <button key={cat} className={`cat-item ${activeCat === cat ? 'active' : ''}`} onClick={() => setActiveCat(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="exchange-main">
          <div className="results-info">
            <span>Найдено проектов: <strong>{projects.length}</strong></span>
          </div>

          {loading ? (
            <div className="exchange-loading">Загрузка проектов...</div>
          ) : (
            <div className="projects-list">
              {projects.length > 0 ? (
                projects.map(project => (
                  <div key={project.id} className="project-card glass">
                    <div className="project-main-info">
                      <div className="project-top">
                        <span className="project-category">{project.category}</span>
                        <span className="project-date"><Clock size={12} /> {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h2 className="project-title">{project.title}</h2>
                      <p className="project-desc">{project.description}</p>
                      <div className="project-stats">
                        <div className="stat-item"><MessageSquare size={16} /><span>{project.offersCount} предложений</span></div>
                        <div className="stat-item"><DollarSign size={16} /><span>Бюджет: <strong>{project.budget} ₽</strong></span></div>
                      </div>
                    </div>
                    <div className="project-actions">
                      <button 
                        className="btn-primary" 
                        onClick={() => setSelectedProject(project)}
                        disabled={project.clientId === user?.id}
                      >
                        {project.clientId === user?.id ? 'Ваш проект' : 'Откликнуться'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results glass"><h3>Проектов не найдено</h3></div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Модалка отклика */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content glass" onClick={e => e.stopPropagation()}>
            <h3>Отклик на проект: {selectedProject.title}</h3>
            {offerError && <div className="form-error"><AlertCircle size={16}/> {offerError}</div>}
            <form onSubmit={handleMakeOffer}>
                <div className="form-group">
                    <label>Ваша цена (₽)</label>
                    <input 
                        type="number" 
                        required 
                        value={offerData.price}
                        onChange={e => setOfferData({...offerData, price: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Комментарий к отклику</label>
                    <textarea 
                        rows="4" 
                        placeholder="Почему стоит выбрать вас?" 
                        required
                        value={offerData.message}
                        onChange={e => setOfferData({...offerData, message: e.target.value})}
                    />
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn-link" onClick={() => setSelectedProject(null)}>Отмена</button>
                    <button type="submit" className="btn-primary" disabled={offerLoading}>
                        {offerLoading ? 'Отправка...' : <><Send size={16}/> Отправить предложение</>}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exchange;
