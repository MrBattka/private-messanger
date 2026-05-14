/**
 * Упрощённая функция отправки сообщения
 * В реальном приложении здесь может быть API-вызов
 */
export const sendMessage = (text: string, sender: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    // Имитация задержки сети
    setTimeout(() => {
      console.log(`Сообщение от ${sender}: ${text}`);
      resolve({ success: true });
    }, 500);
  });
};