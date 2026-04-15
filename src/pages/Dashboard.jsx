import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ShoppingBag, Star, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { label: 'Активные заказы', value: '3', icon: <Clock className="text-primary" />, color: 'bg-secondary' },
        { label: 'Завершено', value: '24', icon: <CheckCircle className="text-primary" />, color: 'bg-secondary' },
        { label: 'Всего потрачено', value: '45,600 ₽', icon: <Star className="text-primary" />, color: 'bg-secondary' },
    ];

    const recentOrders = [
        { id: '#1284', title: 'Дизайн логотипа для студии', status: 'В работе', price: '3,000 ₽', deadline: '24.04.2026' },
        { id: '#1285', title: 'Сборка бота на Python', status: 'Проверка', price: '8,500 ₽', deadline: '22.04.2026' },
        { id: '#1286', title: 'Правки по верстке React', status: 'Завершен', price: '1,500 ₽', deadline: '20.04.2026' },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-6xl">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 tracking-tight">Добро пожаловать, Александр! 🍀</h1>
                        <p className="opacity-50">Вот что происходит с вашими заказами сегодня.</p>
                    </div>
                    <button className="btn-primary">Создать заказ</button>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className={`${stat.color} p-8 rounded-positivus shadow-positivus text-white flex items-center justify-between border border-secondary`}>
                            <div>
                                <p className="text-sm opacity-60 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white border-2 border-secondary rounded-positivus shadow-positivus overflow-hidden">
                    <div className="p-8 border-b border-light flex items-center justify-between">
                        <h3 className="text-xl font-bold">Последние заказы</h3>
                        <button className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline">
                            Смотреть все <ShoppingBag size={16} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-light">
                                    <th className="px-8 py-4 font-bold text-sm">ID</th>
                                    <th className="px-8 py-4 font-bold text-sm">Проект</th>
                                    <th className="px-8 py-4 font-bold text-sm">Статус</th>
                                    <th className="px-8 py-4 font-bold text-sm">Дедлайн</th>
                                    <th className="px-8 py-4 font-bold text-sm">Бюджет</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, i) => (
                                    <tr key={i} className="border-t border-light hover:bg-light/50 transition-colors cursor-pointer">
                                        <td className="px-8 py-6 text-sm opacity-50">{order.id}</td>
                                        <td className="px-8 py-6 font-bold">{order.title}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${order.status === 'Завершен' ? 'bg-primary/20 border-primary text-secondary' :
                                                    order.status === 'В работе' ? 'bg-blue-100 border-blue-500 text-blue-700' :
                                                        'bg-orange-100 border-orange-500 text-orange-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm">{order.deadline}</td>
                                        <td className="px-8 py-6 font-bold">{order.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
