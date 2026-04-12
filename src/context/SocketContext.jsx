import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { token, isLoggedIn } = useAuth();
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    useEffect(() => {
        if (!isLoggedIn || !token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // Initialize socket with token
        const newSocket = io('http://93.77.162.174', {
            auth: { token }
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to WebSocket');
        });

        newSocket.on('user_online', (userId) => {
            setOnlineUsers(prev => new Set([...prev, userId]));
        });

        newSocket.on('user_offline', (userId) => {
            setOnlineUsers(prev => {
                const updated = new Set(prev);
                updated.delete(userId);
                return updated;
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isLoggedIn, token]);

    const value = {
        socket,
        onlineUsers,
        isOnline: (userId) => onlineUsers.has(userId)
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error('useSocket must be used within SocketProvider');
    return ctx;
};
