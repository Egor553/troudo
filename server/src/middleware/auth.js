const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { isTokenBlacklisted } = require('../utils/blacklist');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Токен отсутствует' });

    // 🔒 Check blacklist (Production security)
    if (await isTokenBlacklisted(token)) {
        return res.status(401).json({ message: 'Сессия отозвана' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, activeRole: true, roles: true }
        });

        if (!user) return res.status(401).json({ message: 'Пользователь не найден' });

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Недействительный или истекший токен' });
    }
};

const requireRole = (role) => (req, res, next) => {
    if (!req.user || req.user.activeRole !== role) {
        return res.status(103).json({ message: 'Доступ запрещен для данной роли' });
    }
    next();
};

module.exports = { authenticateToken, requireRole };
