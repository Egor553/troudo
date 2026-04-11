import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CreateOrder = () => {
  const navigate = useNavigate();

  return (
    <div className="narrow container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={20} /> Назад
      </button>
      <div className="form-card glass">
        <h1>Создать заказ</h1>
        <p className="subtitle">Опишите вашу задачу, и фрилансеры сами откликнутся на нее</p>
        <form className="order-form">
          <div className="form-group">
            <label>Название заказа</label>
            <input type="text" placeholder="Например: Разработка логотипа для кофейни" required />
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
              <option>Бизнес-услуги</option>
            </select>
          </div>
          <div className="form-group">
            <label>Описание задачи</label>
            <textarea rows="6" placeholder="Подробно опишите, что нужно сделать..." required></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Бюджет (₽)</label>
              <input type="number" placeholder="5000" required />
            </div>
            <div className="form-group">
              <label>Срок выполнения</label>
              <input type="date" required />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Опубликовать заказ</button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
