import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';
import { apiFetch } from '../utils/apiClient';
import { subscribeWithSelector } from 'zustand/middleware';
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
  participantId?: number;
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
  selectedUserId: number | null;
  socket: Socket | null;
  currentUserId: number | null;
  isInitialized: boolean;
  isLoadingMessages: boolean;
  tempTargetUserId: number | null;
  lastSeen: { [chatId: number]: string };
  initSocket: (userId: number) => void;
  addMessage: (message: ChatMessage) => void;
  receiveMessage: (message: any) => void;
  loadChats: (userId: number) => Promise<void>;
  loadMessages: (chatId: number) => Promise<void>;
  setTempTargetUser: (userId: number | null) => void;
  loadUsers: () => Promise<void>;
  clearMessages: () => void;
  selectChat: (id: number) => void;
  selectUser: (id: number) => void;
  getMessagesForChat: (chatId: number) => ChatMessage[];
  createPrivateChat: (userId1: number, userId2: number) => Promise<{ id: number; name: string } | null>;
  markChatAsSeen: (chatId: number) => void;
}

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    messages: [],
    chats: [],
    users: [],
    selectedChatId: null,
    selectedUserId: null,
    tempTargetUserId: null,
    socket: null,
    currentUserId: null,
    isInitialized: false,
    isLoadingMessages: false,
    lastSeen: {},

    initSocket: (userId: number) => {
      return new Promise<void>((resolve, reject) => {

        // 1. Проверяем состояние хранилища
        const currentState = get();
        if (currentState.isInitialized && currentState.socket) {
          console.log('🔧 Сокет уже инициализирован, пропускаем');
          resolve();
          return;
        }

        // 2. Защита: если уже есть сокет (но не инициализирован), закрываем его
        if (currentState.socket) {
          console.warn('⚠️ Найден "висячий" сокет, закрываем...');
          currentState.socket.off(); // удаляем все обработчики
          currentState.socket.disconnect(); // отключаем
        }

        // 3. Проверка обязательных данных
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('❌ Нет токена, не можем аутентифицировать сокет');
          reject(new Error('No token'));
          return;
        }

        if (!userId) {
          console.error('❌ Не передан userId');
          reject(new Error('No userId'));
          return;
        }

        // 4. Создаём новое соединение
        const socket = io('http://localhost:3001', {
          auth: { token },
          reconnection: true,
          reconnectionDelay: 1000,
          transports: ['websocket'], // опционально: избегаем polling
        });

        // 5. Обработчик подключения
        socket.on('connect', () => {
          get().loadChats(userId).then(() => {
            const chatIds = get().chats.map(c => c.id);
            chatIds.forEach(chatId => {
              if (chatId > 0) {
                socket.emit('join_chat', chatId);
                console.log(`🔧 Присоединились к чату ${chatId} при инициализации`);
              }
            });
          });

          set({ socket, currentUserId: userId, isInitialized: true });
          resolve();
        });

        // 6. Обработчик ошибок
        socket.on('connect_error', (err) => {
          console.error('❌ Ошибка подключения сокета:', err.message);
          // Важно: не оставлять состояние "висеть"
          set({ socket: null, isInitialized: false });
          reject(err);
        });

        // 7. Подписка на события
        socket.on('new_chat', (chat: any) => {
          console.log('📩 Пришёл новый чат:', chat);
          get().loadChats(userId);
        });

        socket.on('receive_message', (message: any) => {
          get().receiveMessage(message);
        });

        socket.on('update_chat', (updatedChat: any) => {
          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === updatedChat.id ? { ...chat, ...updatedChat } : chat
            ),
          }));
        });

        // 8. Опционально: лог при отключении
        socket.on('disconnect', (reason) => {
          console.log('🔌 Сокет отключён:', reason);
          set({ isInitialized: false }); // можно оставить socket или очистить
        });
      });
    },

    loadChats: async (userId: number) => {
      try {
        const response = await apiFetch(`http://localhost:3001/api/chat/${userId}`);
        const chats = await response.json();

        // Защита: убедимся, что chats — это массив
        if (!Array.isArray(chats)) {
          console.error('Ожидался массив чатов, получено:', chats);
          set({ chats: [] });
          return;
        }

        const formattedChats = chats.map((chat: any) => {
          let displayName = chat.name;
          let participantId = null;

          if (Array.isArray(chat.members) && chat.members.length === 2) {
            const otherUser = chat.members.find((member: any) => member.userId !== userId);
            if (otherUser) {
              displayName = otherUser.user.username;
              participantId = otherUser.userId;
            }
          }

          // Сортируем сообщения по времени (новые — в конце)
          const sortedMessages = Array.isArray(chat.messages)
            ? [...chat.messages].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
            : [];

          const lastMsg = sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1] : null;

          return {
            id: chat.id,
            name: displayName,
            lastMessage: lastMsg ? lastMsg.content : 'Нет сообщений',
            time: lastMsg
              ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'никогда',
            unreadCount: chat.unreadCount || 0,
            isOnline: true,
            participantId,
          };
        });

        set({ chats: formattedChats });
      } catch (error) {
        console.error('Ошибка загрузки чатов:', error);
        set({ chats: [] }); // на случай ошибки
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
      const { users } = get();
      if (users.length > 0) return; // ✅ Кэш: не грузим повторно

      try {
        const response = await apiFetch('http://localhost:3001/api/chat/users/all');
        const newUsers = await response.json();

        if (Array.isArray(newUsers)) {
          set({ users: newUsers });
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
      }
    },
    addMessage: (message: Omit<ChatMessage, 'sender' | 'timestamp' | 'isOwn' | 'userId'> & { id?: string }) => {
      const { socket, currentUserId, selectedChatId } = get();
      if (!socket || !currentUserId || !selectedChatId) return;

      const tempId = message.id || Date.now().toString();

      // Формируем полное сообщение
      const tempMessage: ChatMessage = {
        id: tempId,
        content: message.content,
        sender: 'Вы', // можно улучшить: get().users.find(u => u.id === currentUserId)?.username
        timestamp: new Date().toISOString(),
        isOwn: true,
        chatId: message.chatId,
        userId: currentUserId,
        replyTo: message.replyTo || null,
        replyToId: message.replyToId || null,
      };

      // Добавляем в хранилище
      set((state) => ({
        messages: [...state.messages, tempMessage],
      }));

      // Отправляем на сервер
      socket.emit('send_message', {
        chatId: message.chatId,
        content: message.content,
        replyToId: message.replyToId || null,
        tempId,
      });
    },

    receiveMessage: (message: any) => {
      const { selectedChatId, messages, currentUserId } = get();
      const isCurrentChat = message.chatId === selectedChatId;
      const isOwnMessage = message.userId === currentUserId;

      const newMessage: ChatMessage = {
        id: String(message.id),
        content: message.content,
        sender: message.user.username,
        timestamp: message.createdAt,
        isOwn: isOwnMessage,
        chatId: message.chatId,
        userId: message.userId,
        replyTo: message.replyTo || null,
        replyToId: message.replyToId || null,
      };

      // 🔍 Ищем по tempId, если это наше сообщение
      const tempMessageIndex = messages.findIndex(m => m.id === message.tempId);

      if (tempMessageIndex > -1) {
        // 🔄 Заменяем временное сообщение на серверное
        set((state) => ({
          messages: state.messages.map(m =>
            m.id === message.tempId ? newMessage : m
          ),
        }));
      } else {
        // 📥 Новое сообщение от другого пользователя
        const exists = messages.some(m => m.id === newMessage.id);
        if (exists) return;

        set((state) => ({
          messages: [...state.messages, newMessage],
          chats: state.chats.map((chat) =>
            chat.id === message.chatId
              ? {
                ...chat,
                lastMessage: message.content,
                time: new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                unreadCount: chat.id === selectedChatId ? 0 : chat.unreadCount + 1,
              }
              : chat
          ),
        }));
      }
    },

    clearMessages: () => set({ messages: [] }),

    selectChat: (id: number) => {
      // 🔒 Защита от недопустимых ID
      if (id <= 0) {
        set({ selectedChatId: id });
        return;
      }

      set((state) => ({
        selectedChatId: id,
        chats: state.chats.map((chat) =>
          chat.id === id ? { ...chat, unreadCount: 0 } : chat
        ),
      }));

      get().markChatAsSeen(id);

      const socket = get().socket;
      if (socket) {
        socket.emit('join_chat', id);
      }
    },

    selectUser: (id: number) => {
      set((state) => ({
        selectedUserId: id,
        users: state.users.map((user) =>
          user.id === id ? { ...user, unreadCount: 0 } : user
        ),
      }));
    },

    getMessagesForChat: (chatId: number) => {
      return get().messages.filter((msg) => msg.chatId === chatId);
    },
    setTempTargetUser: (userId) => set({ tempTargetUserId: userId }),

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
    markChatAsSeen: (chatId: number) => {
      if (chatId <= 0) return; // 🔒 Выход, если chatId некорректный

      const currentUserId = get().currentUserId;
      if (!currentUserId) return;

      const token = localStorage.getItem('token');
      fetch(`http://localhost:3001/api/chat/${chatId}/mark-seen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: currentUserId }),
        credentials: 'include',
      }).catch(console.error);

      set({
        lastSeen: {
          ...get().lastSeen,
          [chatId]: new Date().toISOString(),
        },
        chats: get().chats.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        ),
      });
    },
  }))
);