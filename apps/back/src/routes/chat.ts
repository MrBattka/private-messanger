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
  router.get('/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
      const chats = await prisma.chat.findMany({
        where: { members: { some: { userId } } },
        include: {
          members: {
            include: { user: true },
          },
        },
      });

      // Форматируем и добавляем unreadCount
      const formattedChats = await Promise.all(
        chats.map(async (chat) => {
          const member = chat.members.find((m) => m.userId === userId);
          const lastSeen = member?.lastSeen;

          // 🔁 Получаем ПОСЛЕДНЕЕ сообщение в чате (не просто первое из `include`)
          const lastMessageInChat = await prisma.message.findFirst({
            where: { chatId: chat.id },
            orderBy: { createdAt: 'desc' },
            include: { user: true },
          });

          // 🔢 Считаем непрочитанные: сообщения от других, после lastSeen
          const unreadCount = lastMessageInChat && lastMessageInChat.userId !== userId && lastSeen
            ? await prisma.message.count({
              where: {
                chatId: chat.id,
                userId: { not: userId },
                createdAt: { gt: lastSeen },
              },
            })
            : 0;

          let displayName = chat.name;
          let participantId = null;

          if (chat.members.length === 2) {
            const otherUser = chat.members.find((m) => m.userId !== userId);
            if (otherUser) {
              displayName = otherUser.user.username;
              participantId = otherUser.userId;
            }
          }

          return {
            id: chat.id,
            name: displayName,
            lastMessage: lastMessageInChat?.content || 'Нет сообщений',
            time: lastMessageInChat
              ? new Date(lastMessageInChat.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
              : 'никогда',
            unreadCount,
            isOnline: true,
            participantId,
          };
        })
      );

      res.json(formattedChats);
    } catch (error) {
      logger.error('Ошибка при получении чатов:', error);
      res.status(500).json({ error: 'Ошибка при получении чатов' });
    }
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
        io.to(`user_${userId1}`).emit('new_chat', chat);
        io.to(`user_${userId2}`).emit('new_chat', chat);

        res.status(201).json(chat);
      } catch (error) {
        logger.error('Ошибка при создании чата:', error);
        res.status(500).json({ error: 'Ошибка при создании чата' });
      }
    }
  );
  router.post('/:chatId/mark-seen', async (req, res) => {
    const chatId = parseInt(req.params.chatId);
    const { userId } = req.body;

    if (isNaN(chatId) || !userId) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    try {
      // 1. Проверяем, существует ли чат
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        return res.status(404).json({ error: 'Чат не найден' });
      }

      // 2. Проверяем, существует ли пользователь
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      // 3. Теперь безопасно делаем upsert
      await prisma.chatMember.upsert({
        where: {
          userId_chatId: { userId, chatId },
        },
        create: {
          userId,
          chatId,
          lastSeen: new Date(),
        },
        update: {
          lastSeen: new Date(),
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('Ошибка при отметке чата как прочитанного:', error);
      res.status(500).json({ error: 'Не удалось обновить lastSeen' });
    }
  });

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