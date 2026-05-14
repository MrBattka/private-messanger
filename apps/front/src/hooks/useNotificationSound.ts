import { useEffect } from 'react';
import { useSettingStore } from '../store/SettingStore';

const notificationSound = new Audio('/sounds/notification1.wav');

export const useNotificationSound = () => {
  const isSoundEnabled = useSettingStore((state) => state.isSoundEnabled);

  // Функция для воспроизведения звука
  const playSound = () => {
    if (!isSoundEnabled) return;

    notificationSound.currentTime = 0; // Перемотка в начало
    notificationSound.play().catch((err) => {
      console.log('Автовоспроизведение заблокировано:', err);
    });
  };

  // Разблокировка при первом клике
  useEffect(() => {
    const handleFirstClick = () => {
      // Попробуем проиграть звук тихо — чтобы разблокировать
      notificationSound.volume = 0;
      notificationSound.play().then(() => {
        notificationSound.pause();
        notificationSound.currentTime = 0;
        notificationSound.volume = 1;
        console.log('Аудио разблокировано');
      }).catch(() => {
        // Не удалось — ничего страшного, попробуем позже
      });

      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);
    return () => document.removeEventListener('click', handleFirstClick);
  }, []);

  return { playSound };
};