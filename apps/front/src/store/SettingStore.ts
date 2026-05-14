import { create } from 'zustand';

interface SettingState {
  isOpen: boolean;
  theme: 'light' | 'dark';
  isSoundEnabled: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  saveSettings: () => void;
}

export const useSettingStore = create<SettingState>((set, get) => {
  const savedTheme = (localStorage.getItem('app-theme') as 'light' | 'dark') || 'light';
  const savedSound = localStorage.getItem('sound-enabled') !== 'false';

  return {
    isOpen: false,
    theme: savedTheme,
    isSoundEnabled: savedSound,

    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),

    setTheme: (theme: 'light' | 'dark') => {
      localStorage.setItem('app-theme', theme);
      set({ theme });
    },

    toggleTheme: () => {
      set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('app-theme', newTheme);
        return { theme: newTheme };
      });
    },

    toggleSound: () => {
      const newState = !get().isSoundEnabled;
      localStorage.setItem('sound-enabled', String(newState));
      set({ isSoundEnabled: newState });
    },

    saveSettings: () => {
      const { theme, isSoundEnabled } = get();
      localStorage.setItem('app-theme', theme);
      localStorage.setItem('sound-enabled', String(isSoundEnabled));
    },
  };
});