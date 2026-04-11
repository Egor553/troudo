import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Check, Globe, MessageCircle, ArrowLeft } from 'lucide-react';

const packages = [
  { id: 'basic', name: 'Базовый', price: '1,000', period: '1 день', features: ['2 варианта', 'JPEG/PNG', '3 правки'] },
  { id: 'optimal', name: 'Оптимальный', price: '3,000', period: '3 дня', features: ['5 вариантов', 'Исходники', 'Безлимитные правки', '3D визуализация'] },
  { id: 'vip', name: 'VIP', price: '7,000', period: '7 дней', features: ['Все из Оптимального', 'Анимация логотипа', 'Брендбук', 'Приоритетная поддержка'] },
];

const KworkDetail = () => {
  const { id } = useParams();

  return (
    <div className="container">
      <Link to="/catalog" className="back-link"><ArrowLeft size={18} /> К списку услуг</Link>

      <div className="kwork-detail-layout">
        <main className="kwork-main">
          <h1>Разработка современного логотипа для вашего бренда</h1>

          <div className="kwork-gallery glass">
            <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=400&fit=crop" alt="Gallery main" />
            <div className="gallery-thumbs">
              <div className="thumb active"><img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=100&h=80&fit=crop" alt="T1" /></div>
              <div className="thumb"><img src="https://images.unsplash.com/photo-1626785774645-316279f57997?w=100&h=80&fit=crop" alt="T2" /></div>
              <div className="thumb"><img src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=100&h=80&fit=crop" alt="T3" /></div>
            </div>
          </div>

          <div className="kwork-section">
            <h2>Описание услуги</h2>
            <p>Я создам для вас уникальный, запоминающийся и профессиональный логотип, который выделит ваш бренд на фоне конкурентов. В работе использую современные тренды дизайна и учитываю специфику вашей ниши.</p>
            <ul>
              <li>Индивидуальный подход к каждому проекту</li>
              <li>Высокое разрешение и векторные форматы</li>
              <li>Строгое соблюдение сроков</li>
            </ul>
          </div>

          <div className="kwork-section">
            <h2>Отзывы заказчиков</h2>
            {[
              { name: 'Сергей В.', seed: '10', text: 'Отличная работа! Логотип получился именно таким, как я и представлял.' },
              { name: 'Наталья П.', seed: '20', text: 'Фрилансер работает быстро и качественно. Рекомендую!' },
            ].map((r, i) => (
              <div key={i} className="review-card glass">
                <div className="review-header">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.seed}`} alt="Avatar" className="avatar-small" />
                  <div>
                    <div className="review-author">{r.name}</div>
                    <div className="rating"><Star size={12} fill="var(--warning)" color="var(--warning)" /> 5.0</div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </main>

        <aside className="kwork-sidebar">
          <div className="packages-container glass">
            <div className="package-tabs">
              {packages.map(pkg => (
                <div key={pkg.id} className={`package-tab ${pkg.id === 'optimal' ? 'active' : ''}`}>
                  <h3>{pkg.name}</h3>
                  <div className="pkg-price">{pkg.price} ₽</div>
                </div>
              ))}
            </div>
            <div className="package-content">
              <div className="pkg-meta">
                <span><Globe size={14} /> {packages[1].period}</span>
              </div>
              <ul className="pkg-features">
                {packages[1].features.map(f => (
                  <li key={f}><Check size={14} color="var(--accent-secondary)" /> {f}</li>
                ))}
              </ul>
              <button className="btn-primary w-full">Заказать за {packages[1].price} ₽</button>
              <button className="btn-secondary w-full"><MessageCircle size={16} /> Написать продавцу</button>
            </div>
          </div>

          <div className="seller-card glass">
            <div className="seller-info">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=freelancer1" alt="Freelancer" className="seller-avatar" />
              <div>
                <div className="seller-name">Александр Д.</div>
                <div className="seller-rank">⭐ Топ-продавец</div>
              </div>
            </div>
            <div className="seller-stats">
              <div><span>5.0</span>Рейтинг</div>
              <div><span>500+</span>Заказов</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default KworkDetail;
