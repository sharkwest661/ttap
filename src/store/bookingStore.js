import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "./authStore";

// Sample bookings (to be replaced with API calls later)
const sampleBookings = [];

// Booking store for managing tour bookings
export const useBookingStore = create((set, get) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  // Fetch user's bookings
  fetchBookings: async () => {
    set({ isLoading: true, error: null });

    try {
      // Get current user
      const userId = useAuthStore.getState().user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      // In a real app, this would be an API call
      // For now, simulate a delay and use sample data
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Filter bookings for current user
      const userBookings = sampleBookings.filter(
        (booking) => booking.userId === userId
      );

      // Cache data in AsyncStorage
      await AsyncStorage.setItem(
        `bookings_${userId}`,
        JSON.stringify(userBookings)
      );

      set({ bookings: userBookings, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });

    try {
      // Get current user
      const userId = useAuthStore.getState().user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      // In a real app, this would be an API call
      // For now, simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Create new booking
      const newBooking = {
        id: "booking-" + Math.random().toString(36).substring(2),
        userId,
        ...bookingData,
        status: "confirmed",
        qrCode: `TIME-${Math.random().toString(36).substring(2).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update local state
      const updatedBookings = [...get().bookings, newBooking];

      // Cache data in AsyncStorage
      await AsyncStorage.setItem(
        `bookings_${userId}`,
        JSON.stringify(updatedBookings)
      );

      set({
        bookings: updatedBookings,
        currentBooking: newBooking,
        isLoading: false,
      });

      return newBooking;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Cancel a booking
  cancelBooking: async (bookingId) => {
    set({ isLoading: true, error: null });

    try {
      // Get current user
      const userId = useAuthStore.getState().user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Find the booking
      const bookingIndex = get().bookings.findIndex((b) => b.id === bookingId);

      if (bookingIndex === -1) {
        throw new Error("Booking not found");
      }

      // In a real app, this would be an API call
      // For now, simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update booking status
      const updatedBookings = [...get().bookings];
      updatedBookings[bookingIndex] = {
        ...updatedBookings[bookingIndex],
        status: "canceled",
        updatedAt: new Date().toISOString(),
      };

      // Cache data in AsyncStorage
      await AsyncStorage.setItem(
        `bookings_${userId}`,
        JSON.stringify(updatedBookings)
      );

      set({ bookings: updatedBookings, isLoading: false });

      return updatedBookings[bookingIndex];
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Set current booking
  setCurrentBooking: (bookingId) => {
    const booking = get().bookings.find((b) => b.id === bookingId);
    set({ currentBooking: booking });
  },

  // Get booking by id
  getBookingById: (bookingId) => {
    return get().bookings.find((b) => b.id === bookingId);
  },

  // Get upcoming bookings (not canceled and travel date in future)
  getUpcomingBookings: () => {
    const now = new Date();
    return get().bookings.filter((b) => {
      const travelDate = new Date(b.travelDate);
      return b.status !== "canceled" && travelDate > now;
    });
  },

  // Get past bookings (travel date in past)
  getPastBookings: () => {
    const now = new Date();
    return get().bookings.filter((b) => {
      const travelDate = new Date(b.travelDate);
      return travelDate < now;
    });
  },

  // Initialize booking data from AsyncStorage
  initBookings: async () => {
    set({ isLoading: true });

    try {
      // Get current user
      const userId = useAuthStore.getState().user?.id;

      if (userId) {
        const cachedBookings = await AsyncStorage.getItem(`bookings_${userId}`);

        if (cachedBookings) {
          set({ bookings: JSON.parse(cachedBookings) });
        } else {
          // If no cached data, fetch from "API"
          await get().fetchBookings();
        }
      }
    } catch (error) {
      console.error("Error loading booking data:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
