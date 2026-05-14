/**
 * Глобальные типы и объявления
 */
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

declare global {
  interface Window {
    // Можно добавить глобальные переменные, если нужно
n    // например: analytics?: (...args: any[]) => void;
  }
}

export {};
