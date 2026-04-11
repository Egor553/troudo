import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, RefreshCw, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Токен не указан или ссылка неверная');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message);
      }
    };

    // Небольшая задержка для UX
    setTimeout(verify, 1200);
  }, [token, verifyEmail]);

  const handleResend = () => {
    // В реале: POST /api/auth/resend-verify
    setResent(true);
  };

  // ── Загрузка ──────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="auth-page">
        <div className="auth-card glass verify-card">
          <Loader size={56} className="spin" color="var(--accent-primary)" />
          <h2>Подтверждаем Email…</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Пожалуйста, подождите секунду</p>
        </div>
      </div>
    );
  }

  // ── Успех ─────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="auth-page">
        <div className="auth-card glass verify-card">
          <div className="verify-success-icon">
            <CheckCircle size={80} color="var(--accent-secondary)" />
          </div>
          <h2>Email подтверждён! 🎉</h2>
          <p>Ваш аккаунт активирован. Теперь вы можете войти и начать пользоваться Troudo.</p>

          <div className="verify-benefits glass">
            <div className="verify-benefit">✅ Размещайте заказы</div>
            <div className="verify-benefit">✅ Нанимайте фрилансеров</div>
            <div className="verify-benefit">✅ Безопасная оплата</div>
          </div>

          <Link to="/login" className="btn-primary w-full" style={{ justifyContent: 'center', padding: '16px', fontSize: '16px' }}>
            Войти в аккаунт →
          </Link>
        </div>
      </div>
    );
  }

  // ── Ошибка ────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-card glass verify-card">
        <XCircle size={64} color="var(--error)" />
        <h2>Ссылка недействительна</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{errorMsg}</p>

        {!resent ? (
          <div className="resend-form">
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Введите ваш email — отправим новое письмо
            </p>
            <div className="input-with-icon" style={{ marginBottom: '12px' }}>
              <Mail size={16} />
              <input
                type="email"
                placeholder="your@email.com"
                value={resendEmail}
                onChange={e => setResendEmail(e.target.value)}
              />
            </div>
            <button className="btn-primary w-full" onClick={handleResend} disabled={!resendEmail}>
              <RefreshCw size={16} /> Отправить новое письмо
            </button>
          </div>
        ) : (
          <div className="auth-error" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: 'var(--accent-secondary)' }}>
            <CheckCircle size={16} /> Письмо отправлено на {resendEmail}
          </div>
        )}

        <Link to="/register" className="btn-secondary w-full" style={{ justifyContent: 'center' }}>
          Зарегистрироваться заново
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
