const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Некорректный email'),
    password: z.string(),
    remember: z.boolean().optional(),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    avatar: z.string().optional(),
    activeRole: z.enum(['client', 'freelancer', 'admin']).optional(),
    bio: z.string().optional(),
    specialization: z.string().optional(),
  }),
});

// ── PROJECT SCHEMAS ─────────────────────────────────────
const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Минимум 5 символов'),
    description: z.string().min(20, 'Минимум 20 символов'),
    budget: z.number().min(0),
    category: z.string(),
  }),
});

const createOfferSchema = z.object({
  body: z.object({
    price: z.number().min(0),
    message: z.string().min(10),
  }),
});

// ── KWORK SCHEMAS ───────────────────────────────────────
const createKworkSchema = z.object({
  body: z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    price: z.number().min(0),
    category: z.string(),
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
