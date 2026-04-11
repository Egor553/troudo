import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

const CreateKwork = () => {
  const navigate = useNavigate();

  return (
    <div className="narrow container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={20} /> Назад
      </button>
      <div className="form-card glass">
        <h1>Создать кворк</h1>
        <p className="subtitle">Опишите свою услугу так, чтобы клиенты захотели ее купить</p>

        <form className="kwork-form">
          <div className="form-section">
            <h3>Общая информация</h3>
            <div className="form-group">
              <label>Название кворка</label>
              <input type="text" placeholder="Например: Сделаю профессиональный логотип за 24 часа" required />
            </div>
            <div className="form-group">
              <label>Категория</label>
              <select required>
                <option value="">Выберите категорию</option>
                <option>Дизайн</option>
                <option>Программирование</option>
                <option>Тексты</option>
                <option>Маркетинг</option>
                <option>Видео</option>
              </select>
            </div>
            <div className="form-group">
              <label>Описание</label>
              <textarea rows="5" placeholder="Опишите вашу услугу максимально подробно." required></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3>Примеры работ</h3>
            <div className="upload-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="upload-box glass">
                  <Plus size={24} />
                  <span>Загрузить</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Пакеты услуг</h3>
            <div className="packages-grid">
              {[
                { name: 'Базовый', price: '1000', period: '1' },
                { name: 'Оптимальный', price: '3000', period: '3' },
                { name: 'VIP', price: '7000', period: '7' },
              ].map((pkg) => (
                <div key={pkg.name} className="package-form-card glass">
                  <h4>{pkg.name}</h4>
                  <div className="form-group">
                    <label>Цена (₽)</label>
                    <input type="number" defaultValue={pkg.price} />
                  </div>
                  <div className="form-group">
                    <label>Срок (дней)</label>
                    <input type="number" defaultValue={pkg.period} />
                  </div>
                  <div className="form-group">
                    <label>Что входит</label>
                    <textarea rows="3" placeholder="Напишите список..."></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn-primary w-full" style={{ padding: '18px', fontSize: '18px' }}>
              Отправить на модерацию
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateKwork;
