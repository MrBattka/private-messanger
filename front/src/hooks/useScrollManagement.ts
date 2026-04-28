import { useEffect, useRef, useState } from 'react';

export const useScrollManagement = (messages: any[], selectedChatId: number | null) => {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Проверка положения прокрутки
  useEffect(() => {
    const list = messageListRef.current;
    if (!list) return;

    const checkScroll = () => {
      const threshold = 100;
      const isAtBottom = list.scrollHeight - list.scrollTop - list.clientHeight < threshold;
      setShowScrollDown(!isAtBottom);
    };

    list.addEventListener('scroll', checkScroll);
    checkScroll();

    return () => {
      list.removeEventListener('scroll', checkScroll);
    };
  }, [selectedChatId]);

  // Авто-скролл при новых сообщениях
  useEffect(() => {
    if (messageListRef.current && !showScrollDown) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, selectedChatId, showScrollDown]);

  // Функция скролла вниз
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return { messageListRef, showScrollDown, scrollToBottom };
};