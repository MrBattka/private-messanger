import { useState, useEffect } from 'react';

// Упрощённая версия хука для истории сообщений
export const useChatHistory = () => {
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: string;
    timestamp: string;
    isOwn: boolean;
  }>>([]);

  useEffect(() => {
    // Имитация загрузки истории
    const initialMessages = [
      { id: 1, text: 'Привет! Как дела?', sender: 'Алиса', timestamp: '10:00', isOwn: false },
      { id: 2, text: 'Всё отлично, спасибо!', sender: 'Вы', timestamp: '10:01', isOwn: true },
    ];
    setMessages(initialMessages);
  }, []);

  const addMessage = (text: string, sender: string, isOwn: boolean = true) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return { messages, addMessage };
};