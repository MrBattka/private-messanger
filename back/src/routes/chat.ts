import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import prisma from '../lib/prisma';

export default function chatRoutes(io: SocketIOServer) {
  const router = express.Router();

  // Получить всех пользователей
  router.get('/users/all', async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
        },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
  });

  // Получить все чаты пользователя
  router.get('/:userId', async (req, res) => {
    try {
      const chats = await prisma.chat.findMany({
        where: {
          members: {
            some: { userId: parseInt(req.params.userId) },
          },
        },
        include: {
          members: { include: { user: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      });
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении чатов' });
    }
  });

  // Получить сообщения чата
  router.get('/:chatId/messages', async (req, res) => {
    try {
      const messages = await prisma.message.findMany({
        where: { chatId: parseInt(req.params.chatId) },
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении сообщений' });
    }
  });

  // Создать личный чат
  router.post('/create-private', async (req, res) => {
    try {
      const { userId1, userId2 } = req.body;

      // Проверяем, не существует ли уже такой чат
      const existingChat = await prisma.chat.findFirst({
        where: {
          isGroup: false,
          members: {
            every: {
              userId: { in: [userId1, userId2] },
            },
          },
        },
      });

      if (existingChat) {
        return res.json(existingChat);
      }

      const chat = await prisma.chat.create({
        data: {
          name: `Chat_${userId1}_${userId2}`,
          isGroup: false,
          members: {
            create: [
              { userId: userId1 },
              { userId: userId2 },
            ],
          },
        },
        include: { members: { include: { user: true } } },
      });
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании чата' });
    }
  });

  return router;
}