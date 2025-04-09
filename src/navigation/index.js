import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";

// Stores
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useTourismStore } from "../store/tourismStore";
import { useBookingStore } from "../store/bookingStore";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";

// Main Screens
import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/explore/ExploreScreen";
import TimelineScreen from "../screens/timeline/TimelineScreen";
import BookingsScreen from "../screens/bookings/BookingsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

// Detail Screens
import TimePeriodDetailScreen from "../screens/explore/TimePeriodDetailScreen";
import TourDetailScreen from "../screens/explore/TourDetailScreen";
import BookingDetailScreen from "../screens/bookings/BookingDetailScreen";
import BookingConfirmationScreen from "../screens/bookings/BookingConfirmationScreen";
import BookingPaymentScreen from "../screens/bookings/BookingPaymentScreen";
import BookingSuccessScreen from "../screens/bookings/BookingSuccessScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Home tab navigator
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TimePeriodDetail"
      component={TimePeriodDetailScreen}
      options={({ route }) => ({ title: route.params?.name || "Time Period" })}
    />
    <Stack.Screen
      name="TourDetail"
      component={TourDetailScreen}
      options={({ route }) => ({
        title: route.params?.title || "Tour Details",
      })}
    />
    <Stack.Screen
      name="BookingPayment"
      component={BookingPaymentScreen}
      options={{ title: "Confirm Booking" }}
    />
    <Stack.Screen
      name="BookingConfirmation"
      component={BookingConfirmationScreen}
      options={{ title: "Review Details" }}
    />
    <Stack.Screen
      name="BookingSuccess"
      component={BookingSuccessScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Explore tab navigator
const ExploreStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ExploreScreen"
      component={ExploreScreen}
      options={{ title: "Explore Time Periods" }}
    />
    <Stack.Screen
      name="TimePeriodDetail"
      component={TimePeriodDetailScreen}
      options={({ route }) => ({ title: route.params?.name || "Time Period" })}
    />
    <Stack.Screen
      name="TourDetail"
      component={TourDetailScreen}
      options={({ route }) => ({
        title: route.params?.title || "Tour Details",
      })}
    />
  </Stack.Navigator>
);

// Timeline tab navigator
const TimelineStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TimelineScreen"
      component={TimelineScreen}
      options={{ title: "History Timeline" }}
    />
    <Stack.Screen
      name="TimePeriodDetail"
      component={TimePeriodDetailScreen}
      options={({ route }) => ({ title: route.params?.name || "Time Period" })}
    />
  </Stack.Navigator>
);

// Bookings tab navigator
const BookingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="BookingsScreen"
      component={BookingsScreen}
      options={{ title: "My Bookings" }}
    />
    <Stack.Screen
      name="BookingDetail"
      component={BookingDetailScreen}
      options={{ title: "Booking Details" }}
    />
  </Stack.Navigator>
);

// Profile tab navigator
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ title: "My Profile" }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "Settings" }}
    />
  </Stack.Navigator>
);

// Main tab navigator
const TabNavigator = () => {
  const theme = useTheme();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "Timeline") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Bookings") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: isDarkMode
            ? theme.colors.surface
            : theme.colors.background,
          borderTopColor: isDarkMode
            ? theme.colors.surfaceSecondary
            : theme.colors.disabled,
        },
        headerStyle: {
          backgroundColor: isDarkMode
            ? theme.colors.surface
            : theme.colors.background,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Timeline"
        component={TimelineStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// Main navigation container
const Navigation = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const initAuth = useAuthStore((state) => state.initAuth);
  const initTheme = useThemeStore((state) => state.initTheme);
  const initData = useTourismStore((state) => state.initData);
  const initBookings = useBookingStore((state) => state.initBookings);

  // Initialize app data on load
  useEffect(() => {
    const initialize = async () => {
      await initTheme();
      await initAuth();
      await initData();
      await initBookings();
    };

    initialize();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
