import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [resendStatus, setResendStatus] = useState('none'); // 'none' | 'loading' | 'success'

  const update = (field) => (e) =>
    setForm(f => ({ ...f, [field]: field === 'remember' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Race condition guard
    setError('');
    setResendStatus('none');
    setLoading(true);
    try {
      const user = await login(form);
      // Redirect based on role
      if (user.activeRole === 'freelancer') navigate('/freelancer/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message === 'EMAIL_NOT_VERIFIED' ? 'Ваш Email еще не подтвержден. Пожалуйста, проверьте почту.' : (err.message === 'INVALID_CREDENTIALS' ? 'Неверная почта или пароль' : err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendStatus('loading');
    try {
      await resendVerification(form.email);
      setResendStatus('success');
    } catch (err) {
      alert('Ошибка: ' + err.message);
      setResendStatus('none');
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card glass">
        <div className="auth-logo gradient-text">Troudo</div>
        <h2>Добро пожаловать!</h2>
        <p className="auth-subtitle">Войдите в свой аккаунт</p>

        {error && (
          <div className="auth-error-box fade-in">
            <div className="auth-error-header">
              <AlertCircle size={20} className="error-icon" />
              <span>{error}</span>
            </div>
            {error.includes('подтвержден') && resendStatus !== 'success' && (
              <div className="auth-error-actions">
                <p>Не получили письмо? Мы можем отправить его еще раз.</p>
                <button
                  className="btn-text-action"
                  onClick={handleResend}
                  disabled={resendStatus === 'loading'}
                >
                  {resendStatus === 'loading' ? <><Loader size={12} className="spin" /> Отправка...</> : 'Переотправить ссылку'}
                </button>
              </div>
            )}
          </div>
        )}

        {resendStatus === 'success' && (
          <div className="success-badge" style={{ marginBottom: '20px', padding: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-secondary)', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
            <CheckCircle size={14} style={{ marginRight: '8px' }} />
            Ссылка для подтверждения отправлена на почту!
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
          <button className="social-btn-auth">
            <span style={{ color: '#4285F4', fontSize: '18px', fontWeight: 'bold' }}>G</span> Google
          </button>
          <button className="social-btn-auth">
            <span style={{ color: '#0077FF', fontSize: '18px', fontWeight: 'bold' }}>VK</span> ВКонтакте
          </button>
        </div>

        <p className="auth-footer">
          Нет аккаунта? <Link to="/register" className="auth-link">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
