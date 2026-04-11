import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, ChevronRight, MousePointer, CreditCard, 
  ThumbsUp, Star, ArrowRight, TrendingUp
} from 'lucide-react';

const categories = [
  { name: 'Разработка и IT', icon: '💻', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop', count: '48 000+' },
  { name: 'Дизайн', icon: '🎨', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop', count: '62 000+' },
  { name: 'SEO и трафик', icon: '📈', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', count: '29 000+' },
  { name: 'Соцсети и маркетинг', icon: '📱', img: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&h=250&fit=crop', count: '18 000+' },
  { name: 'Бизнес и жизнь', icon: '💼', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop', count: '11 000+' },
  { name: 'Тексты и переводы', icon: '✍️', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop', count: '34 000+' },
  { name: 'Аудио, видео, съемка', icon: '🎥', img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop', count: '15 000+' },
];

const popularKworks = [
  { id: 1, img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=200&fit=crop', author: 'Alexdesign', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', title: 'Профессиональный логотип', price: '1500' },
  { id: 2, img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=300&h=200&fit=crop', author: 'WebStudio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=web', title: 'Сайт на React/Next.js', price: '5000' },
  { id: 3, img: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=300&h=200&fit=crop', author: 'TextPro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=text', title: 'SEO-статья под ключ', price: '800' },
  { id: 4, img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=200&fit=crop', author: 'SocialMark', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=social', title: 'Ведение Instagram / TikTok', price: '3000' },
];

const popularTags = ['Веб-дизайн', 'Логотип', 'SEO', 'Wordpress', 'Монтаж видео', 'Контент', 'React'];

const steps = [
  { icon: <MousePointer size={28} />, title: 'Выберите услугу', desc: 'Тысячи готовых кворков от проверенных специалистов' },
  { icon: <CreditCard size={28} />, title: 'Оплатите', desc: 'Деньги заморожены — исполнитель получит их только после вашего одобрения' },
  { icon: <ThumbsUp size={28} />, title: 'Получите результат', desc: '100% гарантия возврата средств, если работа вам не понравится' },
];

const Home = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="home-page fade-in">

      {/* ───── HERO ───── */}
      <section className="hero-kwork">
        <div className="container">
          <div className="hero-kwork-grid">
            <motion.div 
              className="hero-kwork-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="hero-commission-badge">✨ Комиссия всего 5% — лучшее на рынке</div>
              <h1>Покупайте фриланс-услуги <span className="gradient-text">в один клик</span></h1>
              <p>Биржа фриланса нового поколения. Безопасная сделка, честная цена, быстрый вывод.</p>

              <div className="hero-search glass">
                <Search size={20} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  placeholder="Создать сайт, нарисовать логотип, написать текст…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <Link to={`/catalog?q=${query}`} className="btn-primary hero-search-btn">Найти</Link>
              </div>

              <div className="hero-tags">
                <span className="tags-label">Популярное:</span>
                {popularTags.map(tag => (
                  <Link key={tag} to={`/catalog?q=${tag}`} className="hero-tag">
                    <Search size={12} /> {tag}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="hero-kwork-right"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="hero-stats-float glass">
                <div className="hero-stat-item">
                  <span className="hs-num gradient-text">5%</span>
                  <span className="hs-label">Комиссия</span>
                </div>
                <div className="hero-stat-item">
                  <span className="hs-num gradient-text">1ч</span>
                  <span className="hs-label">Вывод</span>
                </div>
                <div className="hero-stat-item">
                  <span className="hs-num gradient-text">100%</span>
                  <span className="hs-label">Защита</span>
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&h=500&fit=crop"
                alt="Freelancer"
                className="hero-freelancer-img"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── TRUST BAR ───── */}
      <section className="trust-bar">
        <div className="container trust-bar-inner">
          <span className="trust-label">Нам доверяют:</span>
          {['Сбер', 'Mail.ru', 'Яндекс', 'ВКонтакте', 'Авито', 'Ozon'].map(brand => (
            <div key={brand} className="trust-brand">{brand}</div>
          ))}
        </div>
      </section>

      {/* ───── CATEGORIES GRID ───── */}
      <section className="section-block container">
        <div className="section-header-row">
          <h2>Выберите рубрику, чтобы начать</h2>
          <Link to="/catalog" className="view-all-link">Все категории <ArrowRight size={16} /></Link>
        </div>
        <div className="cat-grid">
          {categories.map((cat, i) => (
            <Link key={i} to={`/catalog?cat=${cat.name}`} className="cat-card">
              <img src={cat.img} alt={cat.name} />
              <div className="cat-card-overlay">
                <span className="cat-card-name">{cat.name}</span>
                <span className="cat-card-count">{cat.count} кворков</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── PLATFORM STATS ───── */}
      <section className="platform-stats-section">
        <div className="container platform-stats-inner glass">
          <div className="platform-brand">
            <span className="platform-logo gradient-text">Troudo</span>
            <span className="platform-tagline">Честная биржа фриланса</span>
          </div>
          <div className="platform-stat">
            <span className="ps-num">250 000+</span>
            <span className="ps-label">Активных кворков</span>
          </div>
          <div className="platform-stat">
            <span className="ps-num">3 200</span>
            <span className="ps-label">Новых кворков за неделю</span>
          </div>
          <div className="platform-stat">
            <span className="ps-num">18 500</span>
            <span className="ps-label">Фрилансеров</span>
          </div>
          <div className="platform-stat">
            <span className="ps-num">5%</span>
            <span className="ps-label">Комиссия (лучшая на рынке)</span>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="how-section">
        <div className="container">
          <div className="how-header">
            <h2>Как решать задачи на Troudo</h2>
            <p>Идеально подходит для бизнеса и для себя</p>
          </div>
          <div className="how-steps">
            {steps.map((step, i) => (
              <motion.div 
                key={i} 
                className="how-step glass"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="how-step-num">{i + 1}</div>
                <div className="how-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── POPULAR KWORKS ───── */}
      <section className="section-block container">
        <div className="section-header-row">
          <h2>Вдохновляйтесь проектами наших фрилансеров</h2>
          <Link to="/catalog" className="view-all-link">Смотреть все <ArrowRight size={16} /></Link>
        </div>
        <div className="portfolio-grid">
          {popularKworks.map(kwork => (
            <Link key={kwork.id} to={`/kwork/${kwork.id}`} className="portfolio-card glass">
              <div className="portfolio-img">
                <img src={kwork.img} alt={kwork.title} />
              </div>
              <div className="portfolio-info">
                <div className="portfolio-author">
                  <img src={kwork.avatar} alt={kwork.author} />
                  <span>Автор: <strong>{kwork.author}</strong></span>
                </div>
                <div className="portfolio-bottom">
                  <span className="portfolio-title">{kwork.title}</span>
                  <span className="portfolio-price">от {kwork.price} ₽</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── WHY TROUDO ───── */}
      <section className="why-section container">
        <div className="why-banner glass">
          <div className="why-text">
            <h2>Почему Troudo лучше?</h2>
            <p>Мы единственная биржа, которая берёт всего 5% комиссии. Все остальные — от 15% до 25%.</p>
            <div className="why-benefits">
              <div className="why-item">💰 <span>Комиссия 5% вместо 20%</span></div>
              <div className="why-item">⚡ <span>Вывод денег за 1 час</span></div>
              <div className="why-item">🛡️ <span>Эскроу — деньги под защитой</span></div>
              <div className="why-item">⭐ <span>Проверенные фрилансеры</span></div>
            </div>
            <div className="why-btns">
              <Link to="/catalog" className="btn-primary btn-lg">Найти исполнителя</Link>
              <Link to="/register" className="btn-secondary btn-lg">Начать зарабатывать</Link>
            </div>
          </div>
          <div className="why-visual">
            <div className="commission-compare">
              <div className="compare-bar">
                <span>Troudo</span>
                <div className="bar-track"><div className="bar-fill troudo-bar">5%</div></div>
              </div>
              <div className="compare-bar">
                <span>Kwork</span>
                <div className="bar-track"><div className="bar-fill kwork-bar">20%</div></div>
              </div>
              <div className="compare-bar">
                <span>Другие</span>
                <div className="bar-track"><div className="bar-fill other-bar">25%</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
