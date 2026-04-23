import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void; // Добавлено для обновления аватара
}

const API_BASE = 'http://localhost:3001/api/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Login failed');

          set({
            user: { id: data.id, username: data.username, email: data.email }, // Исправлено
            isAuthenticated: true,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          set({ error: message });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Registration failed');

          set({
            user: { id: data.id, username: data.username, email: data.email }
          });
          return true;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          set({ error: message });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        // Упростил: без fetch, так как маршрута нет
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User) => {
        set({ user }); // Добавлено для обновления аватара
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);