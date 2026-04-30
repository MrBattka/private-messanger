import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import prisma from '../lib/prisma';
import { validate } from '../middleware/validation';
import { createPrivateChatSchema } from '../schemas'; // ← централизованная схема
import logger from '../utils/logger';

export default function chatRoutes(io: SocketIOServer) {
  const router = express.Router();

  // 🔹 Получить всех пользователей
  router.get('/users/all', async (_req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, username: true, email: true, avatarUrl: true },
      });
      res.json(users);
    } catch (error) {
      logger.error('Ошибка при получении пользователей:', error);
      res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
  });

  // 🔹 Получить чаты пользователя
  // Валидация: userId должен быть числом
  router.get('/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    validateUserId(userId)
      .then(async () => {
        try {
          const chats = await prisma.chat.findMany({
            where: { members: { some: { userId } } },
            include: {
              members: { include: { user: true } },
              messages: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
          });
          res.json(chats);
        } catch (error) {
          logger.error('Ошибка при получении чатов:', error);
          res.status(500).json({ error: 'Ошибка при получении чатов' });
        }
      })
      .catch((err) => res.status(400).json(err));
  });

  // 🔹 Получить сообщения чата
  router.get('/:chatId/messages', (req, res) => {
    const chatId = parseInt(req.params.chatId);
    if (isNaN(chatId)) {
      return res.status(400).json({ error: 'Invalid chat ID' });
    }

    validateChatId(chatId)
      .then(async () => {
        try {
          const messages = await prisma.message.findMany({
            where: { chatId },
            include: { user: true, replyTo: { include: { user: true } } },
            orderBy: { createdAt: 'asc' },
          });

          const formatted = messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            userId: msg.userId,
            chatId: msg.chatId,
            createdAt: msg.createdAt,
            user: { username: msg.user.username },
            replyTo: msg.replyTo
              ? {
                  sender: msg.replyTo.user.username,
                  content: msg.replyTo.content,
                }
              : null,
            replyToId: msg.replyToId,
          }));

          res.json(formatted);
        } catch (error) {
          logger.error('Ошибка при получении сообщений:', error);
          res.status(500).json({ error: 'Ошибка при получении сообщений' });
        }
      })
      .catch((err) => res.status(400).json(err));
  });

  // 🔹 Создать личный чат
  router.post(
    '/create-private',
    validate(createPrivateChatSchema), // ✅ Валидация из централизованного файла
    async (req, res) => {
      try {
        const { userId1, userId2 } = req.body;

        // Проверка: нельзя создать чат сам с собой
        if (userId1 === userId2) {
          return res.status(400).json({ error: 'Нельзя создать чат с самим собой' });
        }

        const existingChat = await prisma.chat.findFirst({
          where: {
            isGroup: false,
            AND: [
              { members: { some: { userId: userId1 } } },
              { members: { some: { userId: userId2 } } },
            ],
          },
          include: { members: true },
        });

        if (existingChat && existingChat.members.length === 2) {
          return res.json(existingChat);
        }

        const chat = await prisma.chat.create({
          data: {
            name: `Chat_${userId1}_${userId2}`,
            isGroup: false,
            members: {
              create: [{ userId: userId1 }, { userId: userId2 }],
            },
          },
          include: { members: { include: { user: true } } },
        });

        res.status(201).json(chat);
      } catch (error) {
        logger.error('Ошибка при создании чата:', error);
        res.status(500).json({ error: 'Ошибка при создании чата' });
      }
    }
  );

  return router;
}

// 🔧 Вспомогательные функции для валидации (можно вынести в отдельный модуль)
const validateUserId = (id: number) => {
  if (!Number.isInteger(id) || id <= 0) {
    return Promise.reject({ error: 'User ID must be a positive integer' });
  }
  return Promise.resolve();
};

const validateChatId = (id: number) => {
  if (!Number.isInteger(id) || id <= 0) {
    return Promise.reject({ error: 'Chat ID must be a positive integer' });
  }
  return Promise.resolve();
};