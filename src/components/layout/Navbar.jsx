import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-light">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-primary rounded-sm transform rotate-45"></div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Troudo</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/catalog" className="text-secondary font-medium hover:text-primary transition-colors">Каталог</Link>
                    <Link to="/exchange" className="text-secondary font-medium hover:text-primary transition-colors">Биржа</Link>
                    <Link to="/chat" className="text-secondary font-medium hover:text-primary transition-colors">Сообщения</Link>
                    <Link to="/dashboard" className="btn-outline px-6 py-2">Войти</Link>
                    <Link to="/register" className="btn-primary px-6 py-2">Начать</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
