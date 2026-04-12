const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const userSockets = new Map(); // userId -> socketId

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Adjust for production
            methods: ["GET", "POST"]
        }
    });

    // 🔒 Middleware for Auth
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error'));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 User connected: ${socket.userId} (${socket.id})`);
        userSockets.set(socket.userId, socket.id);

        // Broadcast online status
        socket.broadcast.emit('user_online', socket.userId);

        socket.on('join_chat', (dealId) => {
            socket.join(dealId);
            console.log(`💬 User ${socket.userId} joined room: ${dealId}`);
        });

        socket.on('typing_start', (dealId) => {
            socket.to(dealId).emit('typing_start', { dealId, userId: socket.userId });
        });

        socket.on('typing_stop', (dealId) => {
            socket.to(dealId).emit('typing_stop', { dealId, userId: socket.userId });
        });

        socket.on('disconnect', () => {
            console.log(`🔌 User disconnected: ${socket.userId}`);
            userSockets.delete(socket.userId);
            socket.broadcast.emit('user_offline', socket.userId);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
};

// Helper to send message to specific users room or individual
const emitToUser = (userId, event, data) => {
    const socketId = userSockets.get(userId);
    if (socketId) {
        io.to(socketId).emit(event, data);
    }
};

module.exports = { initSocket, getIO, emitToUser };
