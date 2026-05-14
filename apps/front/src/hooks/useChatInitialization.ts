import { useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { useChatStore } from '../store/chatStore';

export const useChatInitialization = () => {
  const { user } = useAuthStore();
  const { initSocket, loadChats, loadUsers } = useChatStore(); // ← добавь loadUsers

  useEffect(() => {
    if (!user?.id) return;

    let isSubscribed = true;

    const initialize = async () => {
      try {
        await initSocket(user.id);

        if (isSubscribed) {
          await loadChats(user.id);
          await loadUsers(); // ← добавь это
        }
      } catch (error) {
        console.error('Ошибка инициализации:', error);
      }
    };

    initialize();

    return () => {
      isSubscribed = false;
    };
  }, [user?.id, initSocket, loadChats, loadUsers]); // ← добавь в зависимости
};