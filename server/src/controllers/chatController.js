const ChatService = require('../services/ChatService');

const getChatList = async (req, res) => {
    try {
        const chats = await ChatService.getChatList(req.user.id);
        res.json(chats);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения списка чатов: ' + err.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await ChatService.getMessages(req.params.dealId, req.user.id);
        res.json(messages);
    } catch (err) {
        const status = err.message === 'FORBIDDEN' ? 403 : err.message === 'NOT_FOUND' ? 404 : 500;
        res.status(status).json({ message: err.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const message = await ChatService.sendMessage(req.params.dealId, req.user.id, req.body.text);
        res.status(201).json(message);
    } catch (err) {
        const status = err.message === 'FORBIDDEN' ? 403 : err.message === 'NOT_FOUND' ? 404 : 500;
        res.status(status).json({ message: err.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        await ChatService.markAsRead(req.params.dealId, req.user.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка: ' + err.message });
    }
};

module.exports = {
    getChatList,
    getMessages,
    sendMessage,
    markAsRead
};
