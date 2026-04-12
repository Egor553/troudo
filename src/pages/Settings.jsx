import React, { useState } from 'react';
import { User, CreditCard, Bell, Shield, Eye, EyeOff, CheckCircle, Trash2, ExternalLink, Smile } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { id: 'general', label: 'Общие', icon: <User size={16} /> },
  { id: 'profile', label: 'Профиль', icon: <Smile size={16} /> },
  { id: 'finance', label: 'Финансы', icon: <CreditCard size={16} /> },
  { id: 'notifications', label: 'Уведомления', icon: <Bell size={16} /> },
  { id: 'security', label: 'Безопасность', icon: <Shield size={16} /> },
];

const emojis = [
    '😎', '🚀', '💻', '🎨', '⚡', '🔥', '💎', '👑', 
    '🦊', '🐼', '🤖', '👾', '👨‍💻', '👩‍💻', '🦾', '🌈',
    '🍕', '☕', '🌟', '🌙', '🍀', '🎯', '🎸', '🎮',
    '🦄', '🦁', '🦉', '🐱', '🐶', '🐳', '🦜', '🐘'
];

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // Начнем с профиля для теста аватарки
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      name: formData.get('name'),
      specialization: formData.get('specialization'),
      bio: formData.get('bio'),
    };
    
    try {
      await updateProfile(updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Ошибка при сохранении: ' + err.message);
    }
  };

  const selectEmoji = (emoji) => {
    updateProfile({ avatar: emoji });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-page container">
      <h1 className="settings-title">Настройки</h1>

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <aside className="settings-sidebar glass">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="settings-content">

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <div className="settings-card glass">
              <h2>Настройки профиля</h2>
              
              <div className="avatar-selection-box">
                <label className="settings-label">Ваша аватарка</label>
                <div className="current-avatar-preview">
                    {user?.avatar?.length > 4 ? (
                        <img src={user.avatar} alt="Avatar" className="settings-avatar-img" />
                    ) : (
                        <div className="settings-avatar-emoji">{user?.avatar || '👤'}</div>
                    )}
                </div>
                
                <p className="form-hint" style={{ marginBottom: '15px' }}>Выберите свой аватар-смайлик:</p>
                <div className="emoji-grid">
                    {emojis.map(e => (
                        <button 
                            key={e} 
                            className={`emoji-item ${user?.avatar === e ? 'active' : ''}`}
                            onClick={() => selectEmoji(e)}
                        >
                            {e}
                        </button>
                    ))}
                </div>
              </div>

              <div className="settings-section-divider" />

              <form onSubmit={handleSave} className="settings-form">
                <div className="form-group">
                  <label>Имя (отображается публично)</label>
                  <input type="text" name="name" defaultValue={user?.name || ''} />
                </div>
                <div className="form-group">
                  <label>Заголовок профиля</label>
                  <input type="text" name="specialization" defaultValue={user?.specialization || ''} />
                </div>
                <div className="form-group">
                  <label>О себе</label>
                  <textarea rows="5" name="bio" defaultValue={user?.bio || ''} />
                </div>
                
                <button type="submit" className={`btn-primary ${saved ? 'btn-saved' : ''}`}>
                  {saved ? <><CheckCircle size={16} /> Сохранено!</> : 'Сохранить профиль'}
                </button>
              </form>
            </div>
          )}

          {/* ── GENERAL ── */}
          {activeTab === 'general' && (
            <div className="settings-card glass">
              <h2>Общие настройки</h2>
              {/* Аналогичный контент как был, но с использованием user.email */}
              <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user?.email || ''} readOnly className="phone-input-readonly" />
              </div>
              {/* ... */}
            </div>
          )}

          {/* Остальные вкладки (Finance, Notifications, etc.) можно оставить как были */}
          {activeTab === 'finance' && <div className="settings-card glass"><h2>Финансы</h2><p>Раздел в разработке...</p></div>}
          {activeTab === 'notifications' && <div className="settings-card glass"><h2>Уведомления</h2><p>Раздел в разработке...</p></div>}
          {activeTab === 'security' && <div className="settings-card glass"><h2>Безопасность</h2><p>Раздел в разработке...</p></div>}

        </main>
      </div>
    </div>
  );
};

export default Settings;
