import React, { useEffect, useState } from "react";
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";

import { Box, Text, Card, ThemedImage, Button } from "../../theme/components";
import { useTourismStore } from "../../store/tourismStore";

const { width } = Dimensions.get("window");

const TimePeriodDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const theme = useTheme();

  const getTimePeriodById = useTourismStore((state) => state.getTimePeriodById);
  const fetchTours = useTourismStore((state) => state.fetchTours);
  const tours = useTourismStore((state) => state.tours);
  const isLoading = useTourismStore((state) => state.isLoading);

  const [timePeriod, setTimePeriod] = useState(null);
  const [relatedTours, setRelatedTours] = useState([]);

  useEffect(() => {
    const periodData = getTimePeriodById(id);
    setTimePeriod(periodData);

    // Fetch tours for this time period
    fetchTours(id);
  }, [id]);

  useEffect(() => {
    if (tours) {
      setRelatedTours(tours.filter((tour) => tour.timePeriodId === id));
    }
  }, [tours]);

  const renderTourItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TourDetail", { id: item.id, title: item.title })
      }
      style={{ marginBottom: theme.spacing.m }}
    >
      <Card>
        <Box flexDirection="row">
          <Box
            width={80}
            height={80}
            borderRadius="m"
            overflow="hidden"
            marginRight="m"
          >
            <ThemedImage
              source={{
                uri:
                  "https://source.unsplash.com/random/300x200/?history," +
                  item.title.toLowerCase(),
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </Box>
          <Box flex={1} justifyContent="space-between">
            <Text variant="subheader" numberOfLines={1}>
              {item.title}
            </Text>
            <Box flexDirection="row" alignItems="center" marginVertical="xs">
              <Ionicons name="star" size={16} color={theme.colors.accent} />
              <Text variant="caption" color="textSecondary" marginLeft="xs">
                {item.rating} ({item.reviewCount} reviews)
              </Text>
            </Box>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text variant="body" fontWeight="bold" color="primary">
                ${item.price.toLocaleString()}
              </Text>
              <Box flexDirection="row" alignItems="center">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.colors.textSecondary}
                />
                <Text variant="caption" color="textSecondary" marginLeft="xs">
                  {item.duration} days
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </TouchableOpacity>
  );

  const renderGalleryItem = ({ item }) => (
    <Box
      width={width * 0.8}
      height={200}
      marginRight={theme.spacing.m}
      borderRadius="l"
      overflow="hidden"
    >
      <ThemedImage
        source={{ uri: item }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </Box>
  );

  if (!timePeriod) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="background"
      >
        <Text>Loading time period details...</Text>
      </Box>
    );
  }

  // Format years to show BCE/CE
  const formatYear = (year) => {
    if (year < 0) {
      return `${Math.abs(year)} BCE`;
    } else {
      return `${year} CE`;
    }
  };

  // Mock gallery images if the real ones aren't available
  const galleryImages =
    timePeriod.galleryImages && timePeriod.galleryImages.length > 0
      ? timePeriod.galleryImages
      : [
          "https://source.unsplash.com/random/600x400/?history," +
            timePeriod.name.toLowerCase() +
            ",1",
          "https://source.unsplash.com/random/600x400/?history," +
            timePeriod.name.toLowerCase() +
            ",2",
          "https://source.unsplash.com/random/600x400/?history," +
            timePeriod.name.toLowerCase() +
            ",3",
        ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      showsVerticalScrollIndicator={false}
    >
      {/* Cover Image */}
      <Box height={250} width="100%">
        <ThemedImage
          source={{
            uri:
              timePeriod.coverImage ||
              "https://source.unsplash.com/random/600x400/?history," +
                timePeriod.name.toLowerCase(),
          }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          paddingHorizontal="l"
          paddingVertical="m"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Text variant="header" color="surface">
            {timePeriod.name}
          </Text>
          <Box flexDirection="row" alignItems="center" marginTop="xs">
            <Ionicons
              name="calendar-outline"
              size={16}
              color={theme.colors.surface}
            />
            <Text variant="body" color="surface" marginLeft="xs">
              {formatYear(timePeriod.startYear)} to{" "}
              {formatYear(timePeriod.endYear)}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Description */}
      <Box padding="l">
        <Text variant="subheader" marginBottom="m">
          About this Time Period
        </Text>
        <Text variant="body" color="textSecondary" lineHeight={22}>
          {timePeriod.description}
        </Text>
      </Box>

      {/* Gallery */}
      <Box marginBottom="l">
        <Text variant="subheader" marginLeft="l" marginBottom="m">
          Historical Gallery
        </Text>
        <FlatList
          data={galleryImages}
          renderItem={renderGalleryItem}
          keyExtractor={(item, index) => "gallery-" + index}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.l }}
        />
      </Box>

      {/* Available Tours */}
      <Box padding="l">
        <Text variant="subheader" marginBottom="m">
          Available Time Travel Tours
        </Text>

        {isLoading ? (
          <Text variant="body" color="textSecondary">
            Loading available tours...
          </Text>
        ) : relatedTours.length > 0 ? (
          relatedTours.map((tour) => (
            <TouchableOpacity
              key={tour.id}
              onPress={() =>
                navigation.navigate("TourDetail", {
                  id: tour.id,
                  title: tour.title,
                })
              }
              style={{ marginBottom: theme.spacing.m }}
            >
              <Card>
                <Box
                  height={150}
                  borderRadius="m"
                  overflow="hidden"
                  marginBottom="m"
                >
                  <ThemedImage
                    source={{
                      uri:
                        "https://source.unsplash.com/random/600x400/?history," +
                        tour.title.toLowerCase(),
                    }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  {tour.discountPercentage > 0 && (
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
                        {tour.discountPercentage}% OFF
                      </Text>
                    </Box>
                  )}
                </Box>

                <Text variant="subheader" marginBottom="xs">
                  {tour.title}
                </Text>

                <Box flexDirection="row" alignItems="center" marginBottom="s">
                  <Ionicons name="star" size={16} color={theme.colors.accent} />
                  <Text variant="caption" color="textSecondary" marginLeft="xs">
                    {tour.rating} ({tour.reviewCount} reviews)
                  </Text>
                  <Box flexDirection="row" alignItems="center" marginLeft="m">
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={theme.colors.textSecondary}
                    />
                    <Text
                      variant="caption"
                      color="textSecondary"
                      marginLeft="xs"
                    >
                      {tour.duration} days
                    </Text>
                  </Box>
                </Box>

                <Text
                  variant="body"
                  color="textSecondary"
                  numberOfLines={2}
                  marginBottom="m"
                >
                  {tour.description}
                </Text>

                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text variant="subheader" color="primary">
                    ${tour.price.toLocaleString()}
                  </Text>
                  <Button
                    label="View Details"
                    variant="primary"
                    onPress={() =>
                      navigation.navigate("TourDetail", {
                        id: tour.id,
                        title: tour.title,
                      })
                    }
                  />
                </Box>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Card>
            <Text variant="body" color="textSecondary" textAlign="center">
              No tours available for this time period yet.
            </Text>
            <Button
              label="Explore Other Time Periods"
              variant="primary"
              marginTop="m"
              onPress={() => navigation.navigate("ExploreScreen")}
            />
          </Card>
        )}
      </Box>
    </ScrollView>
  );
};

export default TimePeriodDetailScreen;
