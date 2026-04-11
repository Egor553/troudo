import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Send, ArrowLeft } from 'lucide-react';

const DisputePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  return (
    <div className="narrow container dispute-page-wrapper">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={18} /> К заказу
      </button>

      <div className="dispute-header glass">
        <div className="dispute-title-row">
          <AlertCircle size={32} color="var(--error)" />
          <div>
            <h1>Спор по заказу #{id || '1234'}</h1>
            <p className="dispute-subtitle">Арбитраж Troudo рассмотрит вашу ситуацию в ближайшее время</p>
          </div>
        </div>
      </div>

      <div className="dispute-layout">
        <div className="dispute-info-card glass">
          <div className="info-group">
            <label>Инициатор спора</label>
            <div className="value">Клиент (Егор)</div>
          </div>
          <div className="info-group">
            <label>Причина</label>
            <div className="value">Несоответствие заданию</div>
          </div>
          <div className="info-group">
            <label>Статус</label>
            <div className="value" style={{ color: 'var(--warning)', fontWeight: 700 }}>Ожидание арбитра</div>
          </div>
        </div>

        <div className="dispute-chat glass">
          <div className="chat-header">
            <h3>Переписка по спору</h3>
            <p>Ваши сообщения видны только вам, другой стороне и администратору</p>
          </div>
          <div className="chat-content">
            <div className="message-system glass">
              Спор открыт 11.04 12:00. Администратор подключится в течение 4 часов.
            </div>
            <div className="message-bubble client">
              <div>Фрилансер прислал работу, которая совсем не похожа на те примеры, что в его портфолио.</div>
              <div className="message-time">12:05</div>
            </div>
          </div>
          <div className="chat-input-area">
            <input type="text" placeholder="Добавить сообщение для арбитража..." value={input} onChange={e => setInput(e.target.value)} />
            <button className="chat-send-btn"><Send size={20} /></button>
          </div>
        </div>

        <div className="dispute-actions">
          <button className="btn-secondary w-full" style={{ padding: '16px' }}>
            Закрыть спор (мы договорились сами)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisputePage;
