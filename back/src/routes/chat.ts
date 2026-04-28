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
        include: {
          user: true,
          replyTo: {
            include: {
              user: true, // ← обязательно, чтобы был username
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      // Форматируем ответ
      const formatted = messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        userId: msg.userId,
        chatId: msg.chatId,
        createdAt: msg.createdAt,
        user: {
          username: msg.user.username,
        },
        replyTo: msg.replyTo && msg.replyTo.user
          ? {
            sender: msg.replyTo.user.username,
            content: msg.replyTo.content,
          }
          : null,
          replyToId: msg.replyToId,
      }));

      res.json(formatted);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении сообщений' });
    }
  });

  // Создать личный чат
  router.post('/create-private', async (req, res) => {
    try {
      const { userId1, userId2 } = req.body;

      // Валидация входных данных
      if (!userId1 || !userId2 || isNaN(userId1) || isNaN(userId2)) {
        return res.status(400).json({ error: 'Invalid user IDs' });
      }

      // Проверяем, существует ли уже приватный чат между ними
      const existingChat = await prisma.chat.findFirst({
        where: {
          isGroup: false,
          AND: [
            {
              members: {
                some: { userId: userId1 },
              },
            },
            {
              members: {
                some: { userId: userId2 },
              },
            },
          ],
        },
        include: {
          members: true,
        },
      });

      if (existingChat && existingChat.members.length === 2) {
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
      console.error(error);
      res.status(500).json({ error: 'Ошибка при создании чата' });
    }
  });

  return router;
}