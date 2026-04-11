import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, MessageSquare, DollarSign, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const categories = ['Все категории', 'Дизайн', 'Разработка и IT', 'Тексты', 'SEO и трафик', 'Соцсети и маркетинг', 'Аудио, видео', 'Бизнес'];

const Catalog = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const location = useLocation();
  
  // Получаем категорию из URL если она есть
  const queryParams = new URLSearchParams(location.search);
  const initialCat = queryParams.get('cat') || 'Все категории';
  const [activeCat, setActiveCat] = useState(initialCat);

  useEffect(() => {
    fetchProjects();
  }, [activeCat, search]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/projects?q=${search}`;
      if (activeCat !== 'Все категории') {
        url += `&category=${encodeURIComponent(activeCat)}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exchange-page container">
      {/* Search Header */}
      <section className="exchange-hero">
        <div className="exchange-hero-content">
          <h1>Биржа проектов</h1>
          <p>Найдите идеальный заказ для своей работы или предложите свои услуги</p>
          
          <div className="exchange-search-wrap glass">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Поиск по задачам (например: лендинг на react)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn-primary" onClick={fetchProjects}>Найти</button>
          </div>
        </div>
      </section>

      <div className="exchange-layout">
        {/* Sidebar Filters */}
        <aside className="exchange-sidebar">
          <div className="filter-card glass">
            <div className="filter-header">
              <Filter size={18} />
              <h3>Категории</h3>
            </div>
            <div className="cat-list">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`cat-item ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="exchange-info-card glass">
            <h4>Как работает биржа?</h4>
            <ol>
              <li>Выбираете интересный проект</li>
              <li>Оставляете свой отклик</li>
              <li>Заказчик выбирает исполнителя</li>
              <li>Работаете через "Безопасную сделку"</li>
            </ol>
          </div>
        </aside>

        {/* Projects List */}
        <main className="exchange-main">
          <div className="results-info">
            <span>Найдено проектов: <strong>{projects.length}</strong></span>
            <div className="sort-select">
              Сортировка: <span>Новые</span>
            </div>
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
                        <span className="project-date">
                          <Clock size={12} /> {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 className="project-title">{project.title}</h2>
                      <p className="project-desc">{project.description}</p>
                      
                      <div className="project-stats">
                        <div className="stat-item">
                          <MessageSquare size={16} />
                          <span>{project.offersCount} предложений</span>
                        </div>
                        <div className="stat-item">
                          <DollarSign size={16} />
                          <span>Бюджет: <strong>{project.budget} ₽</strong></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="project-actions">
                      <button className="btn-primary">Предложить услугу</button>
                      <button className="btn-link">Подробнее <ChevronRight size={16} /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results glass">
                  <h3>Подходящих проектов пока нет</h3>
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
