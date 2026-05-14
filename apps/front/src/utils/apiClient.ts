import { useAuthStore } from '../store/AuthStore';

// Универсальная функция для API-запросов с токеном
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().user ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Что-то пошло не так');
  }

  return response;
};