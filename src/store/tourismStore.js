import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Sample data (to be replaced with API calls later)
const sampleTimePeriods = [
  {
    id: "1",
    name: "Ancient Egypt",
    startYear: -3100,
    endYear: -332,
    description:
      "Experience the majesty of Ancient Egypt from the Early Dynastic Period through the Late Period. Witness the construction of the pyramids, explore the temples of Luxor, and cruise the Nile during the height of pharaonic power.",
    coverImage: "https://example.com/ancient-egypt.jpg",
    galleryImages: [
      "https://example.com/egypt1.jpg",
      "https://example.com/egypt2.jpg",
    ],
    featured: true,
  },
  {
    id: "2",
    name: "Renaissance Italy",
    startYear: 1400,
    endYear: 1600,
    description:
      "Immerse yourself in the artistic and cultural rebirth of Europe. Meet the great masters like Leonardo da Vinci and Michelangelo, witness the creation of timeless works of art, and experience the intellectual revolution that shaped the modern world.",
    coverImage: "https://example.com/renaissance.jpg",
    galleryImages: [
      "https://example.com/renaissance1.jpg",
      "https://example.com/renaissance2.jpg",
    ],
    featured: true,
  },
  {
    id: "3",
    name: "Age of Exploration",
    startYear: 1400,
    endYear: 1700,
    description:
      "Join the great explorers as they venture into the unknown, mapping new continents and establishing global trade routes. Experience life aboard a ship with Columbus, Magellan, or Cook as they make world-changing discoveries.",
    coverImage: "https://example.com/exploration.jpg",
    galleryImages: [
      "https://example.com/exploration1.jpg",
      "https://example.com/exploration2.jpg",
    ],
    featured: false,
  },
  {
    id: "4",
    name: "Industrial Revolution",
    startYear: 1760,
    endYear: 1840,
    description:
      "Witness the transformation of society through mechanization and innovation. Experience the birth of modern industry, the rise of factories, and the social changes that reshaped human civilization.",
    coverImage: "https://example.com/industrial.jpg",
    galleryImages: [
      "https://example.com/industrial1.jpg",
      "https://example.com/industrial2.jpg",
    ],
    featured: false,
  },
  {
    id: "5",
    name: "Roaring Twenties",
    startYear: 1920,
    endYear: 1929,
    description:
      "Experience the jazz age in all its glory. Dance in speakeasies during Prohibition, witness the birth of modern celebrity culture, and enjoy the economic prosperity and cultural dynamism of this iconic decade.",
    coverImage: "https://example.com/twenties.jpg",
    galleryImages: [
      "https://example.com/twenties1.jpg",
      "https://example.com/twenties2.jpg",
    ],
    featured: true,
  },
];

const sampleTours = [
  {
    id: "101",
    title: "Pyramid Construction Spectacle",
    timePeriodId: "1",
    description:
      "Witness the construction of the Great Pyramid of Giza in real-time. This exclusive tour allows you to observe the ancient engineering marvel as it's being built, with special access to construction areas normally off-limits to visitors.",
    itinerary: [
      "Day 1: Arrival in Ancient Memphis, orientation and period clothing fitting",
      "Day 2: Journey to Giza plateau, observe quarry operations",
      "Day 3: Exclusive access to construction site with expert guide",
      "Day 4: Meet with ancient engineers (translator provided)",
      "Day 5: Nile cruise and return preparation",
    ],
    duration: 5,
    price: 5999,
    discountPercentage: 0,
    maxGroupSize: 8,
    highlights: [
      "Witness thousands of workers moving massive stone blocks",
      "Learn ancient construction techniques from period engineers",
      "Exclusive evening access to construction site at sunset",
      "Authentic period meals and accommodations",
    ],
    includesTimeMachine: true,
    images: [
      "https://example.com/pyramid1.jpg",
      "https://example.com/pyramid2.jpg",
    ],
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: "102",
    title: "Da Vinci's Workshop Experience",
    timePeriodId: "2",
    description:
      "Spend time in Leonardo da Vinci's workshop during his most productive period. Observe the master as he works on multiple projects, from paintings to inventions, and experience the creative atmosphere of Renaissance Florence.",
    itinerary: [
      "Day 1: Arrival in 15th century Florence, period orientation",
      "Day 2: Introduction to da Vinci's workshop and Renaissance art context",
      "Day 3: Full day observing painting techniques",
      "Day 4: Engineering and invention day with notebook session",
      "Day 5: Florence cultural experiences and return journey",
    ],
    duration: 5,
    price: 6499,
    discountPercentage: 10,
    maxGroupSize: 6,
    highlights: [
      "Watch The Last Supper or Mona Lisa being painted",
      "See da Vinci's flying machine designs in development",
      "Authentic Renaissance meals and accommodation",
      "Take home a replica of da Vinci's notebook",
    ],
    includesTimeMachine: true,
    images: [
      "https://example.com/davinci1.jpg",
      "https://example.com/davinci2.jpg",
    ],
    rating: 5.0,
    reviewCount: 95,
  },
  {
    id: "103",
    title: "Jazz Age Nightlife Tour",
    timePeriodId: "5",
    description:
      "Experience the vibrant nightlife of 1920s New York, Chicago, and New Orleans. Visit legendary speakeasies, dance to original jazz performances, and immerse yourself in the fashion and culture of the Roaring Twenties.",
    itinerary: [
      "Day 1: Arrival and 1920s fashion fitting in New York",
      "Day 2: Harlem Renaissance exploration and evening at the Cotton Club",
      "Day 3: Travel to Chicago for Al Capone era speakeasies",
      "Day 4: New Orleans jazz origins experience",
      "Day 5: Final celebration and return journey",
    ],
    duration: 5,
    price: 3999,
    discountPercentage: 15,
    maxGroupSize: 12,
    highlights: [
      "Hear Louis Armstrong and Duke Ellington perform live",
      "Learn authentic 1920s dance moves from period instructors",
      "Access to exclusive speakeasies with correct passwords",
      "Prohibition-era cocktail mixing class",
    ],
    includesTimeMachine: true,
    images: ["https://example.com/jazz1.jpg", "https://example.com/jazz2.jpg"],
    rating: 4.8,
    reviewCount: 211,
  },
];

// Tourism store for time periods and tours
export const useTourismStore = create((set, get) => ({
  timePeriods: [],
  tours: [],
  currentTimePeriod: null,
  currentTour: null,
  isLoading: false,
  error: null,

  // Fetch all time periods
  fetchTimePeriods: async () => {
    set({ isLoading: true, error: null });

    try {
      // In a real app, this would be an API call
      // For now, simulate a delay and use sample data
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Cache data in AsyncStorage
      await AsyncStorage.setItem(
        "timePeriods",
        JSON.stringify(sampleTimePeriods)
      );

      set({ timePeriods: sampleTimePeriods, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch tours for a specific time period or all tours
  fetchTours: async (timePeriodId = null) => {
    set({ isLoading: true, error: null });

    try {
      // In a real app, this would be an API call
      // For now, simulate a delay and use sample data
      await new Promise((resolve) => setTimeout(resolve, 800));

      let filteredTours = sampleTours;
      if (timePeriodId) {
        filteredTours = sampleTours.filter(
          (tour) => tour.timePeriodId === timePeriodId
        );
      }

      // Cache data in AsyncStorage
      await AsyncStorage.setItem("tours", JSON.stringify(sampleTours));

      set({ tours: filteredTours, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Set current time period
  setCurrentTimePeriod: (timePeriodId) => {
    const timePeriod = get().timePeriods.find((tp) => tp.id === timePeriodId);
    set({ currentTimePeriod: timePeriod });
  },

  // Set current tour
  setCurrentTour: (tourId) => {
    const tour = get().tours.find((t) => t.id === tourId);
    set({ currentTour: tour });
  },

  // Get a single time period by id
  getTimePeriodById: (timePeriodId) => {
    return get().timePeriods.find((tp) => tp.id === timePeriodId);
  },

  // Get a single tour by id
  getTourById: (tourId) => {
    return get().tours.find((t) => t.id === tourId);
  },

  // Get featured time periods
  getFeaturedTimePeriods: () => {
    return get().timePeriods.filter((tp) => tp.featured);
  },

  // Initialize data from AsyncStorage
  initData: async () => {
    set({ isLoading: true });

    try {
      const [cachedTimePeriods, cachedTours] = await Promise.all([
        AsyncStorage.getItem("timePeriods"),
        AsyncStorage.getItem("tours"),
      ]);

      if (cachedTimePeriods) {
        set({ timePeriods: JSON.parse(cachedTimePeriods) });
      } else {
        // If no cached data, fetch from "API"
        await get().fetchTimePeriods();
      }

      if (cachedTours) {
        set({ tours: JSON.parse(cachedTours) });
      } else {
        // If no cached data, fetch from "API"
        await get().fetchTours();
      }
    } catch (error) {
      console.error("Error loading tourism data:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
