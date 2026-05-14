import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema } from '../schemas'; // ← импортируем
import logger from '../utils/logger';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Регистрация
router.post(
  '/register',
  validate(registerSchema),
  async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Проверяем существование пользователя (без возврата пароля)
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
        select: { id: true }, // только факт существования
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Создаём пользователя, но не возвращаем пароль
      const newUser = await prisma.user.create({
        data: { username, email, password: hashedPassword },
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
          createdAt: true,
        },
      });

      const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
        createdAt: newUser.createdAt,
        token,
      });
    } catch (error) {
      logger.error('Ошибка регистрации:', error);
      res.status(500).json({ error: 'Ошибка при регистрации' });
    }
  }
);

// Вход
router.post(
  '/login',
  validate(loginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // ВАЖНО: получаем пароль ТОЛЬКО для проверки, но исключаем его из результата далее
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          username: true,
          email: true,
          password: true, // ← нужен только для bcrypt.compare
          avatarUrl: true,
          createdAt: true,
        },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Неверные учетные данные' });
      }

      // Удаляем пароль из объекта перед отправкой
      const { password: _, ...userWithoutPassword } = user;

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.json({
        ...userWithoutPassword,
        token,
      });
    } catch (error) {
      logger.error('Ошибка входа:', error);
      res.status(500).json({ error: 'Ошибка при входе' });
    }
  }
);

export default router;