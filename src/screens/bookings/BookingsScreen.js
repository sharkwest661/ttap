import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";

import { Box, Text, Card } from "../../theme/components";
import { useBookingStore } from "../../store/bookingStore";

const BookingsScreen = ({ navigation }) => {
  const theme = useTheme();

  const bookings = useBookingStore((state) => state.bookings);
  const fetchBookings = useBookingStore((state) => state.fetchBookings);
  const isLoading = useBookingStore((state) => state.isLoading);
  const getUpcomingBookings = useBookingStore(
    (state) => state.getUpcomingBookings
  );
  const getPastBookings = useBookingStore((state) => state.getPastBookings);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [displayedBookings, setDisplayedBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      if (activeTab === "upcoming") {
        setDisplayedBookings(getUpcomingBookings());
      } else {
        setDisplayedBookings(getPastBookings());
      }
    }
  }, [bookings, activeTab]);

  const renderBookingItem = ({ item }) => {
    const travelDate = new Date(item.travelDate);
    const isPast = travelDate < new Date();
    const isCanceled = item.status === "canceled";

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("BookingDetail", { id: item.id })}
        style={{ marginBottom: theme.spacing.m }}
      >
        <Card>
          <Box>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="s"
            >
              <Text variant="subheader" numberOfLines={1} style={{ flex: 1 }}>
                {item.tourTitle}
              </Text>
              {isCanceled ? (
                <Box
                  backgroundColor="error"
                  paddingHorizontal="s"
                  paddingVertical="xs"
                  borderRadius="s"
                >
                  <Text variant="caption" color="surface">
                    Canceled
                  </Text>
                </Box>
              ) : isPast ? (
                <Box
                  backgroundColor="textSecondary"
                  paddingHorizontal="s"
                  paddingVertical="xs"
                  borderRadius="s"
                >
                  <Text variant="caption" color="surface">
                    Completed
                  </Text>
                </Box>
              ) : (
                <Box
                  backgroundColor="success"
                  paddingHorizontal="s"
                  paddingVertical="xs"
                  borderRadius="s"
                >
                  <Text variant="caption" color="surface">
                    Confirmed
                  </Text>
                </Box>
              )}
            </Box>

            <Box flexDirection="row" marginBottom="m">
              <Box flexDirection="row" alignItems="center" marginRight="m">
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={theme.colors.textSecondary}
                />
                <Text variant="body" color="textSecondary" marginLeft="xs">
                  {travelDate.toLocaleDateString()}
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center">
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={theme.colors.textSecondary}
                />
                <Text variant="body" color="textSecondary" marginLeft="xs">
                  {item.numberOfTravelers}{" "}
                  {item.numberOfTravelers === 1 ? "traveler" : "travelers"}
                </Text>
              </Box>
            </Box>

            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text variant="body" fontWeight="bold" color="primary">
                ${item.totalPrice.toLocaleString()}
              </Text>
              <Box flexDirection="row" alignItems="center">
                <Text variant="body" color="textSecondary" marginRight="xs">
                  Details
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.colors.textSecondary}
                />
              </Box>
            </Box>
          </Box>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <Box flex={1} justifyContent="center" alignItems="center" padding="l">
      <Ionicons
        name={activeTab === "upcoming" ? "calendar-outline" : "time-outline"}
        size={60}
        color={theme.colors.textSecondary}
      />
      <Text
        variant="subheader"
        marginTop="m"
        marginBottom="s"
        textAlign="center"
      >
        {activeTab === "upcoming"
          ? "No upcoming time travels"
          : "No past time travels"}
      </Text>
      <Text
        variant="body"
        color="textSecondary"
        textAlign="center"
        marginBottom="l"
      >
        {activeTab === "upcoming"
          ? "Explore our amazing time periods and book your journey through history!"
          : "Once you complete a time travel, it will appear here."}
      </Text>
      {activeTab === "upcoming" && (
        <TouchableOpacity onPress={() => navigation.navigate("Explore")}>
          <Box
            backgroundColor="primary"
            paddingHorizontal="l"
            paddingVertical="m"
            borderRadius="m"
          >
            <Text variant="body" color="surface">
              Explore Time Periods
            </Text>
          </Box>
        </TouchableOpacity>
      )}
    </Box>
  );

  if (isLoading && bookings.length === 0) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="background"
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" color="textSecondary" marginTop="m">
          Loading your bookings...
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="background">
      {/* Tabs */}
      <Box
        flexDirection="row"
        borderBottomWidth={1}
        borderBottomColor="surfaceSecondary"
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setActiveTab("upcoming")}
        >
          <Box
            padding="m"
            alignItems="center"
            borderBottomWidth={2}
            borderBottomColor={
              activeTab === "upcoming" ? "primary" : "transparent"
            }
          >
            <Text
              variant="body"
              color={activeTab === "upcoming" ? "primary" : "textSecondary"}
            >
              Upcoming
            </Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setActiveTab("past")}
        >
          <Box
            padding="m"
            alignItems="center"
            borderBottomWidth={2}
            borderBottomColor={activeTab === "past" ? "primary" : "transparent"}
          >
            <Text
              variant="body"
              color={activeTab === "past" ? "primary" : "textSecondary"}
            >
              Past
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>

      {/* Booking List */}
      <FlatList
        data={displayedBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: theme.spacing.l,
          flexGrow: 1,
        }}
        ListEmptyComponent={renderEmptyList}
      />
    </Box>
  );
};

export default BookingsScreen;
