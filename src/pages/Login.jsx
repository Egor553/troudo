import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) =>
    setForm(f => ({ ...f, [field]: field === 'remember' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      // Редирект по роли
      if (user.activeRole === 'freelancer') navigate('/freelancer/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-logo gradient-text">Troudo</div>
        <h2>Добро пожаловать!</h2>
        <p className="auth-subtitle">Войдите в свой аккаунт</p>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail size={17} />
              <input
                type="email"
                placeholder="example@mail.com"
                value={form.email}
                onChange={update('email')}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label>Пароль</label>
              <Link to="/forgot-password" className="forgot-link">Забыли пароль?</Link>
            </div>
            <div className="input-with-icon">
              <Lock size={17} />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={update('password')}
                required
                style={{ paddingRight: '44px' }}
                autoComplete="current-password"
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label className="remember-me">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={update('remember')}
              style={{ width: 'auto' }}
            />
            <span>Запомнить меня на 30 дней</span>
          </label>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
            style={{ padding: '15px', fontSize: '16px' }}
          >
            {loading ? <><Loader size={18} className="spin" /> Входим…</> : 'Войти'}
          </button>
        </form>

        <div className="auth-divider"><span>или войти через</span></div>
        <div className="social-auth">
          <button className="social-btn-auth">🔵 Google</button>
          <button className="social-btn-auth">💙 ВКонтакте</button>
        </div>

        <p className="auth-footer">
          Нет аккаунта? <Link to="/register" className="auth-link">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
