import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, RefreshCw, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resent, setResent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

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
        setErrorMsg(err.message === 'INVALID_OR_EXPIRED_TOKEN' ? 'Ссылка недействительна или срок её действия истёк' : err.message);
      }
    };

    // Небольшая задержка для UX
    const timer = setTimeout(verify, 1500);
    return () => clearTimeout(timer);
  }, [token, verifyEmail]);

  const handleResend = async () => {
    if (!resendEmail) return;
    setResendLoading(true);
    try {
      await resendVerification(resendEmail);
      setResent(true);
      setErrorMsg('');
    } catch (err) {
      alert('Ошибка при отправке: ' + err.message);
    } finally {
      setResendLoading(false);
    }
  };

  // ── Загрузка ──────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="auth-page fade-in">
        <div className="auth-card glass verify-card">
          <Loader size={56} className="spin" color="var(--accent-primary)" />
          <h2>Подтверждаем Email…</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Пожалуйста, подождите, мы проверяем ваш аккаунт</p>
        </div>
      </div>
    );
  }

  // ── Успех ─────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="auth-page fade-in">
        <div className="auth-card glass verify-card animate-scale">
          <div className="verify-success-icon">
            <CheckCircle size={80} color="var(--accent-secondary)" />
          </div>
          <h2>Email подтверждён! 🎉</h2>
          <p>Ваша почта подтверждена. Теперь вы можете войти в свой аккаунт и использовать все возможности Troudo.</p>

          <div className="verify-benefits glass">
            <div className="verify-benefit">🚀 Полный доступ к услугам</div>
            <div className="verify-benefit">📩 Возможность общаться в чате</div>
            <div className="verify-benefit">💳 Проведение безопасных сделок</div>
          </div>

          <Link to="/login" className="btn-primary w-full" style={{ justifyContent: 'center', padding: '16px', fontSize: '16px', marginTop: '10px' }}>
            Войти в аккаунт →
          </Link>
        </div>
      </div>
    );
  }

  // ── Ошибка ────────────────────────────────────────────────
  return (
    <div className="auth-page fade-in">
      <div className="auth-card glass verify-card">
        <XCircle size={64} color="var(--error)" />
        <h2>Проблема с подтверждением</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{errorMsg}</p>

        {!resent ? (
          <div className="resend-form animate-slide-up">
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Ваша ссылка может быть просрочена. Введите email, чтобы получить новую:
            </p>
            <div className="input-group" style={{ marginBottom: '16px' }}>
                <div className="input-with-icon">
                    <Mail size={16} />
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={resendEmail}
                        onChange={e => setResendEmail(e.target.value)}
                    />
                </div>
            </div>
            <button 
              className="btn-primary w-full" 
              onClick={handleResend} 
              disabled={!resendEmail || resendLoading}
            >
              {resendLoading ? <Loader size={16} className="spin" /> : <RefreshCw size={16} />} 
              {resendLoading ? 'Отправка...' : 'Отправить новое письмо'}
            </button>
          </div>
        ) : (
          <div className="success-badge" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-secondary)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <CheckCircle size={20} /> 
                <strong>Письмо отправлено!</strong>
            </div>
            <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>Проверьте папку «Спам» на почте {resendEmail}</p>
          </div>
        )}

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/register" className="btn-secondary w-full" style={{ justifyContent: 'center' }}>
                Зарегистрироваться заново
            </Link>
            <Link to="/" className="nav-link" style={{ textAlign: 'center' }}>
                На главную
            </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
