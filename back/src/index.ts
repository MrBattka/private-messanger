import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import multer from 'multer';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { authenticateToken } from './middleware/auth';
import jwt from 'jsonwebtoken';
import logger from './utils/logger';
import rateLimit from 'express-rate-limit';

const upload = multer({ dest: 'uploads/' });

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// 🔒 Глобальный лимит: 100 запросов в час
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 100,
  message: {
    error: 'Слишком много запросов с этого IP, попробуйте позже.',
  },
  standardHeaders: true, // Отправляет `RateLimit-*` заголовки
  legacyHeaders: false,
});

// 🛑 Лимит для авторизации: 5 запросов за 15 минут
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5,
  message: {
    error: 'Слишком много попыток входа. Подождите 15 минут.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ⚠️ Важно: подключаем глобальный лимит ДО маршрутов, но НЕ на /api/auth
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/auth')) {
    return next(); // пропускаем, обработаем отдельно
  }
  limiter(req, res, next);
});

// А теперь применяем строгий лимит к маршрутам авторизации
app.use('/api/auth', authLimiter);

// ... остальной middleware (cors, json и т.д.)
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/static', express.static('public'));

// ... маршруты
app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes(io));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});


// WebSocket подключение
io.on('connection', (socket) => {
  const userId = (socket as any).userId;
  const username = (socket as any).username;

  logger.info(`Пользователь подключен: ${socket.id}, User ID: ${userId}`);

  socket.on('join_chat', async (chatId: number) => {
    try {
      // Проверяем, состоит ли пользователь в этом чате
      const membership = await prisma.chatMember.findFirst({
        where: {
          userId,
          chatId,
        },
      });

      if (!membership) {
        logger.warn(`Пользователь ${userId} попытался присоединиться к чату ${chatId}, но не является участником`);
        socket.emit('error', { message: 'Доступ запрещён: вы не состоите в этом чате' });
        return;
      }

      socket.join(`chat_${chatId}`);
      console.log(`Пользователь ${userId} (${username}) присоединился к чату ${chatId}`);
    } catch (err) {
      logger.error('Ошибка при присоединении к чату:', err);
      socket.emit('error', { message: 'Не удалось присоединиться к чату' });
    }
  });

  socket.on('send_message', async (data: {
    chatId: number;
    content: string;
    replyToId?: number | null;
  }) => {
    const { chatId, content, replyToId } = data;

    try {
      // 1. Проверить, состоит ли пользователь в чате
      const membership = await prisma.chatMember.findFirst({
        where: { userId, chatId },
      });

      if (!membership) {
        socket.emit('error', { message: 'Нет доступа к этому чату' });
        return;
      }

      // 2. Если есть replyToId — проверить, что сообщение существует
      if (replyToId) {
        const replyTarget = await prisma.message.findUnique({
          where: { id: replyToId },
          include: { chat: true },
        });

        if (!replyTarget) {
          socket.emit('error', { message: 'Целевое сообщение не найдено' });
          return;
        }

        // Убедиться, что replyToId из того же чата
        if (replyTarget.chatId !== chatId) {
          socket.emit('error', { message: 'Нельзя цитировать сообщение из другого чата' });
          return;
        }
      }

      // 3. Создать сообщение
      const message = await prisma.message.create({
        data: {
          content,
          userId,
          chatId,
          replyToId: replyToId || null,
        },
        include: {
          user: true,
          replyTo: {
            include: { user: true },
          },
        },
      });

      // 4. Форматируем для фронтенда
      const formattedMessage = {
        id: message.id,
        content: message.content,
        userId: message.userId,
        chatId: message.chatId,
        createdAt: message.createdAt,
        user: { username: message.user.username },
        replyTo: message.replyTo
          ? {
            sender: message.replyTo.user.username,
            content: message.replyTo.content,
          }
          : null,
        replyToId: message.replyToId,
      };

      // 5. Отправляем всем в комнате
      io.to(`chat_${chatId}`).emit('receive_message', formattedMessage);
    } catch (err) {
      logger.error('Ошибка при отправке сообщения:', err);
      socket.emit('error', { message: 'Не удалось отправить сообщение' });
    }
  });

  socket.on('disconnect', () => {
    logger.info(`Пользователь отключен: ${socket.id}, User ID: ${userId}`);
  });
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];

    if (!token) {
      console.warn('❌ Нет токена в handshake');
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; username: string };

    // Сохраняем данные пользователя в сокете
    (socket as any).userId = decoded.userId;
    (socket as any).username = decoded.username;

    console.log(`✅ Пользователь аутентифицирован через Socket.IO: ${decoded.username} (ID: ${decoded.userId})`);
    next();
  } catch (err) {
    console.error('❌ Ошибка проверки токена:', err);
    next(new Error('Authentication error: Invalid or expired token'));
  }
});

process.on('SIGINT', async () => {
  logger.info('Получен сигнал завершения (SIGINT)...');
  await prisma.$disconnect();
  logger.info('Соединение с базой данных закрыто');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Получен сигнал завершения (SIGTERM)...');
  await prisma.$disconnect();
  logger.info('Соединение с базой данных закрыто');
  process.exit(0);
});

server.listen(PORT, () => {
  logger.info(`🚀 Сервер запущен на порту ${PORT}`);
});