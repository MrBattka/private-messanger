import { create } from 'zustand';

interface SettingState {
    isOpen: boolean;
    theme: 'light' | 'dark';
    open: () => void;
    close: () => void;
    toggle: () => void;
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

export const useSettingStore = create<SettingState>((set) => {
    const savedTheme = (localStorage.getItem('app-theme') as 'light' | 'dark') || 'light';

    return {
        isOpen: false,
        theme: savedTheme,
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
    }
});