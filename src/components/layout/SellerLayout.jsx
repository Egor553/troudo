import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const defaultKpiItems = [
  { title: 'Ответственность', value: '94%', progress: 94 },
  { title: 'Заказы вовремя', value: '89%', progress: 89 },
  { title: 'Ответы', value: '97%', progress: 97 },
  { title: 'Скорость', value: '85%', progress: 85 },
];

const menuItems = [
  { label: 'Обзор', path: '/dashboard' },
  { label: 'Мои заказы', path: '/exchange' },
  { label: 'Мои услуги', path: '/my-services' },
  { label: 'Сообщения', path: '/chat' },
  { label: 'Настройки', path: '/settings' },
];

const SellerLayout = () => {
  const { user } = useAppContext();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/services?sellerId=${user.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setServices(data);
      } catch (error) {
        // fallback to demo values
      }
    };
    fetchSellerData();
  }, [user?.id]);

  const stats = useMemo(() => {
    if (services.length === 0) {
      return { orders: 12, services: 7, kpi: defaultKpiItems };
    }
    const salesTotal = services.reduce((sum, item) => sum + Number(item.sales || 0), 0);
    const viewsTotal = services.reduce((sum, item) => sum + Number(item.views || 0), 0);
    const responseRate = viewsTotal > 0 ? Math.min(99, Math.round((salesTotal / viewsTotal) * 100 * 10)) : 0;

    return {
      orders: salesTotal,
      services: services.length,
      kpi: [
        { title: 'Ответственность', value: `${Math.min(100, 85 + services.length)}%`, progress: Math.min(100, 85 + services.length) },
        { title: 'Заказы вовремя', value: `${Math.min(100, 80 + salesTotal)}%`, progress: Math.min(100, 80 + salesTotal) },
        { title: 'Ответы', value: `${Math.max(60, responseRate)}%`, progress: Math.max(60, responseRate) },
        { title: 'Скорость', value: `${Math.min(100, 78 + services.length * 2)}%`, progress: Math.min(100, 78 + services.length * 2) },
      ],
    };
  }, [services]);

  const sellerName = user?.username || user?.name || 'Seller Name';
  const avatarLetter = (sellerName || 'S').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-light p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row">
        <aside className="w-full rounded-positivus border-2 border-secondary bg-white p-6 shadow-positivus md:w-[260px] md:shrink-0">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-secondary bg-primary text-2xl font-bold text-secondary">
              {avatarLetter}
            </div>
            <h2 className="text-xl font-bold text-secondary">{sellerName}</h2>
            <p className="mt-1 inline-flex rounded-full border border-secondary/20 bg-light px-3 py-1 text-sm font-medium text-secondary">
              Продавец
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="rounded-lg border border-transparent px-3 py-2 text-left text-sm font-medium text-secondary transition hover:border-secondary/20 hover:bg-light"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 rounded-positivus border-2 border-secondary bg-white p-6 shadow-positivus md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-secondary md:text-3xl">Dashboard продавца</h1>
            <p className="mt-2 text-sm text-secondary/70">Контроль показателей и активности аккаунта.</p>
          </div>

          <section className="mb-8">
            <h3 className="mb-4 text-lg font-bold text-secondary">KPI</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {stats.kpi.map((item) => (
                <article key={item.title} className="rounded-xl border border-secondary/20 bg-light p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-secondary">{item.title}</span>
                    <span className="text-sm font-bold text-secondary">{item.value}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-secondary/20 bg-light p-5">
              <p className="text-sm font-medium text-secondary/70">Мои заказы</p>
              <p className="mt-2 text-3xl font-bold text-secondary">{stats.orders}</p>
            </article>

            <article className="rounded-xl border border-secondary/20 bg-light p-5">
              <p className="text-sm font-medium text-secondary/70">Мои услуги</p>
              <p className="mt-2 text-3xl font-bold text-secondary">{stats.services}</p>
            </article>

            <article className="rounded-xl border border-secondary/20 bg-light p-5">
              <p className="mb-4 text-sm font-medium text-secondary/70">Биржа</p>
              <Link to="/exchange" className="btn-primary w-full">
                Перейти на биржу
              </Link>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
