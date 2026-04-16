import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';

const Login = () => {
  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState('none'); 

  const update = (field) => (e) =>
    setForm(f => ({ ...f, [field]: field === 'remember' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setResendStatus('none');
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
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
      setError('Ошибка: ' + err.message);
      setResendStatus('none');
    }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col justify-center items-center p-4 md:p-6 font-space">
      <div className="w-full max-w-xl transition-all animate-in fade-in duration-500">
        
        {/* Logo */}
        <div className="flex justify-center mb-10">
           <Link to="/">
              <Logo className="h-10" />
           </Link>
        </div>

        <div className="bg-white border-2 border-secondary rounded-positivus p-8 md:p-12 shadow-positivus">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">С возвращением!</h1>
          <p className="opacity-50 font-medium mb-10">Продолжите работу с вашими проектами.</p>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-xl mb-8 flex flex-col gap-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
              {error.includes('подтвержден') && resendStatus !== 'success' && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendStatus === 'loading'}
                  className="text-xs font-bold uppercase underline hover:text-red-800 transition-all text-left"
                >
                  {resendStatus === 'loading' ? 'Отправка...' : 'Отправить письмо еще раз'}
                </button>
              )}
            </div>
          )}

          {resendStatus === 'success' && (
            <div className="bg-primary/20 border-2 border-primary text-secondary p-4 rounded-xl mb-8 flex items-center gap-2 font-bold text-sm">
              <CheckCircle size={18} />
              <span>Ссылка отправлена! Проверьте почту.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-left">
              <label className="text-xs font-bold uppercase opacity-40">Email адрес</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-light border-2 border-transparent focus:border-secondary transition-all rounded-xl py-4 pl-12 pr-4 outline-none font-medium"
                  value={form.email}
                  onChange={update('email')}
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase opacity-40">Пароль</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:underline">Забыли пароль?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-light border-2 border-transparent focus:border-secondary transition-all rounded-xl py-4 pl-12 pr-12 outline-none font-medium"
                  value={form.password}
                  onChange={update('password')}
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group mt-2">
               <input 
                 type="checkbox" 
                 checked={form.remember}
                 onChange={update('remember')}
                 className="hidden peer"
               />
               <div className="w-6 h-6 border-2 border-secondary rounded flex items-center justify-center transition-all peer-checked:bg-primary group-hover:bg-light">
                  {form.remember && <CheckCircle size={14} className="text-secondary" />}
               </div>
               <span className="text-sm font-bold opacity-60 group-hover:opacity-100 transition-all">Запомнить меня</span>
            </label>

            <button
              type="submit"
              className="btn-primary w-full py-5 text-xl flex items-center justify-center mt-4"
              disabled={loading}
            >
              {loading ? <Loader className="spin" size={24} /> : <>Войти <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="relative my-10 flex items-center">
             <div className="flex-1 border-t border-secondary/5"></div>
             <span className="px-4 text-[10px] font-bold uppercase opacity-20 tracking-widest bg-white">или</span>
             <div className="flex-1 border-t border-secondary/5"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-3 py-4 border-2 border-secondary/5 rounded-xl font-bold text-sm hover:border-secondary hover:bg-light transition-all">
                <span className="text-blue-500 text-lg">G</span> Google
             </button>
             <button className="flex items-center justify-center gap-3 py-4 border-2 border-secondary/5 rounded-xl font-bold text-sm hover:border-secondary hover:bg-light transition-all">
                <span className="text-blue-600 text-lg">VK</span> ВКонтакте
             </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-bold opacity-40 uppercase tracking-widest">
           Нет аккаунта? <Link to="/register" className="text-primary hover:underline ml-2">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
