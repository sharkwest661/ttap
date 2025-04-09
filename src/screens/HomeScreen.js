import React, { useEffect } from "react";
import {
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";

import {
  Box,
  Text,
  Card,
  ThemedImage,
  TouchableBox,
} from "../theme/components";
import { useAuthStore } from "../store/authStore";
import { useTourismStore } from "../store/tourismStore";
import { useBookingStore } from "../store/bookingStore";

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const timePeriods = useTourismStore((state) => state.timePeriods);
  const tours = useTourismStore((state) => state.tours);
  const isLoading = useTourismStore((state) => state.isLoading);
  const fetchTimePeriods = useTourismStore((state) => state.fetchTimePeriods);
  const fetchTours = useTourismStore((state) => state.fetchTours);
  const getFeaturedTimePeriods = useTourismStore(
    (state) => state.getFeaturedTimePeriods
  );
  const upcomingBookings = useBookingStore((state) =>
    state.getUpcomingBookings()
  );

  useEffect(() => {
    fetchTimePeriods();
    fetchTours();
  }, []);

  const renderFeaturedTimePeriod = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TimePeriodDetail", {
          id: item.id,
          name: item.name,
        })
      }
      style={{ width: 280, marginRight: 15 }}
    >
      <Card>
        <Box height={150} borderRadius="m" overflow="hidden" marginBottom="s">
          <ThemedImage
            source={{
              uri:
                "https://source.unsplash.com/random/300x200/?history," +
                item.name.toLowerCase(),
            }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          {item.featured && (
            <Box
              position="absolute"
              top={0}
              right={0}
              backgroundColor="primary"
              paddingHorizontal="s"
              paddingVertical="xs"
              borderBottomLeftRadius="s"
            >
              <Text variant="caption" color="surface">
                Featured
              </Text>
            </Box>
          )}
        </Box>
        <Text variant="subheader" marginBottom="xs">
          {item.name}
        </Text>
        <Text variant="caption" color="textSecondary">
          {item.startYear < 0
            ? Math.abs(item.startYear) + " BCE"
            : item.startYear + " CE"}{" "}
          -
          {item.endYear < 0
            ? Math.abs(item.endYear) + " BCE"
            : item.endYear + " CE"}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  const renderPopularTour = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TourDetail", {
          id: item.id,
          title: item.title,
        })
      }
      style={{ width: 300, marginRight: 15 }}
    >
      <Card>
        <Box height={180} borderRadius="m" overflow="hidden" marginBottom="s">
          <ThemedImage
            source={{
              uri:
                "https://source.unsplash.com/random/300x200/?history," +
                item.title.toLowerCase(),
            }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          {item.discountPercentage > 0 && (
            <Box
              position="absolute"
              top={0}
              right={0}
              backgroundColor="secondary"
              paddingHorizontal="s"
              paddingVertical="xs"
              borderBottomLeftRadius="s"
            >
              <Text variant="caption" color="text" fontWeight="bold">
                {item.discountPercentage}% OFF
              </Text>
            </Box>
          )}
        </Box>
        <Text variant="subheader" marginBottom="xs" numberOfLines={1}>
          {item.title}
        </Text>
        <Box flexDirection="row" alignItems="center" marginBottom="xs">
          <Ionicons name="star" size={16} color={theme.colors.accent} />
          <Text variant="caption" color="textSecondary" marginLeft="xs">
            {item.rating} ({item.reviewCount} reviews)
          </Text>
        </Box>
        <Text variant="body" fontWeight="bold" color="primary">
          ${item.price.toLocaleString()}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading && timePeriods.length === 0) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="background"
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" marginTop="m" color="textSecondary">
          Loading time travel options...
        </Text>
      </Box>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Box
        paddingHorizontal="l"
        paddingTop="xl"
        paddingBottom="l"
        backgroundColor="primary"
      >
        <Text variant="header" color="surface" marginBottom="s">
          Welcome, {user?.username || "Time Traveler"}!
        </Text>
        <Text variant="body" color="surface" opacity={0.8}>
          Where (or when) would you like to explore today?
        </Text>
      </Box>

      {/* Search Bar (for future implementation) */}
      <Box padding="l">
        <TouchableBox
          flexDirection="row"
          alignItems="center"
          backgroundColor="surfaceSecondary"
          padding="m"
          borderRadius="m"
          onPress={() => navigation.navigate("Explore")}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.textSecondary}
          />
          <Text variant="body" color="textSecondary" marginLeft="m">
            Search for time periods or tours...
          </Text>
        </TouchableBox>
      </Box>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <Box marginBottom="l">
          <Box paddingHorizontal="l" marginBottom="m">
            <Text variant="subheader">Your Upcoming Time Travels</Text>
          </Box>
          <TouchableOpacity
            onPress={() => navigation.navigate("Bookings")}
            style={{ paddingHorizontal: theme.spacing.l }}
          >
            <Card>
              <Box flexDirection="row" alignItems="center">
                <Box
                  width={50}
                  height={50}
                  borderRadius="round"
                  backgroundColor="primary"
                  justifyContent="center"
                  alignItems="center"
                  marginRight="m"
                >
                  <Ionicons
                    name="calendar"
                    size={24}
                    color={theme.colors.surface}
                  />
                </Box>
                <Box flex={1}>
                  <Text variant="subheader" numberOfLines={1}>
                    {upcomingBookings[0].tourTitle || "Your Next Adventure"}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    Departing{" "}
                    {new Date(
                      upcomingBookings[0].travelDate
                    ).toLocaleDateString()}
                  </Text>
                </Box>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </Box>
            </Card>
          </TouchableOpacity>
        </Box>
      )}

      {/* Featured Time Periods */}
      <Box marginBottom="l">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="l"
          marginBottom="m"
        >
          <Text variant="subheader">Featured Time Periods</Text>
          <TouchableBox onPress={() => navigation.navigate("Explore")}>
            <Text variant="body" color="primary">
              See All
            </Text>
          </TouchableBox>
        </Box>
        <FlatList
          data={getFeaturedTimePeriods()}
          renderItem={renderFeaturedTimePeriod}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.l }}
        />
      </Box>

      {/* Popular Tours */}
      <Box marginBottom="l">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="l"
          marginBottom="m"
        >
          <Text variant="subheader">Popular Time Travel Tours</Text>
          <TouchableBox onPress={() => navigation.navigate("Explore")}>
            <Text variant="body" color="primary">
              See All
            </Text>
          </TouchableBox>
        </Box>
        <FlatList
          data={tours.slice(0, 5)}
          renderItem={renderPopularTour}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.l }}
        />
      </Box>

      {/* Time Travel Safety */}
      <Box padding="l">
        <Card>
          <Box flexDirection="row">
            <Box
              width={50}
              height={50}
              borderRadius="round"
              backgroundColor="info"
              justifyContent="center"
              alignItems="center"
              marginRight="m"
            >
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={theme.colors.surface}
              />
            </Box>
            <Box flex={1}>
              <Text variant="subheader" marginBottom="xs">
                Time Travel Safety Reminder
              </Text>
              <Text variant="body" color="textSecondary">
                All our tours follow strict temporal regulations to ensure your
                safety and the integrity of the historical timeline.
              </Text>
            </Box>
          </Box>
        </Card>
      </Box>
    </ScrollView>
  );
};

export default HomeScreen;
