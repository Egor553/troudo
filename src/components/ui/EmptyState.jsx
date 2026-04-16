import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon = "📦", 
  title = "Тут пока пусто", 
  subtitle = "Начните с создания первого проекта или воспользуйтесь поиском услуг.", 
  actionText = "Найти услуги", 
  actionPath = "/catalog" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-white border-2 border-dashed border-secondary/10 rounded-positivus text-center">
       <div className="text-6xl mb-6 transform hover:scale-110 transition-transform cursor-default filter grayscale opacity-40">
          {icon}
       </div>
       <h3 className="text-2xl font-bold mb-2">{title}</h3>
       <p className="max-w-xs text-sm font-medium opacity-50 mb-8 leading-relaxed">
          {subtitle}
       </p>
       <Link 
         to={actionPath} 
         className="btn-primary flex items-center gap-2 group"
       >
          {actionText.includes("Найти") ? <Search size={18} /> : <Plus size={18} />}
          {actionText}
       </Link>
    </div>
  );
};

export default EmptyState;
