const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Некорректный email').toLowerCase(),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Некорректный email').toLowerCase(),
    password: z.string(),
    remember: z.boolean().optional(),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Имя слишком короткое').optional(),
    avatar: z.string().url('Некорректная ссылка на аватар').optional().or(z.literal('')),
    activeRole: z.enum(['client', 'freelancer', 'admin']).optional(),
    bio: z.string().trim().max(1000).optional(),
    specialization: z.string().trim().max(100).optional(),
  }),
});

// ── PROJECT SCHEMAS ─────────────────────────────────────
const createProjectSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5, 'Заголовок должен быть не менее 5 символов'),
    description: z.string().trim().min(20, 'Описание должно быть не менее 20 символов'),
    budget: z.number().min(500, 'Минимальный бюджет — 500 ₽'),
    category: z.string().trim().min(2, 'Выберите категорию'),
  }),
});

const createOfferSchema = z.object({
  body: z.object({
    price: z.number().min(500, 'Минимальное предложение — 500 ₽'),
    message: z.string().trim().min(10, 'Напишите хотя бы 10 символов в предложении'),
  }),
});

// ── KWORK SCHEMAS ───────────────────────────────────────
const createKworkSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5, 'Название слишком короткое'),
    description: z.string().trim().min(20, 'Описание слишком короткое'),
    price: z.number().min(500, 'Минимальная цена — 500 ₽'),
    category: z.string().trim().min(2, 'Выберите категорию'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createProjectSchema,
  createOfferSchema,
  createKworkSchema,
};
