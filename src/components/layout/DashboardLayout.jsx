import React from 'react';
import { LayoutDashboard, MessageSquare, Briefcase, Settings, LogOut, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Обзор', path: '/dashboard' },
        { icon: <MessageSquare size={20} />, label: 'Сообщения', path: '/chat' },
        { icon: <Briefcase size={20} />, label: 'Мои заказы', path: '/my-orders' },
        { icon: <Settings size={20} />, label: 'Настройки', path: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-light flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-secondary/10 p-8 flex flex-col">
                <Link to="/" className="flex items-center gap-2 mb-12">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-primary rounded-sm transform rotate-45"></div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-secondary">Troudo</span>
                </Link>

                <nav className="flex-1 flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${location.pathname === item.path
                                    ? 'bg-primary text-secondary shadow-positivus border border-secondary'
                                    : 'text-secondary opacity-60 hover:opacity-100 hover:bg-light'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all mt-auto">
                    <LogOut size={20} />
                    Выйти
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-20 bg-white border-b border-secondary/10 px-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold">Личный кабинет</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative text-secondary opacity-60 hover:opacity-100">
                            <Bell size={22} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-secondary/10">
                            <div className="text-right">
                                <p className="text-sm font-bold">Александр М.</p>
                                <p className="text-xs opacity-50">Заказчик</p>
                            </div>
                            <div className="w-10 h-10 bg-primary rounded-full border border-secondary text-secondary flex items-center justify-center font-bold">
                                А
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
