import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Theme preferences store
export const useThemeStore = create((set) => ({
  isDarkMode: false,

  // Action to toggle theme
  toggleTheme: async () => {
    set((state) => {
      const newIsDarkMode = !state.isDarkMode;

      // Persist theme preference to AsyncStorage
      AsyncStorage.setItem("isDarkMode", JSON.stringify(newIsDarkMode));

      return { isDarkMode: newIsDarkMode };
    });
  },

  // Action to set specific theme
  setTheme: async (isDarkMode) => {
    set({ isDarkMode });
    AsyncStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  },

  // Initialize theme from AsyncStorage
  initTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("isDarkMode");
      if (savedTheme !== null) {
        set({ isDarkMode: JSON.parse(savedTheme) });
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  },
}));
