import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового пользователя
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Получаем всех других пользователей
    const otherUsers = await prisma.user.findMany({
      where: {
        id: { not: newUser.id },
      },
    });

    // Создаем личные чаты с каждым пользователем
    for (const otherUser of otherUsers) {
      await prisma.chat.create({
        data: {
          name: `${newUser.username}_${otherUser.username}`,
          isGroup: false,
          members: {
            create: [
              { userId: newUser.id },
              { userId: otherUser.id },
            ],
          },
        },
      });
    }

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
});

export default router;