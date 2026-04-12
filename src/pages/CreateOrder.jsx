import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';

const categories = ['Дизайн', 'Разработка и IT', 'Тексты', 'SEO и трафик', 'Соцсети и маркетинг', 'Аудио, видео', 'Бизнес'];

const CreateOrder = () => {
  const { apiFetch, isClient } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Разработка и IT',
    budget: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isClient) {
        setError('Только заказчики могут публиковать проекты. Пожалуйста, переключите роль.');
        return;
    }

    setLoading(true);
    setError('');

    try {
      await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setSuccess(true);
      setTimeout(() => navigate('/catalog'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order-page container">
      <div className="create-order-card glass">
        <header className="create-order-header">
          <h1>Разместить заказ на бирже</h1>
          <p>Опишите задачу, и фрилансеры предложат свои услуги</p>
        </header>

        {error && (
          <div className="form-error">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success ? (
          <div className="form-success">
            <CheckCircle size={48} color="var(--accent-secondary)" />
            <h2>Заказ успешно опубликован!</h2>
            <p>Сейчас вы будете перенаправлены на биржу...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-group">
              <label>Как называется ваша задача?</label>
              <input 
                type="text" 
                placeholder="Например: Нужно создать логотип для кофейни" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <span className="input-hint">Кратко и понятно — так вы получите больше откликов</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Выберите категорию</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Ваш бюджет (₽)</label>
                <input 
                  type="number" 
                  placeholder="Например: 5000" 
                  required
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Подробное описание задачи</label>
              <textarea 
                rows="8" 
                placeholder="Расскажите подробнее: что нужно сделать, какие сроки, есть ли техническое задание..." 
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="order-form-footer">
              <button type="button" className="btn-link" onClick={() => navigate('/catalog')}>Отмена</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Публикация...' : <><Send size={18} /> Опубликовать на бирже</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateOrder;
