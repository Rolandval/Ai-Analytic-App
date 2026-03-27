import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';
import { darkColors, lightColors, type ThemeColors } from '@/theme/colors';

interface ThemeState {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      colors: darkColors,
      toggleTheme: () =>
        set((state) => ({
          isDark: !state.isDark,
          colors: state.isDark ? lightColors : darkColors,
        })),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ isDark: state.isDark }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.colors = state.isDark ? darkColors : lightColors;
        }
      },
    }
  )
);
