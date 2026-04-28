import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { useChatStore } from '../store/chatStore';

export const useChatInitialization = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { initSocket, loadChats, loadUsers } = useChatStore();

  useEffect(() => {
    if (!isAuthenticated || !user || !user.id) {
      navigate('/login');
      return;
    }

    const userId = Number(user.id); // безопасное приведение
    initSocket(userId);
    loadChats(userId);
    loadUsers();
  }, [isAuthenticated, user, navigate]);
};