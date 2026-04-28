import { useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { useChatStore } from '../store/chatStore';

export const useChatMessages = (selectedChatId: number | null) => {
  const { loadMessages, socket, messages } = useChatStore();
  const user = useAuthStore((state) => state.user); // если нужно для join_chat

  // Загрузка истории сообщений
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
    }
  }, [selectedChatId, loadMessages]);

  // Присоединение к чату через сокет
  useEffect(() => {
    if (selectedChatId && socket && user?.id) {
      socket.emit('join_chat', selectedChatId, Number(user.id));
    }
  }, [selectedChatId, socket, user?.id]);
};
