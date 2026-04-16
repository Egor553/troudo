import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Send, Image, MoreHorizontal, CheckCheck, 
  Search, Star, Paperclip, Smile, Phone, 
  Video, User, Trash2, Ban 
} from 'lucide-react';

const Chat = () => {
    const [activeChat, setActiveChat] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');

    const initialChats = [
        { id: 1, name: 'Anna Design', lastMsg: 'Правки по логотипу готовы!', time: '10:45', unread: 2, online: true, starred: true, avatar: '🎨' },
        { id: 2, name: 'CodeMaster', lastMsg: 'Завтра скину билд бота', time: 'Вчера', online: false, starred: false, avatar: '👨‍💻' },
        { id: 3, name: 'VfxKing', lastMsg: 'Окей, жду Reels', time: '12 апр', online: true, starred: true, avatar: '🎬' },
        { id: 4, name: 'MarketExpert', lastMsg: 'Стратегия продвижения в PDF', time: 'Пн', online: false, starred: false, avatar: '📈' },
        { id: 5, name: 'Copywriter Pro', lastMsg: 'Тексты для лендинга одобрены?', time: '3 апр', online: false, starred: false, avatar: '✍️' },
    ];

    const [chats, setChats] = useState(initialChats);

    const filteredChats = useMemo(() => {
        return chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [chats, searchQuery]);

    const toggleStar = (id, e) => {
        e.stopPropagation();
        setChats(prev => prev.map(c => c.id === id ? { ...c, starred: !c.starred } : c));
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-140px)] flex bg-white border-2 border-secondary rounded-positivus shadow-positivus overflow-hidden font-space mt-4">
                
                {/* 1. Sidebar: Chat List */}
                <div className="w-full md:w-80 lg:w-96 border-r-2 border-secondary/10 flex flex-col bg-white overflow-hidden">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-secondary/10 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold">Чаты</h3>
                            <div className="flex items-center gap-1 bg-light px-2 py-1 rounded-lg">
                               <Star size={14} className="fill-primary text-primary" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">{chats.filter(c => c.starred).length}</span>
                            </div>
                        </div>
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="Поиск диалогов..."
                                className="w-full bg-light border-2 border-transparent focus:border-secondary transition-all rounded-xl py-2 pl-10 pr-4 outline-none text-sm font-medium"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={16} />
                        </div>
                    </div>

                    {/* Contact List */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {filteredChats.map((chat, i) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(i)}
                                className={`p-4 lg:p-6 border-b border-light flex gap-4 cursor-pointer transition-all relative group ${
                                    activeChat === i ? 'bg-primary/10' : 'hover:bg-light/40'
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white border-2 border-secondary rounded-full flex items-center justify-center text-xl shadow-sm overflow-hidden">
                                        {chat.avatar}
                                    </div>
                                    {chat.online && (
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary border-4 border-white rounded-full"></div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold truncate text-sm lg:text-base">{chat.name}</h4>
                                        <span className="text-[10px] font-bold opacity-30">{chat.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs opacity-50 truncate flex-1">{chat.lastMsg}</p>
                                        {chat.starred && (
                                            <Star size={12} className="fill-primary text-primary flex-shrink-0" />
                                        )}
                                    </div>
                                </div>

                                {chat.unread > 0 && activeChat !== i && (
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-secondary text-primary rounded-full flex items-center justify-center text-[10px] font-bold shadow-positivus">
                                        {chat.unread}
                                    </div>
                                )}

                                {/* Context Action Hover */}
                                <button 
                                  onClick={(e) => toggleStar(chat.id, e)}
                                  className="absolute left-1 top-1 opacity-0 group-hover:opacity-100 p-1 bg-white rounded-full shadow-md border border-secondary/10 transition-all scale-75"
                                >
                                   <Star size={14} className={chat.starred ? 'fill-primary text-primary' : 'text-secondary/20'} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Chat Area */}
                <div className="flex-1 flex flex-col bg-light/20 relative">
                    
                    {/* Chat Header */}
                    <div className="p-4 lg:p-6 bg-white border-b border-secondary/10 flex items-center justify-between z-10 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-full border-2 border-secondary flex items-center justify-center text-xl overflow-hidden">
                                {chats[activeChat]?.avatar}
                            </div>
                            <div>
                                <h4 className="font-bold lg:text-lg leading-none mb-1">{chats[activeChat]?.name}</h4>
                                <div className="flex items-center gap-2">
                                   <div className={`w-1.5 h-1.5 rounded-full ${chats[activeChat]?.online ? 'bg-primary' : 'bg-gray-300'}`}></div>
                                   <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                       {chats[activeChat]?.online ? 'Онлайн' : 'Офлайн'}
                                   </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 lg:gap-4">
                            <button className="p-2 text-secondary/40 hover:text-secondary hover:bg-light rounded-lg transition-all">
                               <Phone size={20} />
                            </button>
                            <button className="p-2 text-secondary/40 hover:text-secondary hover:bg-light rounded-lg transition-all">
                               <Video size={20} />
                            </button>
                            <div className="w-[1px] h-6 bg-secondary/10 mx-1"></div>
                            <button className="p-2 text-secondary/40 hover:text-secondary hover:bg-light rounded-lg transition-all">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col gap-8 no-scrollbar">
                        {/* Day separator */}
                        <div className="flex items-center justify-center">
                           <span className="bg-white border border-secondary/5 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-40">Сегодня</span>
                        </div>

                        {/* Incoming */}
                        <div className="flex flex-col items-start max-w-[85%] lg:max-w-[70%]">
                            <div className="bg-white p-5 rounded-3xl rounded-bl-none border-2 border-secondary shadow-positivus relative">
                                <p className="text-sm font-medium leading-relaxed">Здравствуйте! Я подготовил первый вариант логотипа для "Troudo". Можете посмотреть превью? Надеюсь, вам понравится!</p>
                                <span className="text-[10px] font-bold opacity-30 mt-3 block">10:40</span>
                            </div>
                        </div>

                        {/* Outgoing */}
                        <div className="flex flex-col items-end self-end max-w-[85%] lg:max-w-[70%]">
                            <div className="bg-secondary p-5 rounded-3xl rounded-br-none border-2 border-secondary shadow-positivus text-white relative">
                                <p className="text-sm font-medium leading-relaxed">Привет, Натали! Да, конечно. Прикрепляй файл сюда. Нам нужно сегодня утвердить хотя бы основную геометрию.</p>
                                <div className="flex justify-end items-center gap-2 mt-3">
                                    <span className="text-[10px] font-bold opacity-40">10:42</span>
                                    <CheckCheck size={14} className="text-primary" />
                                </div>
                            </div>
                        </div>

                        {/* Incoming with Image */}
                        <div className="flex flex-col items-start max-w-[85%] lg:max-w-[70%]">
                            <div className="bg-white p-2 rounded-3xl rounded-bl-none border-2 border-secondary shadow-positivus overflow-hidden">
                                <div className="w-full aspect-[16/10] bg-light rounded-2xl mb-3 flex items-center justify-center border border-secondary/5 overflow-hidden group relative">
                                   <div className="text-6xl group-hover:scale-110 transition-transform duration-500">🎨</div>
                                   <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all"></div>
                                </div>
                                <div className="px-3 pb-3">
                                   <p className="text-sm font-medium leading-relaxed">Вот превью. Жду ваши фидбеки! Сделала три пересекающихся треугольника для динамики.</p>
                                   <span className="text-[10px] font-bold opacity-30 mt-3 block">10:45</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 lg:p-8 bg-white border-t border-secondary/10">
                        <div className="flex items-center gap-3 lg:gap-4 bg-light p-3 rounded-2xl border-2 border-transparent focus-within:border-secondary focus-within:bg-white focus-within:shadow-positivus transition-all group">
                            <div className="flex items-center gap-2">
                               <button className="p-2 text-secondary/30 hover:text-primary transition-all">
                                   <Smile size={24} />
                               </button>
                               <button className="p-2 text-secondary/30 hover:text-primary transition-all">
                                   <Paperclip size={24} />
                               </button>
                            </div>
                            
                            <input
                                type="text"
                                placeholder="Напишите сообщение..."
                                className="flex-1 bg-transparent border-none outline-none text-sm font-medium py-1"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                            
                            <button className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                message.trim() ? 'bg-primary text-secondary shadow-positivus hover:translate-y-1 hover:shadow-none' : 'bg-secondary/10 text-secondary/20 cursor-not-allowed'
                            }`}>
                                <Send size={20} className={message.trim() ? 'fill-current' : ''} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Optional Info Sidebar (Hidden by default, can be toggled) */}
                <div className="hidden xl:flex w-72 bg-white border-l-2 border-secondary/10 flex-col items-center p-8 text-center animate-in slide-in-from-right duration-500">
                    <div className="w-24 h-24 bg-primary rounded-full border-2 border-secondary flex items-center justify-center text-4xl mb-6 shadow-positivus">
                        {chats[activeChat]?.avatar}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{chats[activeChat]?.name}</h3>
                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest mb-8">Исполнитель (Топ-10)</p>
                    
                    <div className="w-full flex flex-col gap-4">
                       <button className="w-full btn-outline py-3 text-xs flex items-center justify-center gap-2">
                          <User size={14} /> Профиль
                       </button>
                       <button className="w-full bg-light text-secondary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 transition-all">
                          <Ban size={14} /> Заблокировать
                       </button>
                    </div>

                    <div className="mt-auto pt-8 border-t border-secondary/5 w-full">
                       <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-4">Общие файлы (0)</p>
                       <div className="grid grid-cols-2 gap-2">
                          <div className="aspect-square bg-light rounded-lg border-2 border-dashed border-secondary/10 flex items-center justify-center">
                             <Plus size={16} className="opacity-20" />
                          </div>
                       </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Chat;
