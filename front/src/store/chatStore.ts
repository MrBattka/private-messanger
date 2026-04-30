import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';
import { apiFetch } from '../utils/apiClient';

export interface ReplyTo {
  sender: string;
  content: string;
}
export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
  chatId: number;
  userId: number;
  serverId?: string;
  replyTo?: ReplyTo | null;
  replyToId?: number | null;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
}

interface ChatState {
  messages: ChatMessage[];
  chats: Chat[];
  users: User[];
  selectedChatId: number | null;
  socket: Socket | null;
  currentUserId: number | null;
  isInitialized: boolean;
  isLoadingMessages: boolean;
  initSocket: (userId: number) => void;
  addMessage: (message: ChatMessage) => void;
  receiveMessage: (message: any) => void;
  loadChats: (userId: number) => Promise<void>;
  loadMessages: (chatId: number) => Promise<void>;
  loadUsers: () => Promise<void>;
  clearMessages: () => void;
  selectChat: (id: number) => void;
  getMessagesForChat: (chatId: number) => ChatMessage[];
  createPrivateChat: (userId1: number, userId2: number) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  chats: [],
  users: [],
  selectedChatId: null,
  socket: null,
  currentUserId: null,
  isInitialized: false,
  isLoadingMessages: false,

  initSocket: (userId: number) => {
    const { socket: existingSocket, isInitialized } = get();

    if (isInitialized && existingSocket) {
      return;
    }

    const token = localStorage.getItem('token'); // ← получаем токен

    const socket = io('http://localhost:3001', {
      auth: {
        token, // ← передаём токен здесь
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Ошибка подключения Socket.IO:', err.message);
      if (err.message.includes('Authentication')) {
        console.log('Токен недействителен. Пожалуйста, войдите снова.');
        // Можно вызвать logout
      }
    });

    socket.on('receive_message', (message: any) => {
      get().receiveMessage(message);
    });

    set({ socket, currentUserId: userId, isInitialized: true });
  },

  loadChats: async (userId: number) => {
    try {
      const response = await apiFetch(`http://localhost:3001/api/chat/${userId}`);
      const chats = await response.json();

      const formattedChats = chats.map((chat: any) => {
        let displayName = chat.name; // по умолчанию

        // Если это приватный чат из двух участников
        if (Array.isArray(chat.members) && chat.members.length === 2) {
          const otherUser = chat.members.find((member: any) => member.userId !== userId);
          if (otherUser) {
            displayName = otherUser.user.username;
          }
        }

        return {
          id: chat.id,
          name: displayName,
          lastMessage: chat.messages[0]?.content || 'Нет сообщений',
          time: chat.messages[0]?.createdAt
            ? new Date(chat.messages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'никогда',
          unreadCount: 0,
          isOnline: true,
        };
      });

      set({ chats: formattedChats });
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    }
  },
  loadMessages: async (chatId: number) => {
    set({ isLoadingMessages: true }); // ← начало загрузки
    try {
      const response = await apiFetch(`http://localhost:3001/api/chat/${chatId}/messages`);
      const messages = await response.json();

      const currentUserId = get().currentUserId;
      const formattedMessages = messages.map((msg: any) => ({
        id: String(msg.id),
        content: msg.content,
        sender: msg.user.username,
        timestamp: msg.createdAt,
        isOwn: msg.userId === currentUserId,
        chatId: msg.chatId,
        userId: msg.userId,
        replyTo: msg.replyTo || null,
        replyToId: msg.replyToId || null,
      }));

      set((state) => ({
        messages: [
          ...state.messages.filter((msg) => msg.chatId !== chatId),
          ...formattedMessages
        ]
      }));
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    } finally {
      set({ isLoadingMessages: false }); // ← завершение загрузки
    }
  },

  loadUsers: async () => {
    try {
      const response = await apiFetch('http://localhost:3001/api/chat/users/all');
      const users = await response.json();
      set({ users });
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  },

  addMessage: (message: ChatMessage) => {
    const { socket, currentUserId } = get();
    if (socket && currentUserId) {
      socket.emit('send_message', {
        chatId: message.chatId,
        userId: currentUserId,
        content: message.content,
        replyToId: message.replyToId || null,
      });
    }
  },

  receiveMessage: (message: any) => {
    const { selectedChatId, messages } = get();
    const isCurrentChat = message.chatId === selectedChatId;
    const tempMessageIndex = messages.findIndex(m => m.id === message.id && !m.serverId);

    const newMessage: ChatMessage = {
      id: String(message.id),
      content: message.content,
      sender: message.user.username,
      timestamp: message.createdAt,
      isOwn: message.userId === get().currentUserId,
      chatId: message.chatId,
      userId: message.userId,
      replyTo: message.replyTo || null,
      replyToId: message.replyToId || null,
    };
    if (tempMessageIndex > -1) {
      // Заменяем временное сообщение
      set((state) => ({
        messages: state.messages.map(m =>
          m.id === message.id ? newMessage : m
        )
      }));
    } else {
      set((state) => ({
        messages: [...state.messages, newMessage],
        chats: state.chats.map((chat) =>
          chat.id === message.chatId
            ? {
              ...chat,
              lastMessage: message.content,
              time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unreadCount: isCurrentChat ? 0 : chat.unreadCount + 1,
            }
            : chat
        ),
      }));
    }
  },

  clearMessages: () => set({ messages: [] }),

  selectChat: (id: number) => {
    set((state) => ({
      selectedChatId: id,
      chats: state.chats.map((chat) =>
        chat.id === id ? { ...chat, unreadCount: 0 } : chat
      ),
    }))
  },

  getMessagesForChat: (chatId: number) => {
    return get().messages.filter((msg) => msg.chatId === chatId);
  },

  createPrivateChat: async (userId1: number, userId2: number) => {
    try {
      const response = await apiFetch('http://localhost:3001/api/chat/create-private', {
        method: 'POST',
        body: JSON.stringify({ userId1, userId2 }),
      });
      const chat = await response.json();

      // Подгружаем обновлённый список чатов вместо ручного добавления
      await get().loadChats(userId1); // или userId1 === get().currentUserId ? userId1 : userId2

      return chat;
    } catch (error) {
      console.error('Ошибка создания чата:', error);
    }
  },
}));