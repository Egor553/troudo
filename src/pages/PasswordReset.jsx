import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Страница «Забыли пароль?» ──────────────────────────────
export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null); // { email, token }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = await forgotPassword(email);
      setSent({ email, token });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card glass">
          <div className="email-sent-icon">✉️</div>
          <h2>Письмо отправлено</h2>
          <p>Проверьте почту <strong>{sent.email}</strong>.<br />Ссылка действует 1 час.</p>
          {/* DEV shortcut */}
          <div className="dev-hint glass">
            <p style={{ fontSize: '12px', color: 'var(--warning)', marginBottom: '8px' }}>🛠 DEV: ссылка для сброса</p>
            <Link to={`/reset-password?token=${sent.token}`} className="btn-primary w-full" style={{ justifyContent: 'center' }}>
              Сбросить пароль →
            </Link>
          </div>
          <Link to="/login" className="btn-secondary w-full" style={{ justifyContent: 'center' }}>
            ← Назад ко входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-logo gradient-text">Troudo</div>
        <h2>Забыли пароль?</h2>
        <p className="auth-subtitle">Введите email — отправим ссылку для сброса</p>

        {error && <div className="auth-error"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail size={17} />
              <input type="email" placeholder="example@mail.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading} style={{ padding: '15px', fontSize: '16px' }}>
            {loading ? <><Loader size={18} className="spin" /> Отправляем…</> : 'Отправить ссылку'}
          </button>
        </form>

        <p className="auth-footer">
          Вспомнили? <Link to="/login" className="auth-link">Войти</Link>
        </p>
      </div>
    </div>
  );
};

// ── Страница «Сброс пароля» ────────────────────────────────
export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', password2: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) { setError('Пароли не совпадают'); return; }
    if (form.password.length < 6) { setError('Минимум 6 символов'); return; }
    setLoading(true);
    try {
      await resetPassword(token, form.password);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card glass verify-card">
          <CheckCircle size={72} color="var(--accent-secondary)" />
          <h2>Пароль изменён!</h2>
          <p>Теперь вы можете войти с новым паролем.</p>
          <Link to="/login" className="btn-primary w-full" style={{ justifyContent: 'center', padding: '16px' }}>
            Войти →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-logo gradient-text">Troudo</div>
        <h2>Новый пароль</h2>
        <p className="auth-subtitle">Придумайте надёжный пароль</p>

        {error && <div className="auth-error"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Новый пароль</label>
            <div className="input-with-icon">
              <Lock size={17} />
              <input type={showPwd ? 'text' : 'password'} placeholder="Минимум 6 символов" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required style={{ paddingRight: '44px' }} />
              <button type="button" className="pass-toggle" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Повторите пароль</label>
            <div className="input-with-icon">
              <Lock size={17} />
              <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={form.password2}
                onChange={e => setForm(f => ({ ...f, password2: e.target.value }))} required />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading} style={{ padding: '15px', fontSize: '16px' }}>
            {loading ? <><Loader size={18} className="spin" /> Сохраняем…</> : 'Сохранить пароль'}
          </button>
        </form>
      </div>
    </div>
  );
};
