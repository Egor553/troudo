import React from 'react';
import { Star, ArrowUpRight } from 'lucide-react';

const ServiceCard = ({ title, category, price, author, rating, variant = 'light' }) => {
    const styles = {
        light: 'bg-light text-secondary',
        lime: 'bg-primary text-secondary',
        dark: 'bg-secondary text-white',
    };

    return (
        <div className={`card-positivus flex flex-col justify-between h-[300px] ${styles[variant]}`}>
            <div>
                <div className={`inline-block px-2 py-1 rounded text-sm mb-4 ${variant === 'dark' ? 'bg-white text-secondary' : 'bg-primary text-secondary'}`}>
                    {category}
                </div>
                <h3 className="text-2xl font-bold leading-tight mb-2">{title}</h3>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-secondary/10">
                <div>
                    <p className="text-sm opacity-70">от {price} ₽</p>
                    <div className="flex items-center gap-1 mt-1">
                        <Star size={14} className="fill-current" />
                        <span className="text-sm font-bold">{rating}</span>
                        <span className="text-xs opacity-60 ml-1">{author}</span>
                    </div>
                </div>
                <button className={`w-12 h-12 rounded-full flex items-center justify-center border border-current hover:bg-white hover:text-secondary transition-all`}>
                    <ArrowUpRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
