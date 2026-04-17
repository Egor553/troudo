import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Eye, ShoppingCart, Wallet, Pencil, Trash2, PauseCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const initialServices = [
  {
    id: 1,
    title: 'Разработка Telegram-бота под ключ',
    views: 1420,
    sales: 24,
    earnings: '96 000 ₽',
    active: true,
  },
  {
    id: 2,
    title: 'Адаптивный лендинг для бизнеса',
    views: 980,
    sales: 17,
    earnings: '71 500 ₽',
    active: false,
  },
  {
    id: 3,
    title: 'SEO-аудит и план продвижения',
    views: 760,
    sales: 11,
    earnings: '44 000 ₽',
    active: true,
  },
];

const MyServices = () => {
  const { user } = useAppContext();
  const [acceptOrders, setAcceptOrders] = useState(true);
  const [services, setServices] = useState(initialServices);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyServices = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`/services?sellerId=${user.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const mapped = data.map((item) => ({
          id: item.id,
          title: item.title,
          views: item.views ?? 0,
          sales: item.sales ?? 0,
          earnings: `${(Number(item.sales || 0) * Number(item.priceBasic || 0)).toLocaleString('ru-RU')} ₽`,
          active: item.isActive,
        }));
        if (mapped.length > 0) setServices(mapped);
      } catch (error) {
        // keep demo data fallback
      } finally {
        setLoading(false);
      }
    };
    fetchMyServices();
  }, [user?.id]);

  const handlePause = (id) => {
    const token = localStorage.getItem('token');
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    );
    const current = services.find((s) => s.id === id);
    if (!current || !token) return;
    fetch(`/services/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive: !current.active }),
    }).catch(() => {});
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/services/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // keep optimistic UI
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 md:px-6">
        <div className="mb-6 flex flex-col gap-4 rounded-positivus border-2 border-secondary bg-white p-6 shadow-positivus md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Мои услуги</h1>
            <p className="mt-1 text-sm text-secondary/60">Управляйте карточками услуг и статистикой продаж.</p>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-secondary/20 bg-light px-4 py-3">
            <span className="text-sm font-semibold text-secondary">Принимать заказы</span>
            <button
              type="button"
              onClick={() => setAcceptOrders((prev) => !prev)}
              className={`relative h-7 w-12 rounded-full transition ${acceptOrders ? 'bg-primary' : 'bg-secondary/20'}`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  acceptOrders ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </label>
        </div>

        {loading ? (
          <p className="text-sm font-medium text-secondary/60">Загрузка услуг...</p>
        ) : null}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {services.map((service) => (
            <article key={service.id} className="rounded-positivus border-2 border-secondary bg-white p-5 shadow-positivus">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold text-secondary">{service.title}</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${service.active ? 'bg-primary text-secondary' : 'bg-secondary/10 text-secondary/60'}`}>
                  {service.active ? 'Активна' : 'На паузе'}
                </span>
              </div>

              <div className="mb-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-secondary/15 bg-light p-3">
                  <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-secondary/50">
                    <Eye size={13} /> Просмотры
                  </p>
                  <p className="mt-2 text-xl font-bold text-secondary">{service.views}</p>
                </div>
                <div className="rounded-xl border border-secondary/15 bg-light p-3">
                  <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-secondary/50">
                    <ShoppingCart size={13} /> Продажи
                  </p>
                  <p className="mt-2 text-xl font-bold text-secondary">{service.sales}</p>
                </div>
                <div className="rounded-xl border border-secondary/15 bg-light p-3">
                  <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-secondary/50">
                    <Wallet size={13} /> Заработок
                  </p>
                  <p className="mt-2 text-xl font-bold text-green-600">{service.earnings}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-secondary/20 px-3 py-2 text-sm font-semibold text-secondary hover:bg-light">
                  <Pencil size={15} /> Редактировать
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={15} /> Удалить
                </button>
                <button
                  type="button"
                  onClick={() => handlePause(service.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-secondary/20 px-3 py-2 text-sm font-semibold text-secondary hover:bg-light"
                >
                  <PauseCircle size={15} /> Пауза
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6">
          <Link to="/dashboard" className="text-sm font-bold text-secondary/60 hover:text-secondary">
            Вернуться в кабинет
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MyServices;
