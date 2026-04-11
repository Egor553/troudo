import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', password2: '' });
  const [checks, setChecks] = useState({ terms: false, privacy: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); // { email, token }

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const toggle = (field) => () => setChecks(c => ({ ...c, [field]: !c[field] }));

  // Валидация пароля
  const pwdStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return 'weak';
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return 'medium';
    return 'strong';
  };
  const strength = pwdStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password2) { setError('Пароли не совпадают'); return; }
    if (form.password.length < 6) { setError('Пароль должен быть минимум 6 символов'); return; }
    if (!checks.terms) { setError('Примите пользовательское соглашение'); return; }
    if (!checks.privacy) { setError('Согласитесь на обработку персональных данных'); return; }

    setLoading(true);
    try {
      const result = await register({ email: form.email, password: form.password });
      setSuccess(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Шаг 6: письмо отправлено ────────────────────────────
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card glass email-sent-card">
          <div className="email-sent-icon">✉️</div>
          <h2>Проверьте вашу почту</h2>
          <p>
            Мы отправили письмо на <strong>{success.email}</strong>.<br />
            Перейдите по ссылке в письме, чтобы подтвердить регистрацию.
          </p>
          <div className="email-hint glass">
            <p>⏱ Ссылка действительна 24 часа</p>
            <p>📁 Проверьте папку «Спам», если письма нет</p>
          </div>

          {/* DEV-режим: показываем ссылку прямо на странице */}
          <div className="dev-hint glass">
            <p style={{ fontSize: '12px', color: 'var(--warning)', marginBottom: '8px' }}>
              🛠 DEV: кликните ссылку вместо письма
            </p>
            <Link
              to={`/verify?token=${success.token}`}
              className="btn-primary w-full"
              style={{ justifyContent: 'center' }}
            >
              Перейти к подтверждению →
            </Link>
          </div>

          <button
            className="resend-btn"
            onClick={() => setSuccess(null)}
          >
            Зарегистрироваться с другим email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-logo gradient-text">Troudo</div>
        <h2>Создать аккаунт</h2>
        <p className="auth-subtitle">Присоединяйтесь — это бесплатно</p>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
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

          {/* Password */}
          <div className="form-group">
            <label>Пароль</label>
            <div className="input-with-icon">
              <Lock size={17} />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Минимум 6 символов"
                value={form.password}
                onChange={update('password')}
                required
                style={{ paddingRight: '44px' }}
                autoComplete="new-password"
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {strength && (
              <div className="pwd-strength">
                <div className={`pwd-bar ${strength}`}>
                  <div className="pwd-fill" />
                </div>
                <span className={`pwd-label ${strength}`}>
                  {strength === 'weak' ? 'Слабый' : strength === 'medium' ? 'Средний' : 'Надёжный'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Повторите пароль</label>
            <div className="input-with-icon">
              <Lock size={17} />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password2}
                onChange={update('password2')}
                required
                autoComplete="new-password"
              />
              {form.password2 && (
                <span className="pass-match" style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)'
                }}>
                  {form.password === form.password2
                    ? <CheckCircle size={16} color="var(--accent-secondary)" />
                    : <AlertCircle size={16} color="var(--error)" />}
                </span>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="auth-checkboxes">
            <label className="auth-checkbox-item" onClick={toggle('terms')}>
              <div className={`custom-checkbox ${checks.terms ? 'checked' : ''}`}>
                {checks.terms && <CheckCircle size={12} />}
              </div>
              <span>
                Я принимаю{' '}
                <Link to="/rules" className="auth-link" onClick={e => e.stopPropagation()}>
                  пользовательское соглашение
                </Link>
              </span>
            </label>
            <label className="auth-checkbox-item" onClick={toggle('privacy')}>
              <div className={`custom-checkbox ${checks.privacy ? 'checked' : ''}`}>
                {checks.privacy && <CheckCircle size={12} />}
              </div>
              <span>
                Я согласен на{' '}
                <Link to="/policy" className="auth-link" onClick={e => e.stopPropagation()}>
                  обработку персональных данных
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
            style={{ padding: '15px', fontSize: '16px' }}
          >
            {loading ? <><Loader size={18} className="spin" /> Регистрация…</> : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-divider"><span>или войти через</span></div>
        <div className="social-auth">
          <button className="social-btn-auth">🔵 Google</button>
          <button className="social-btn-auth">💙 ВКонтакте</button>
        </div>

        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
