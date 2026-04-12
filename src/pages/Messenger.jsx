import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
    Search, MoreVertical, Send, Paperclip, Smile, 
    Check, CheckCheck, ArrowLeft, User as UserIcon,
    Circle, Clock, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Messenger = () => {
    const { apiFetch, user } = useAuth();
    const { socket, isOnline } = useSocket();
    const [searchParams] = useSearchParams();
    const dealIdParam = searchParams.get('dealId');

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [counterpartTyping, setCounterpartTyping] = useState(false);
    
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // ── FETCH CHAT LIST ─────────────────────────────────────
    const fetchChats = useCallback(async () => {
        try {
            const data = await apiFetch('/chat/list');
            setChats(data);
        } catch (err) {
            console.error('Failed to fetch chats:', err);
        } finally {
            setLoading(false);
        }
    }, [apiFetch]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    // ── SELECT CHAT & FETCH MESSAGES ────────────────────────
    const selectChat = async (chat) => {
        if (!chat) return;
        setSelectedChat(chat);
        setMessages([]);
        try {
            const data = await apiFetch(`/chat/${chat.dealId}/messages`);
            setMessages(data);
            
            // Mark as read on backend
            await apiFetch(`/chat/${chat.dealId}/read`, { method: 'PATCH' });
            
            // Join socket room
            if (socket) {
                socket.emit('join_chat', chat.dealId);
            }
            
            // Local update of unread count in sidebar
            setChats(prev => prev.map(c => 
                c.dealId === chat.dealId ? { ...c, unreadCount: 0 } : c
            ));
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    };

    // ── AUTO-SELECT FROM PARAM ─────────────────────────────
    useEffect(() => {
        if (dealIdParam && chats.length > 0 && (!selectedChat || selectedChat.dealId !== dealIdParam)) {
            const targetChat = chats.find(c => c.dealId === dealIdParam);
            if (targetChat) {
                selectChat(targetChat);
            }
        }
    }, [dealIdParam, chats, selectedChat, socket]); // Include socket to re-join if needed

    // ── SEND MESSAGE ────────────────────────────────────────
    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const text = newMessage.trim();
        setNewMessage('');
        
        try {
            await apiFetch(`/chat/${selectedChat.dealId}/messages`, {
                method: 'POST',
                body: JSON.stringify({ text })
            });
        } catch (err) {
            console.error('Send failed:', err);
        }
    };

    // ── SOCKET LISTENERS ─────────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        const onNewMessage = (msg) => {
            if (selectedChat && msg.dealId === selectedChat.dealId) {
                setMessages(prev => [...prev, msg]);
                apiFetch(`/chat/${msg.dealId}/read`, { method: 'PATCH' });
            } else {
                setChats(prev => prev.map(c => 
                    c.dealId === msg.dealId 
                        ? { ...c, lastMessage: msg, unreadCount: c.unreadCount + 1 } 
                        : c
                ));
            }
        };

        const onTypingStart = ({ dealId }) => {
            if (selectedChat?.dealId === dealId) setCounterpartTyping(true);
        };

        const onTypingStop = ({ dealId }) => {
            if (selectedChat?.dealId === dealId) setCounterpartTyping(false);
        };

        socket.on('new_message', onNewMessage);
        socket.on('typing_start', onTypingStart);
        socket.on('typing_stop', onTypingStop);

        return () => {
            socket.off('new_message', onNewMessage);
            socket.off('typing_start', onTypingStart);
            socket.off('typing_stop', onTypingStop);
        };
    }, [socket, selectedChat, apiFetch]);

    // ── TYPING INDICATOR ────────────────────────────────────
    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
        if (!socket || !selectedChat) return;

        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing_start', selectedChat.dealId);
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('typing_stop', selectedChat.dealId);
        }, 3000);
    };

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading) return <div className="messenger-loading">Загрузка мессенджера...</div>;

    return (
        <div className="messenger-container glass">
            {/* Sidebar */}
            <div className={`messenger-sidebar ${selectedChat ? 'mobile-hidden' : ''}`}>
                <div className="sidebar-header">
                    <div className="search-wrap glass">
                        <Search size={18} />
                        <input type="text" placeholder="Поиск диалогов..." />
                    </div>
                </div>

                <div className="chat-list">
                    {chats.length > 0 ? chats.map(chat => (
                        <div 
                            key={chat.dealId} 
                            className={`chat-item ${selectedChat?.dealId === chat.dealId ? 'active' : ''}`}
                            onClick={() => selectChat(chat)}
                        >
                            <div className="avatar-wrapper">
                                {chat.counterpart.avatar?.length > 4 ? (
                                    <img src={chat.counterpart.avatar} alt="" />
                                ) : (
                                    <div className="avatar-placeholder">{chat.counterpart.avatar || '👤'}</div>
                                )}
                                {isOnline(chat.counterpart.id) && <div className="online-dot" />}
                            </div>
                            <div className="chat-info">
                                <div className="chat-name-row">
                                    <span className="chat-name">{chat.counterpart.name}</span>
                                    <span className="chat-time">
                                        {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <div className="chat-msg-row">
                                    <p className="last-msg">
                                        {chat.lastMessage ? `${chat.lastMessage.senderId === user.id ? 'Вы: ' : ''}${chat.lastMessage.text}` : 'Нет сообщений'}
                                    </p>
                                    {chat.unreadCount > 0 && <span className="unread-badge">{chat.unreadCount}</span>}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="list-empty">У вас пока нет активных диалогов</div>
                    )}
                </div>
            </div>

            {/* Main Window */}
            <div className={`messenger-main ${!selectedChat ? 'mobile-hidden' : ''}`}>
                {selectedChat ? (
                    <>
                        <header className="chat-header">
                            <button className="back-btn" onClick={() => setSelectedChat(null)}>
                                <ArrowLeft size={24} />
                            </button>
                            <div className="header-user">
                                <div className="avatar-wrapper">
                                    {selectedChat.counterpart.avatar?.length > 4 ? (
                                        <img src={selectedChat.counterpart.avatar} alt="" />
                                    ) : (
                                        <div className="avatar-placeholder">{selectedChat.counterpart.avatar || '👤'}</div>
                                    )}
                                </div>
                                <div className="header-info">
                                    <div className="name-status">
                                        <span className="name">{selectedChat.counterpart.name}</span>
                                        <span className={`status ${isOnline(selectedChat.counterpart.id) ? 'online' : ''}`}>
                                            {isOnline(selectedChat.counterpart.id) ? 'в сети' : 'был(а) недавно'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="header-actions">
                                <button className="icon-btn"><Search size={20} /></button>
                                <button className="icon-btn"><MoreVertical size={20} /></button>
                            </div>
                        </header>

                        <div className="messages-area">
                            <div className="messages-scroll">
                                {messages.map((msg, i) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg.id} 
                                        className={`message-bubble-row ${msg.senderId === user.id ? 'mine' : 'theirs'}`}
                                    >
                                        <div className="bubble glass">
                                            <p>{msg.text}</p>
                                            <div className="bubble-footer">
                                                <span className="msg-time">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {msg.senderId === user.id && (
                                                    msg.isRead ? <CheckCheck size={14} className="status-icon read" /> : <Check size={14} className="status-icon" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {counterpartTyping && (
                                    <div className="typing-indicator theirs">
                                        <span>печатает...</span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <div className="chat-input-area">
                            <form className="input-form glass" onSubmit={handleSend}>
                                <button type="button" className="icon-btn"><Paperclip size={20} /></button>
                                <input 
                                    type="text" 
                                    placeholder="Напишите сообщение..." 
                                    value={newMessage}
                                    onChange={handleInputChange}
                                />
                                <button type="button" className="icon-btn"><Smile size={20} /></button>
                                <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="chat-placeholder">
                        <div className="placeholder-content">
                            <ImageIcon size={64} className="icon" opacity={0.3} />
                            <h3>Выберите чат, чтобы начать общение</h3>
                            <p>Интегрированный мессенджер для безопасных сделок</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messenger;
