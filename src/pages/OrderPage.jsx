import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';

const OrderPage = () => {
  const { id } = useParams();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'freelancer', text: 'Здравствуйте! Я начал работу над логотипом. Пришлю первые варианты к завтрашнему вечеру.', time: '10:30' },
    { id: 2, sender: 'client', text: 'Хорошо, спасибо! Жду.', time: '10:45' },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'client', text: input, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div className="order-page-wrapper container">
      <div className="order-header glass">
        <div className="order-info-main">
          <h1>Заказ #{id}: Разработка логотипа</h1>
          <div className="order-meta-info">
            <span className="status-badge status-work">В работе</span>
            <span className="budget">Бюджет: 5,000 ₽</span>
          </div>
        </div>
      </div>

      <div className="order-layout">
        <div className="order-chat-col">
          <div className="chat-container glass">
            <div className="chat-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                  <div>{msg.text}</div>
                  <div className="message-time">{msg.time}</div>
                </div>
              ))}
            </div>
            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Напишите сообщение..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button className="chat-send-btn" onClick={sendMessage}><Send size={20} /></button>
            </div>
          </div>
        </div>

        <aside className="order-sidebar-col">
          <div className="sidebar-block glass">
            <h3>Результаты работы</h3>
            <div className="empty-state">Файлов пока нет</div>
            <div className="sidebar-btns" style={{ marginTop: '16px' }}>
              <button className="btn-primary w-full">Сдать работу</button>
              <button className="btn-secondary w-full">Запросить доработку</button>
            </div>
          </div>

          <div className="sidebar-block glass">
            <h3>Управление сделкой</h3>
            <div className="deal-controls">
              <button className="btn-success"><CheckCircle size={16} /> Принять работу</button>
              <Link to={`/dispute/${id}`} className="btn-danger"><AlertTriangle size={16} /> Открыть спор</Link>
            </div>
          </div>

          <div className="sidebar-block glass">
            <h3>История статусов</h3>
            <div className="status-history">
              {[
                { label: 'Заказ создан', time: '11.04 10:00', state: 'completed' },
                { label: 'Оплачен клиентом', time: '11.04 10:15', state: 'completed' },
                { label: 'В работе', time: '11.04 10:30', state: 'active' },
                { label: 'Сдан на проверку', state: '' },
                { label: 'Завершён', state: '' },
              ].map((item, i) => (
                <div key={i} className={`history-item ${item.state}`}>
                  <div className="dot"></div>
                  <div className="history-text">
                    {item.label}
                    {item.time && <span>{item.time}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderPage;
