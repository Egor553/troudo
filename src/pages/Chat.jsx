import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Send, Image, MoreHorizontal, CheckCheck } from 'lucide-react';

const Chat = () => {
    const [activeChat, setActiveChat] = useState(0);

    const chats = [
        { name: 'Anna Design', lastMsg: 'Правки по логотипу готовы!', time: '10:45', unread: 2, online: true },
        { name: 'CodeMaster', lastMsg: 'Завтра скину билд бота', time: 'Вчера', online: false },
        { name: 'VfxKing', lastMsg: 'Окей, жду Reels', time: '12 апр', online: true },
    ];

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-200px)] flex bg-white border-2 border-secondary rounded-positivus shadow-positivus overflow-hidden">
                {/* Chat List */}
                <div className="w-80 border-r-2 border-secondary/10 flex flex-col">
                    <div className="p-6 border-b border-secondary/10">
                        <h3 className="text-xl font-bold">Чаты</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chat, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveChat(i)}
                                className={`p-6 border-b border-light flex gap-4 cursor-pointer transition-all ${activeChat === i ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-light'
                                    }`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center font-bold text-secondary">
                                        {chat.name[0]}
                                    </div>
                                    {chat.online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold truncate">{chat.name}</h4>
                                        <span className="text-[10px] opacity-40">{chat.time}</span>
                                    </div>
                                    <p className="text-xs opacity-50 truncate">{chat.lastMsg}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold border border-secondary">
                                        {chat.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Area */}
                <div className="flex-1 flex flex-col bg-light/30">
                    <div className="p-6 bg-white border-b border-secondary/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-primary">
                                {chats[activeChat].name[0]}
                            </div>
                            <div>
                                <h4 className="font-bold leading-none mb-1">{chats[activeChat].name}</h4>
                                <p className={`text-[10px] ${chats[activeChat].online ? 'text-primary' : 'opacity-40'}`}>
                                    {chats[activeChat].online ? 'Онлайн' : 'Был недавно'}
                                </p>
                            </div>
                        </div>
                        <button className="text-secondary opacity-40 hover:opacity-100">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                        <div className="flex flex-col items-start max-w-[70%]">
                            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-secondary/10 shadow-sm relative">
                                <p className="text-sm">Здравствуйте! Я подготовил первый вариант логотипа. Можете посмотреть?</p>
                                <span className="text-[10px] opacity-30 mt-2 block">10:40</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end self-end max-w-[70%] text-white">
                            <div className="bg-secondary p-4 rounded-2xl rounded-br-none border border-secondary/10 shadow-positivus relative">
                                <p className="text-sm">Привет! Да, конечно. Прикрепляйте файл сюда.</p>
                                <div className="flex justify-end items-center gap-1 mt-2">
                                    <span className="text-[10px] opacity-40">10:42</span>
                                    <CheckCheck size={12} className="text-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start max-w-[70%]">
                            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-secondary/10 shadow-sm">
                                <div className="w-full h-40 bg-secondary/5 rounded-lg mb-2 flex items-center justify-center">
                                    <Image size={40} className="text-secondary/20" />
                                </div>
                                <p className="text-sm">Вот превью. Жду ваши фидбеки!</p>
                                <span className="text-[10px] opacity-30 mt-2 block">10:45</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border-t border-secondary/10">
                        <div className="flex items-center gap-4 bg-light p-2 rounded-2xl border border-secondary/20 focus-within:border-secondary transition-all">
                            <button className="p-2 text-secondary opacity-40 hover:opacity-100">
                                <Image size={24} />
                            </button>
                            <input
                                type="text"
                                placeholder="Напишите сообщение..."
                                className="flex-1 bg-transparent border-none outline-none text-sm p-2"
                            />
                            <button className="w-12 h-12 bg-secondary text-primary rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Chat;
