require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Simple JSON Database setup
const DB_PATH = path.join(__dirname, 'database.json');
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ 
        users: [], 
        projects: [
            {
                id: "1",
                title: "Нужно сверстать лендинг для курса по Python",
                description: "Требуется опытный верстальщик. Макет в Figma. Срок 3 дня.",
                budget: 5000,
                category: "Разработка и IT",
                offersCount: 3,
                clientId: "admin",
                createdAt: new Date().toISOString()
            },
            {
                id: "2",
                title: "Дизайн логотипа для магазина кофе",
                description: "Стиль минимализм. Нужны исходники в векторе.",
                budget: 3000,
                category: "Дизайн",
                offersCount: 1,
                clientId: "admin",
                createdAt: new Date().toISOString()
            }
        ] 
    }));
}

function readDB() {
    return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper to send emails
async function sendVerificationEmail(email, token) {
    const url = `${process.env.FRONTEND_URL}/verify?token=${token}`;
    const mailOptions = {
        from: `"Troudo" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Подтвердите регистрацию на Troudo',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #6366f1; text-align: center;">Добро пожаловать в Troudo!</h2>
                <p>Здравствуйте!</p>
                <p>Для завершения регистрации и активации вашего аккаунта, пожалуйста, нажмите на кнопку ниже:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Подтвердить Email</a>
                </div>
                <p>Или перейдите по ссылке: <br> <a href="${url}">${url}</a></p>
                <p style="font-size: 12px; color: #777; margin-top: 40px;">Ссылка активна 24 часа. Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;">
                <p style="text-align: center; color: #999; font-size: 12px;">© 2026 Troudo Marketplace</p>
            </div>
        `
    };
    return transporter.sendMail(mailOptions);
}

// Routes

// 1. Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = readDB();

        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'Этот email уже занят' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            status: 'waiting_verification',
            roles: ['client'],
            activeRole: 'client',
            verifyToken,
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        writeDB(db);

        // Send email
        try {
            await sendVerificationEmail(email, verifyToken);
            res.status(201).json({ message: 'Письмо для подтверждения отправлено на вашу почту', email });
        } catch (emailErr) {
            console.error('Email send error:', emailErr);
            // In a real app, maybe we still return 201 but ask user to resend later if it fails
            res.status(201).json({ 
                message: 'Пользователь создан, но произошла ошибка при отправке письма. Обратитесь в поддержку.', 
                dev_token: verifyToken // For development ease
            });
        }

    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// 2. Email Verification
app.post('/api/auth/verify', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: 'Токен отсутствует' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const db = readDB();
        const userIndex = db.users.findIndex(u => u.email === decoded.email && u.verifyToken === token);

        if (userIndex === -1) {
            return res.status(400).json({ message: 'Неверный или просроченный токен' });
        }

        db.users[userIndex].status = 'active';
        db.users[userIndex].verifyToken = null;
        writeDB(db);

        res.json({ message: 'Email успешно подтвержден' });
    } catch (err) {
        res.status(400).json({ message: 'Токен недействителен или просрочен' });
    }
});

// 3. Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, remember } = req.body;
        const db = readDB();
        const user = db.users.find(u => u.email === email);

        if (!user) return res.status(400).json({ message: 'Неверный email или пароль' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Неверный email или пароль' });

        if (user.status === 'waiting_verification') {
            return res.status(401).json({ message: 'Сначала подтвердите ваш email' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: remember ? '30d' : '24h' }
        );

        const { password: _, verifyToken: __, ...safeUser } = user;
        res.json({ token, user: safeUser });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});
// ──────── PROJECTS (EXCHANGE) ROUTES ────────

// Get all projects for Exchange
app.get('/api/projects', (req, res) => {
    const { category, q } = req.query;
    let projects = readDB().projects;

    if (category) {
        projects = projects.filter(p => p.category === category);
    }
    if (q) {
        projects = projects.filter(p => 
            p.title.toLowerCase().includes(q.toLowerCase()) || 
            p.description.toLowerCase().includes(q.toLowerCase())
        );
    }

    res.json(projects);
});

// Create new project (Client only)
app.post('/api/projects', authenticateToken, (req, res) => {
    const { title, description, budget, category } = req.body;
    const db = readDB();

    const newProject = {
        id: Date.now().toString(),
        title,
        description,
        budget,
        category,
        offersCount: 0,
        clientId: req.user.id,
        createdAt: new Date().toISOString()
    };

    db.projects.push(newProject);
    writeDB(db);

    res.status(201).json(newProject);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
