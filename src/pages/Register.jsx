import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', password2: '' });
  const [checks, setChecks] = useState({ terms: false, privacy: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); 

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const toggle = (field) => () => setChecks(c => ({ ...c, [field]: !c[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (form.password !== form.password2) { setError('Пароли не совпадают'); return; }
    if (form.password.length < 6) { setError('Пароль должен быть минимум 6 символов'); return; }
    if (!checks.terms || !checks.privacy) { setError('Необходимо принять условия и политику'); return; }

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

  if (success) {
    return (
      <div className="min-h-screen bg-light flex flex-col justify-center items-center p-6 font-space">
        <div className="w-full max-w-xl bg-white border-2 border-secondary rounded-positivus p-12 shadow-positivus text-center animate-in zoom-in duration-500">
           <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 text-6xl shadow-positivus border-2 border-secondary">
              ✉️
           </div>
           <h2 className="text-4xl font-bold mb-4">Проверьте почту</h2>
           <p className="opacity-60 font-medium mb-10 leading-relaxed">
             Мы отправили ссылку для подтверждения на <br />
             <strong className="text-secondary">{success.email}</strong>
           </p>

           <div className="bg-light p-6 rounded-xl flex flex-col gap-4 text-left border border-secondary/5 mb-10">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold border border-secondary">1</div>
                 <p className="font-bold text-sm">Найдите письмо от Troudo</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold border border-secondary">2</div>
                 <p className="font-bold text-sm">Нажмите на кнопку подтверждения</p>
              </div>
           </div>

           <button onClick={() => setSuccess(null)} className="btn-outline w-full py-4 text-lg">
              Использовать другой Email
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light flex flex-col justify-center items-center p-4 md:p-6 font-space">
      <div className="w-full max-w-2xl animate-in fade-in duration-500 pt-10 pb-20">
        
        {/* Logo */}
        <div className="flex justify-center mb-10">
           <Link to="/">
              <Logo className="h-10" />
           </Link>
        </div>

        <div className="bg-white border-2 border-secondary rounded-positivus p-8 md:p-12 shadow-positivus relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
             <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">Регистрация</h1>
                <p className="opacity-50 font-medium lowercase">Присоединяйтесь к сообществу профессионалов.</p>
             </div>
             <div className="bg-primary/20 text-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-primary h-max">
                это бесплатно
             </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-2 font-bold text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase opacity-40">Пароль</label>
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
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase opacity-40">Повторите пароль</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-light border-2 border-transparent focus:border-secondary transition-all rounded-xl py-4 pl-12 pr-12 outline-none font-medium"
                      value={form.password2}
                      onChange={update('password2')}
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
                    <button 
                      type="button" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary focus:outline-none"
                      onClick={() => setShowPwd(!showPwd)}
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-4 bg-light/50 p-6 rounded-2xl border border-secondary/5">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" checked={checks.privacy} onChange={toggle('privacy')} className="hidden peer" />
                  <div className="w-6 h-6 border-2 border-secondary rounded flex-shrink-0 flex items-center justify-center transition-all peer-checked:bg-primary group-hover:bg-light">
                      {checks.privacy && <CheckCircle size={14} className="text-secondary" />}
                  </div>
                  <span className="text-sm font-medium opacity-60 group-hover:opacity-100 transition-all leading-tight">
                    Я согласен на <Link to="/policy" className="underline hover:text-primary">обработку персональных данных</Link>
                  </span>
                </label>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" checked={checks.terms} onChange={toggle('terms')} className="hidden peer" />
                  <div className="w-6 h-6 border-2 border-secondary rounded flex-shrink-0 flex items-center justify-center transition-all peer-checked:bg-primary group-hover:bg-light">
                      {checks.terms && <CheckCircle size={14} className="text-secondary" />}
                  </div>
                  <span className="text-sm font-medium opacity-60 group-hover:opacity-100 transition-all leading-tight">
                    Принимаю <Link to="/rules" className="underline hover:text-primary">пользовательское соглашение</Link>
                  </span>
                </label>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-5 text-xl flex items-center justify-center mt-4"
              disabled={loading}
            >
              {loading ? <Loader className="spin" size={24} /> : <>Создать аккаунт <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="relative my-10 flex items-center">
             <div className="flex-1 border-t border-secondary/5"></div>
             <span className="px-4 text-[10px] font-bold uppercase opacity-20 tracking-widest bg-white">или через соцсети</span>
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
           Есть аккаунт? <Link to="/login" className="text-primary hover:underline ml-2">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
