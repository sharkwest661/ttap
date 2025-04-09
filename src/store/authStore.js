import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock API functions (to be replaced with actual API calls later)
const mockLogin = async (email, password) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock authentication - in a real app, this would call your backend
  if (email === "test@example.com" && password === "password") {
    return {
      id: "123",
      username: "TimeTraveler",
      email: "test@example.com",
      profilePicture: "https://example.com/profile.jpg",
      favoriteTimePeriods: [],
      bookedTours: [],
      points: 100,
      achievements: [],
    };
  }

  throw new Error("Invalid credentials");
};

// Auth store
export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Check if user is logged in
  isAuthenticated: () => {
    return !!get().token;
  },

  // Login action
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const user = await mockLogin(email, password);

      // For mock purposes, create a fake token
      const token = "mock-jwt-token-" + Math.random().toString(36).substring(2);

      // Save auth state to AsyncStorage for persistence
      await AsyncStorage.setItem("auth", JSON.stringify({ user, token }));

      set({ user, token, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Register action (mock)
  register: async (username, email, password) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock new user
      const user = {
        id: "new-" + Math.random().toString(36).substring(2),
        username,
        email,
        profilePicture: null,
        favoriteTimePeriods: [],
        bookedTours: [],
        points: 0,
        achievements: [],
      };

      // For mock purposes, create a fake token
      const token = "mock-jwt-token-" + Math.random().toString(36).substring(2);

      // Save auth state to AsyncStorage for persistence
      await AsyncStorage.setItem("auth", JSON.stringify({ user, token }));

      set({ user, token, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Logout action
  logout: async () => {
    await AsyncStorage.removeItem("auth");
    set({ user: null, token: null });
  },

  // Initialize auth state from AsyncStorage
  initAuth: async () => {
    set({ isLoading: true });

    try {
      const authData = await AsyncStorage.getItem("auth");

      if (authData) {
        const { user, token } = JSON.parse(authData);
        set({ user, token });
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    set({ isLoading: true });

    try {
      // In a real app, this would call your backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedUser = { ...get().user, ...userData };

      // Update AsyncStorage
      const authData = JSON.stringify({
        user: updatedUser,
        token: get().token,
      });
      await AsyncStorage.setItem("auth", authData);

      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
