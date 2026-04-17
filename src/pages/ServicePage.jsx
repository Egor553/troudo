import React, { useState } from 'react';
import Header from '../components/Header';
import { Check, Clock, Info, Star } from 'lucide-react';

const ServicePage = () => {
  const [activePackage, setActivePackage] = useState('standard');

  const packages = {
    economy: {
      label: 'Эконом',
      price: '4 900 ₽',
      delivery: '3 дня',
      revisions: '1 правка',
      description: 'Базовый набор для быстрого старта проекта.',
    },
    standard: {
      label: 'Стандарт',
      price: '9 900 ₽',
      delivery: '5 дней',
      revisions: '3 правки',
      description: 'Оптимальный пакет с расширенной проработкой и поддержкой.',
    },
    business: {
      label: 'Бизнес',
      price: '17 900 ₽',
      delivery: '7 дней',
      revisions: 'Без ограничений',
      description: 'Максимальный пакет с приоритетным сопровождением.',
    },
  };

  const comparisonRows = [
    { label: 'Количество экранов/блоков', economy: '1-2', standard: '3-5', business: '5+' },
    { label: 'Правки', economy: '1', standard: '3', business: 'Без ограничений' },
    { label: 'Срок выполнения', economy: '3 дня', standard: '5 дней', business: '7 дней' },
    { label: 'Приоритет в очереди', economy: 'Нет', standard: 'Средний', business: 'Высокий' },
    { label: 'Поддержка после сдачи', economy: '1 день', standard: '3 дня', business: '7 дней' },
  ];

  return (
    <div className="min-h-screen bg-light">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-12 pt-24 md:px-6 lg:flex-row">
        <section className="flex-1 space-y-8">
          <div className="rounded-positivus border-2 border-secondary bg-white p-6 shadow-positivus md:p-8">
            <h1 className="text-3xl font-bold leading-tight text-secondary md:text-4xl">
              Разработка адаптивного лендинга под ключ
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-secondary/70">
              <Star size={14} className="fill-primary text-primary" />
              <span>4.9</span>
              <span>(87 отзывов)</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-positivus border-2 border-secondary bg-white shadow-positivus">
            <div className="aspect-video w-full bg-light">
              <img
                src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80"
                alt="Превью услуги"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="rounded-positivus border-2 border-secondary bg-white p-6 shadow-positivus md:p-8">
            <h2 className="text-2xl font-bold text-secondary">Описание</h2>
            <p className="mt-4 leading-relaxed text-secondary/80">
              Создам современный лендинг с продуманной структурой, адаптацией под мобильные
              устройства и базовой SEO-оптимизацией. Подходит для запуска рекламы, презентации
              продукта и увеличения конверсии.
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {['Анализ ниши', 'Дизайн и верстка', 'Адаптив под мобильные', 'Подключение форм'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-medium text-secondary">
                    <Check size={16} className="text-primary" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="rounded-positivus border-2 border-secondary bg-white p-6 shadow-positivus md:p-8">
            <h2 className="text-2xl font-bold text-secondary">Сравнение пакетов</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-secondary/15 text-left">
                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-secondary/50">
                      Параметр
                    </th>
                    <th className="pb-3 text-center text-sm font-bold text-secondary">Эконом</th>
                    <th className="pb-3 text-center text-sm font-bold text-secondary">Стандарт</th>
                    <th className="pb-3 text-center text-sm font-bold text-secondary">Бизнес</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-b border-secondary/10">
                      <td className="py-3 pr-4 text-sm font-medium text-secondary/80">{row.label}</td>
                      <td className="py-3 text-center text-sm text-secondary">{row.economy}</td>
                      <td className="py-3 text-center text-sm text-secondary">{row.standard}</td>
                      <td className="py-3 text-center text-sm text-secondary">{row.business}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-positivus border-2 border-primary bg-primary/10 p-6 shadow-positivus md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <Info size={18} className="text-secondary" />
              <h2 className="text-2xl font-bold text-secondary">Что нужно для заказа</h2>
            </div>
            <ul className="space-y-2 text-sm font-medium text-secondary/80">
              <li>1. Краткое описание проекта и цели страницы.</li>
              <li>2. Примеры сайтов/дизайнов, которые вам нравятся.</li>
              <li>3. Тексты, логотип и фирменные материалы (если есть).</li>
              <li>4. Контакты для заявок и пожелания по срокам.</li>
            </ul>
          </div>
        </div>

        <aside className="w-full lg:w-[360px]">
          <div className="sticky top-24 rounded-positivus border-2 border-secondary bg-white shadow-positivus">
            <div className="grid grid-cols-3 border-b border-secondary/15">
              {Object.entries(packages).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePackage(key)}
                  className={`px-2 py-3 text-center text-xs font-bold uppercase tracking-wider transition ${
                    activePackage === key
                      ? 'bg-primary text-secondary'
                      : 'text-secondary/50 hover:bg-light hover:text-secondary'
                  }`}
                >
                  {value.label}
                </button>
              ))}
            </div>

            <div className="space-y-5 p-6">
              <p className="text-3xl font-bold text-secondary">{packages[activePackage].price}</p>
              <p className="text-sm leading-relaxed text-secondary/70">
                {packages[activePackage].description}
              </p>

              <div className="space-y-2 rounded-xl border border-secondary/15 bg-light p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-secondary/60">
                    <Clock size={14} />
                    Срок
                  </span>
                  <span className="font-semibold text-secondary">{packages[activePackage].delivery}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary/60">Правки</span>
                  <span className="font-semibold text-secondary">{packages[activePackage].revisions}</span>
                </div>
              </div>

              <button type="button" className="btn-primary w-full">
                Заказать
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ServicePage;
