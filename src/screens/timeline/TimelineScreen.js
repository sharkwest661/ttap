import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";

import { Box, Text, Card, ThemedImage } from "../../theme/components";
import { useTourismStore } from "../../store/tourismStore";

const { width } = Dimensions.get("window");

const TimelineScreen = ({ navigation }) => {
  const theme = useTheme();
  const scrollX = useRef(new Animated.Value(0)).current;

  const timePeriods = useTourismStore((state) => state.timePeriods);
  const fetchTimePeriods = useTourismStore((state) => state.fetchTimePeriods);
  const isLoading = useTourismStore((state) => state.isLoading);

  const [sortedTimePeriods, setSortedTimePeriods] = useState([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    fetchTimePeriods();
  }, []);

  useEffect(() => {
    if (timePeriods.length > 0) {
      // Sort time periods chronologically by start year
      const sorted = [...timePeriods].sort((a, b) => a.startYear - b.startYear);
      setSortedTimePeriods(sorted);
    }
  }, [timePeriods]);

  // Format years to show BCE/CE
  const formatYear = (year) => {
    if (year < 0) {
      return `${Math.abs(year)} BCE`;
    } else {
      return `${year} CE`;
    }
  };

  const renderTimelineItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TimePeriodDetail", {
          id: item.id,
          name: item.name,
        })
      }
      style={{ width: 100, alignItems: "center", marginRight: theme.spacing.m }}
    >
      <Box
        width={80}
        height={80}
        borderRadius="round"
        overflow="hidden"
        borderWidth={2}
        borderColor="primary"
        marginBottom="s"
      >
        <ThemedImage
          source={{
            uri:
              item.coverImage ||
              "https://source.unsplash.com/random/200x200/?history," +
                item.name.toLowerCase(),
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </Box>
      <Text variant="caption" textAlign="center" numberOfLines={2}>
        {item.name}
      </Text>
      <Text variant="caption" color="textSecondary" textAlign="center">
        {formatYear(item.startYear)}
      </Text>
    </TouchableOpacity>
  );

  const renderTimePeriodCard = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TimePeriodDetail", {
          id: item.id,
          name: item.name,
        })
      }
      style={{ width: width - 40, marginHorizontal: 20, marginVertical: 10 }}
    >
      <Card>
        <Box height={150} borderRadius="m" overflow="hidden" marginBottom="m">
          <ThemedImage
            source={{
              uri:
                item.coverImage ||
                "https://source.unsplash.com/random/600x400/?history," +
                  item.name.toLowerCase(),
            }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </Box>
        <Text variant="subheader" marginBottom="s">
          {item.name}
        </Text>
        <Box flexDirection="row" alignItems="center" marginBottom="m">
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text variant="caption" color="textSecondary" marginLeft="xs">
            {formatYear(item.startYear)} - {formatYear(item.endYear)}
          </Text>
        </Box>
        <Text variant="body" color="textSecondary" numberOfLines={3}>
          {item.description}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  const onTimelineItemPress = (index) => {
    if (timelineRef.current) {
      timelineRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  return (
    <Box flex={1} backgroundColor="background">
      <Box paddingHorizontal="l" paddingTop="l">
        <Text variant="header" marginBottom="s">
          History Timeline
        </Text>
        <Text variant="body" color="textSecondary" marginBottom="l">
          Explore different time periods chronologically
        </Text>
      </Box>

      {/* Timeline Slider */}
      <Box
        height={130}
        borderBottomWidth={1}
        borderBottomColor="surfaceSecondary"
      >
        <FlatList
          ref={timelineRef}
          data={sortedTimePeriods}
          renderItem={renderTimelineItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.l,
            alignItems: "center",
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />

        {/* Timeline Line */}
        <Box
          position="absolute"
          left={0}
          right={0}
          height={2}
          backgroundColor="surfaceSecondary"
          top="50%"
          zIndex={-1}
        />
      </Box>

      {/* Time Period Cards */}
      <FlatList
        data={sortedTimePeriods}
        renderItem={renderTimePeriodCard}
        keyExtractor={(item) => `card-${item.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: theme.spacing.m }}
      />
    </Box>
  );
};

export default TimelineScreen;
