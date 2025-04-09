import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";

import { Box, Text, Card, ThemedImage, Button } from "../../theme/components";
import { useTourismStore } from "../../store/tourismStore";

const { width } = Dimensions.get("window");

const TourDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const theme = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;

  const getTourById = useTourismStore((state) => state.getTourById);
  const getTimePeriodById = useTourismStore((state) => state.getTimePeriodById);

  const [tour, setTour] = useState(null);
  const [timePeriod, setTimePeriod] = useState(null);

  useEffect(() => {
    const tourData = getTourById(id);
    setTour(tourData);

    if (tourData) {
      const periodData = getTimePeriodById(tourData.timePeriodId);
      setTimePeriod(periodData);
    }
  }, [id]);

  if (!tour) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="background"
      >
        <Text>Loading tour details...</Text>
      </Box>
    );
  }

  const renderImageItem = ({ item }) => (
    <Box width={width} height={300} overflow="hidden">
      <ThemedImage
        source={{ uri: item }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </Box>
  );

  // Mock images if real ones aren't available
  const tourImages =
    tour.images && tour.images.length > 0
      ? tour.images
      : [
          "https://source.unsplash.com/random/600x400/?history," +
            tour.title.toLowerCase() +
            ",1",
          "https://source.unsplash.com/random/600x400/?history," +
            tour.title.toLowerCase() +
            ",2",
          "https://source.unsplash.com/random/600x400/?history," +
            tour.title.toLowerCase() +
            ",3",
        ];

  // Calculate discounted price if applicable
  const finalPrice =
    tour.discountPercentage > 0
      ? tour.price * (1 - tour.discountPercentage / 100)
      : tour.price;

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Tour Images Carousel */}
        <Box height={300}>
          <FlatList
            data={tourImages}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => "tour-image-" + index}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />

          {/* Price overlay */}
          <Box
            position="absolute"
            bottom={0}
            right={0}
            backgroundColor="primary"
            padding="m"
            borderTopLeftRadius="m"
          >
            {tour.discountPercentage > 0 && (
              <Text
                variant="caption"
                color="surface"
                textDecorationLine="line-through"
              >
                ${tour.price.toLocaleString()}
              </Text>
            )}
            <Text variant="subheader" color="surface">
              ${finalPrice.toLocaleString()}
            </Text>
          </Box>
        </Box>

        {/* Tour details */}
        <Box padding="l">
          <Text variant="header" marginBottom="s">
            {tour.title}
          </Text>

          <Box flexDirection="row" alignItems="center" marginBottom="m">
            <Box flexDirection="row" alignItems="center" marginRight="m">
              <Ionicons name="star" size={16} color={theme.colors.accent} />
              <Text variant="body" color="textSecondary" marginLeft="xs">
                {tour.rating} ({tour.reviewCount} reviews)
              </Text>
            </Box>
            <Box flexDirection="row" alignItems="center">
              <Ionicons
                name="time-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text variant="body" color="textSecondary" marginLeft="xs">
                {tour.duration} days
              </Text>
            </Box>
          </Box>

          {timePeriod && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("TimePeriodDetail", {
                  id: timePeriod.id,
                  name: timePeriod.name,
                })
              }
            >
              <Box
                flexDirection="row"
                alignItems="center"
                backgroundColor="surfaceSecondary"
                paddingVertical="s"
                paddingHorizontal="m"
                borderRadius="m"
                marginBottom="m"
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text variant="body" color="primary" marginLeft="xs">
                  {timePeriod.name}:{" "}
                  {timePeriod.startYear < 0
                    ? Math.abs(timePeriod.startYear) + " BCE"
                    : timePeriod.startYear + " CE"}{" "}
                  -
                  {timePeriod.endYear < 0
                    ? Math.abs(timePeriod.endYear) + " BCE"
                    : timePeriod.endYear + " CE"}
                </Text>
                <Box flex={1} />
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.colors.primary}
                />
              </Box>
            </TouchableOpacity>
          )}

          <Text variant="subheader" marginTop="m" marginBottom="s">
            Description
          </Text>
          <Text
            variant="body"
            color="textSecondary"
            lineHeight={22}
            marginBottom="l"
          >
            {tour.description}
          </Text>

          <Text variant="subheader" marginBottom="s">
            Tour Highlights
          </Text>
          <Box
            backgroundColor="surfaceSecondary"
            borderRadius="m"
            padding="m"
            marginBottom="l"
          >
            {tour.highlights.map((highlight, index) => (
              <Box
                key={index}
                flexDirection="row"
                marginBottom={index < tour.highlights.length - 1 ? "s" : 0}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.success}
                  style={{ marginTop: 2 }}
                />
                <Text variant="body" color="text" marginLeft="s">
                  {highlight}
                </Text>
              </Box>
            ))}
          </Box>

          <Text variant="subheader" marginBottom="s">
            Itinerary
          </Text>
          <Box
            backgroundColor="surfaceSecondary"
            borderRadius="m"
            padding="m"
            marginBottom="l"
          >
            {tour.itinerary.map((day, index) => (
              <Box
                key={index}
                marginBottom={index < tour.itinerary.length - 1 ? "m" : 0}
              >
                <Text
                  variant="subheader"
                  color="primary"
                  fontSize={16}
                  marginBottom="xs"
                >
                  {day.split(":")[0]}:
                </Text>
                <Text variant="body" color="text">
                  {day.split(":")[1] || day}
                </Text>
              </Box>
            ))}
          </Box>

          <Text variant="subheader" marginBottom="s">
            What's Included
          </Text>
          <Box
            backgroundColor="surfaceSecondary"
            borderRadius="m"
            padding="m"
            marginBottom="l"
          >
            <Box flexDirection="row" marginBottom="s">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.colors.success}
                style={{ marginTop: 2 }}
              />
              <Text variant="body" color="text" marginLeft="s">
                Professional time travel guide
              </Text>
            </Box>
            <Box flexDirection="row" marginBottom="s">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.colors.success}
                style={{ marginTop: 2 }}
              />
              <Text variant="body" color="text" marginLeft="s">
                Period-appropriate clothing and accessories
              </Text>
            </Box>
            <Box flexDirection="row" marginBottom="s">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.colors.success}
                style={{ marginTop: 2 }}
              />
              <Text variant="body" color="text" marginLeft="s">
                Language translation services
              </Text>
            </Box>
            <Box flexDirection="row" marginBottom="s">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.colors.success}
                style={{ marginTop: 2 }}
              />
              <Text variant="body" color="text" marginLeft="s">
                Accommodation and meals during the tour
              </Text>
            </Box>
            <Box flexDirection="row">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.colors.success}
                style={{ marginTop: 2 }}
              />
              <Text variant="body" color="text" marginLeft="s">
                Temporal displacement insurance
              </Text>
            </Box>
          </Box>

          <Text variant="subheader" marginBottom="s">
            Group Size
          </Text>
          <Box flexDirection="row" alignItems="center" marginBottom="l">
            <Ionicons
              name="people-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text variant="body" color="textSecondary" marginLeft="s">
              Maximum {tour.maxGroupSize} time travelers per group
            </Text>
          </Box>

          <Text
            variant="caption"
            color="textSecondary"
            marginBottom="l"
            textAlign="center"
          >
            Note: All time travel is subject to temporal regulations. Visitors
            are prohibited from altering historical events.
          </Text>
        </Box>
      </ScrollView>

      {/* Booking button fixed at bottom */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding="m"
        backgroundColor="surface"
        borderTopWidth={1}
        borderTopColor="surfaceSecondary"
      >
        <Button
          label="Book This Time Travel"
          onPress={() =>
            navigation.navigate("BookingPayment", { tourId: tour.id })
          }
        />
      </Box>
    </Box>
  );
};

export default TourDetailScreen;
