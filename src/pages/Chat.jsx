import React, { useMemo, useState } from 'react';
import { Search, Star, Send, Paperclip, Smile, MoreHorizontal, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';

const initialChats = [
  { id: 1, name: 'Anna Design', lastMsg: 'Подготовила 2 варианта баннера.', time: '10:45', unread: 2, online: true, starred: true, avatar: '🎨' },
  { id: 2, name: 'CodeMaster', lastMsg: 'API готово, отправляю доступы.', time: '09:30', unread: 0, online: false, starred: false, avatar: '👨‍💻' },
  { id: 3, name: 'VfxKing', lastMsg: 'Финальный рендер будет вечером.', time: 'Вчера', unread: 1, online: true, starred: true, avatar: '🎬' },
  { id: 4, name: 'MarketExpert', lastMsg: 'Запустили тестовую кампанию.', time: 'Пн', unread: 0, online: false, starred: false, avatar: '📈' },
];

const initialMessages = {
  1: [
    { id: 1, fromMe: false, text: 'Здравствуйте! Подготовила 2 варианта баннера.', time: '10:40' },
    { id: 2, fromMe: true, text: 'Отлично, отправляйте. Посмотрю и дам комментарии.', time: '10:42' },
  ],
  2: [
    { id: 1, fromMe: false, text: 'API готово, отправляю доступы.', time: '09:30' },
  ],
  3: [
    { id: 1, fromMe: true, text: 'Как продвигается анимация для ролика?', time: 'Вчера' },
    { id: 2, fromMe: false, text: 'Финальный рендер будет вечером.', time: 'Вчера' },
  ],
  4: [
    { id: 1, fromMe: false, text: 'Запустили тестовую кампанию.', time: 'Пн' },
  ],
};

const Chat = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messagesByChat, setMessagesByChat] = useState(initialMessages);

  const filteredChats = useMemo(
    () => chats.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [chats, searchQuery],
  );

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = messagesByChat[activeChatId] || [];

  const toggleStar = (id, e) => {
    e.stopPropagation();
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c)));
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessagesByChat((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), { id: Date.now(), fromMe: true, text, time: 'сейчас' }],
    }));
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-light">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-8 pt-24 md:px-6">
        <div className="h-[calc(100vh-130px)] overflow-hidden rounded-positivus border-2 border-secondary bg-white shadow-positivus">
          <div className="flex h-full">
            <aside className={`w-full border-r border-secondary/10 md:w-80 lg:w-96 ${showMobileChat ? 'hidden md:block' : 'block'}`}>
              <div className="border-b border-secondary/10 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-secondary">Диалоги</h2>
                  <div className="inline-flex items-center gap-1 rounded-lg bg-light px-2 py-1 text-xs font-bold">
                    <Star size={14} className="fill-primary text-primary" />
                    {chats.filter((c) => c.starred).length}
                  </div>
                </div>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск"
                    className="w-full rounded-xl border border-secondary/15 bg-light py-2 pl-9 pr-3 text-sm outline-none transition focus:border-secondary"
                  />
                </div>
              </div>

              <div className="h-[calc(100%-98px)] overflow-y-auto no-scrollbar">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setShowMobileChat(true);
                    }}
                    className={`group relative flex w-full items-center gap-3 border-b border-light px-4 py-4 text-left transition ${
                      activeChatId === chat.id ? 'bg-primary/10' : 'hover:bg-light/50'
                    }`}
                  >
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-secondary/15 bg-white text-xl">
                        {chat.avatar}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                          chat.online ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="truncate font-bold text-secondary">{chat.name}</p>
                        <span className="text-xs text-secondary/40">{chat.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm text-secondary/60">{chat.lastMsg}</p>
                        {chat.starred && <Star size={12} className="fill-primary text-primary" />}
                      </div>
                      <p className="mt-0.5 text-[11px] font-medium text-secondary/45">
                        {chat.online ? 'онлайн' : 'не в сети'}
                      </p>
                    </div>
                    {chat.unread > 0 ? (
                      <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-primary">
                        {chat.unread}
                      </span>
                    ) : null}
                    <span
                      onClick={(e) => toggleStar(chat.id, e)}
                      className="absolute right-2 top-2 cursor-pointer rounded-md p-1 opacity-0 transition group-hover:opacity-100"
                    >
                      <Star size={14} className={chat.starred ? 'fill-primary text-primary' : 'text-secondary/25'} />
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <section className={`flex-1 flex-col ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
              <header className="flex items-center justify-between border-b border-secondary/10 px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMobileChat(false)}
                    className="inline-flex rounded-lg p-2 text-secondary/50 hover:bg-light md:hidden"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary/15 bg-light text-xl">
                    {activeChat?.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-secondary">{activeChat?.name}</p>
                    <p className="text-xs font-medium text-secondary/50">
                      {activeChat?.online ? 'в сети' : 'был(а) недавно'}
                    </p>
                  </div>
                </div>
                <button type="button" className="rounded-lg p-2 text-secondary/40 hover:bg-light hover:text-secondary">
                  <MoreHorizontal size={20} />
                </button>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto bg-light/30 px-6 py-5 no-scrollbar">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        msg.fromMe
                          ? 'rounded-br-md bg-secondary text-white'
                          : 'rounded-bl-md border border-secondary/10 bg-white text-secondary'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`mt-1 text-[10px] ${msg.fromMe ? 'text-white/60' : 'text-secondary/40'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="border-t border-secondary/10 bg-white p-4">
                <div className="flex items-center gap-2 rounded-xl border border-secondary/15 bg-light px-2 py-2">
                  <button type="button" className="rounded-md p-2 text-secondary/35 hover:text-secondary">
                    <Smile size={18} />
                  </button>
                  <button type="button" className="rounded-md p-2 text-secondary/35 hover:text-secondary">
                    <Paperclip size={18} />
                  </button>
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="flex-1 bg-transparent px-2 text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg transition ${
                      message.trim() ? 'bg-primary text-secondary' : 'bg-secondary/10 text-secondary/30'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
