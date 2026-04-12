import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CreateKwork = () => {
  const navigate = useNavigate();
  const { apiFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const kworkData = {
      title: formData.get('title'),
      category: formData.get('category'),
      description: formData.get('description'),
      price: formData.get('price_basic'), // Using basic price as main price for list
      packages: [
        { name: 'Базовый', price: formData.get('price_basic'), period: formData.get('period_basic'), desc: formData.get('desc_basic') },
        { name: 'Оптимальный', price: formData.get('price_opt'), period: formData.get('period_opt'), desc: formData.get('desc_opt') },
        { name: 'VIP', price: formData.get('price_vip'), period: formData.get('period_vip'), desc: formData.get('desc_vip') },
      ]
    };

    try {
      await apiFetch('/kworks', {
        method: 'POST',
        body: JSON.stringify(kworkData)
      });
      navigate('/freelancer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="narrow container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={20} /> Назад
      </button>
      <div className="form-card glass">
        <h1>Создать кворк</h1>
        <p className="subtitle">Опишите свою услугу так, чтобы клиенты захотели ее купить</p>

        {error && <div className="error-box glass">{error}</div>}

        <form className="kwork-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Общая информация</h3>
            <div className="form-group">
              <label>Название кворка</label>
              <input name="title" type="text" placeholder="Например: Сделаю профессиональный логотип за 24 часа" required />
            </div>
            <div className="form-group">
              <label>Категория</label>
              <select name="category" required>
                <option value="">Выберите категорию</option>
                <option>Дизайн</option>
                <option>Разработка и IT</option>
                <option>Тексты</option>
                <option>Маркетинг</option>
                <option>Видео</option>
              </select>
            </div>
            <div className="form-group">
              <label>Описание</label>
              <textarea name="description" rows="5" placeholder="Опишите вашу услугу максимально подробно." required></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3>Пакеты услуг</h3>
            <div className="packages-grid">
              <div className="package-form-card glass">
                <h4>Базовый</h4>
                <div className="form-group"><label>Цена (₽)</label><input name="price_basic" type="number" defaultValue="1000" required /></div>
                <div className="form-group"><label>Срок (дней)</label><input name="period_basic" type="number" defaultValue="1" required /></div>
                <div className="form-group"><label>Что входит</label><textarea name="desc_basic" rows="3" placeholder="Краткое описание..."></textarea></div>
              </div>
              <div className="package-form-card glass">
                <h4>Оптимальный</h4>
                <div className="form-group"><label>Цена (₽)</label><input name="price_opt" type="number" defaultValue="3000" /></div>
                <div className="form-group"><label>Срок (дней)</label><input name="period_opt" type="number" defaultValue="3" /></div>
                <div className="form-group"><label>Что входит</label><textarea name="desc_opt" rows="3"></textarea></div>
              </div>
              <div className="package-form-card glass">
                <h4>VIP</h4>
                <div className="form-group"><label>Цена (₽)</label><input name="price_vip" type="number" defaultValue="7000" /></div>
                <div className="form-group"><label>Срок (дней)</label><input name="period_vip" type="number" defaultValue="7" /></div>
                <div className="form-group"><label>Что входит</label><textarea name="desc_vip" rows="3"></textarea></div>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn-primary w-full" style={{ padding: '18px', fontSize: '18px' }} disabled={loading}>
              {loading ? 'Создание...' : 'Опубликовать кворк'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateKwork;
