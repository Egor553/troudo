import React, { useEffect, useMemo, useState } from 'react';
import { Search, Palette, Code2, Megaphone, PenSquare } from 'lucide-react';
import ServiceGridCard from '../ui/ServiceGridCard';

const popularCategories = [
  { name: 'Дизайн', icon: Palette },
  { name: 'Разработка', icon: Code2 },
  { name: 'Маркетинг', icon: Megaphone },
  { name: 'Тексты', icon: PenSquare },
];

const popularServices = [
  {
    title: 'Лендинг под ключ на React',
    rating: 4.9,
    price: 'от 7 500 ₽',
    seller: 'Иван П.',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Фирменный стиль и логотип',
    rating: 4.8,
    price: 'от 4 000 ₽',
    seller: 'Мария Д.',
    image:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Настройка рекламы Яндекс/Google',
    rating: 4.7,
    price: 'от 5 900 ₽',
    seller: 'Алексей Р.',
    image:
      'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'SEO-аудит и план роста',
    rating: 4.9,
    price: 'от 3 900 ₽',
    seller: 'Ольга С.',
    image:
      'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1200&q=80',
  },
];

const viewedServices = [
  {
    title: 'Дизайн мобильного приложения',
    rating: 4.8,
    price: 'от 6 300 ₽',
    seller: 'Кирилл Н.',
    image:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Email-рассылки и воронки',
    rating: 4.6,
    price: 'от 2 800 ₽',
    seller: 'Елена К.',
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Интернет-магазин на Shopify',
    rating: 4.9,
    price: 'от 12 000 ₽',
    seller: 'Дмитрий Ф.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'SMM-стратегия на месяц',
    rating: 4.7,
    price: 'от 4 500 ₽',
    seller: 'Анна В.',
    image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
  },
];

const BuyerLayout = () => {
  const [apiServices, setApiServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/services');
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const normalized = data.map((item) => ({
          id: item.id,
          title: item.title,
          rating: Number(item.rating || 4.8).toFixed(1),
          price: `от ${Number(item.priceBasic || 0).toLocaleString('ru-RU')} ₽`,
          seller: item.seller?.username || item.user?.username || 'Исполнитель',
          image:
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
        }));

        setApiServices(normalized);
      } catch (error) {
        // fallback stays on demo data
      }
    };
    fetchServices();
  }, []);

  const renderedPopular = useMemo(
    () => (apiServices.length > 0 ? apiServices.slice(0, 4) : popularServices),
    [apiServices],
  );

  return (
    <div className="min-h-screen bg-light">
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <section className="rounded-positivus border-2 border-secondary bg-white p-6 shadow-positivus md:p-10">
          <h1 className="mx-auto max-w-4xl text-center text-3xl font-bold leading-tight text-secondary md:text-5xl">
            Найдите услуги для роста вашего проекта
          </h1>

          <div className="mx-auto mt-6 flex w-full max-w-2xl items-center gap-3 rounded-xl border-2 border-secondary bg-light px-4 py-3">
            <Search size={20} className="text-secondary/50" />
            <input
              type="text"
              placeholder="Поиск услуг, исполнителей, категорий..."
              className="w-full bg-transparent text-sm font-medium outline-none md:text-base"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {popularCategories.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-light px-4 py-2 text-sm font-semibold text-secondary transition hover:border-secondary hover:bg-primary"
              >
                <Icon size={16} />
                {name}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-secondary">Популярные услуги</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {renderedPopular.map((service) => (
              <ServiceGridCard key={service.title} service={service} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-secondary">Просмотренные</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {viewedServices.map((service) => (
              <ServiceGridCard key={service.title} service={service} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BuyerLayout;
