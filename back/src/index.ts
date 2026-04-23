import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import multer from 'multer';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const upload = multer({ dest: 'uploads/' });

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use('/static', express.static('public'));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes(io));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// WebSocket подключение
io.on('connection', (socket) => {
  console.log('Пользователь подключен:', socket.id);

  socket.on('join_chat', (chatId: number, userId: number) => {
    socket.join(`chat_${chatId}`);
    console.log(`Пользователь ${userId} присоединился к чату ${chatId}`);
  });

  socket.on('send_message', async (data: { chatId: number; userId: number; content: string }) => {
    const message = await prisma.message.create({
      data: {
        content: data.content,
        userId: data.userId,
        chatId: data.chatId,
      },
      include: { user: true },
    });

    io.to(`chat_${data.chatId}`).emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключен:', socket.id);
  });
});

process.on('SIGINT', async () => {
  console.log('\nПолучен сигнал завершения (SIGINT)...');
  await prisma.$disconnect();
  console.log('Соединение с базой данных закрыто');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nПолучен сигнал завершения (SIGTERM)...');
  await prisma.$disconnect();
  console.log('Соединение с базой данных закрыто');
  process.exit(0);
});

server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});