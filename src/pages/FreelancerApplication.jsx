import React, { useState } from 'react';
import { Upload, Clock } from 'lucide-react';

const FreelancerApplication = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <div className="narrow container">
        <div className="status-card glass">
          <Clock size={64} className="icon-pulse" color="var(--warning)" />
          <h1>Заявка на модерации</h1>
          <p>Ваша заявка успешно отправлена. Обычно мы проверяем анкеты в течение <strong>24 часов</strong>.</p>
          <div className="hint glass">Мы пришлем уведомление на ваш email сразу после проверки.</div>
          <button onClick={() => setIsSubmitted(false)} className="btn-secondary">Вернуться в профиль</button>
        </div>
      </div>
    );
  }

  return (
    <div className="narrow container">
      <div className="form-card glass">
        <h1>Стать фрилансером</h1>
        <p className="subtitle">Заполните анкету, чтобы получить доступ к заказам и создавать кворки</p>
        <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="application-form">
          <div className="form-group">
            <label>Категории услуг</label>
            <div className="checkbox-grid">
              {['Дизайн', 'Тексты', 'Программирование', 'Маркетинг', 'Видео', 'Бизнес'].map(cat => (
                <label key={cat} className="checkbox-item glass">
                  <input type="checkbox" style={{ width: 'auto' }} />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Навыки (через запятую)</label>
            <input type="text" placeholder="Figma, React, Node.js, Python..." required />
          </div>
          <div className="form-group">
            <label>Портфолио (ссылки или файлы)</label>
            <div className="portfolio-upload glass">
              <Upload size={24} />
              <span>Загрузить файлы или перетащить сюда</span>
              <p>JPG, PNG, PDF до 50MB</p>
            </div>
            <input type="text" placeholder="Ссылка на Behance, GitHub или Dribbble" style={{ marginTop: '12px' }} />
          </div>
          <div className="form-group">
            <label>Кратко о себе</label>
            <textarea rows="4" placeholder="Расскажите о вашем опыте и достижениях..." required></textarea>
          </div>
          <div className="form-group">
            <label>Желаемая ставка (₽)</label>
            <div className="rate-input">
              <input type="number" placeholder="2000" required />
              <span>в час или за проект</span>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" style={{ padding: '16px', fontSize: '18px' }}>Отправить на модерацию</button>
        </form>
      </div>
    </div>
  );
};

export default FreelancerApplication;
