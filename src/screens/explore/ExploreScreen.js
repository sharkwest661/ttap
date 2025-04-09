import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";

import { Box, Text, Card, ThemedImage } from "../../theme/components";
import { useTourismStore } from "../../store/tourismStore";

const ExploreScreen = ({ navigation }) => {
  const theme = useTheme();

  const timePeriods = useTourismStore((state) => state.timePeriods);
  const fetchTimePeriods = useTourismStore((state) => state.fetchTimePeriods);
  const isLoading = useTourismStore((state) => state.isLoading);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPeriods, setFilteredPeriods] = useState([]);

  useEffect(() => {
    fetchTimePeriods();
  }, []);

  useEffect(() => {
    if (timePeriods.length > 0) {
      filterPeriods();
    }
  }, [timePeriods, searchQuery]);

  const filterPeriods = () => {
    if (searchQuery.trim() === "") {
      setFilteredPeriods(timePeriods);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = timePeriods.filter((period) => {
        return (
          period.name.toLowerCase().includes(query) ||
          period.description.toLowerCase().includes(query)
        );
      });
      setFilteredPeriods(filtered);
    }
  };

  // Format years to show BCE/CE
  const formatYear = (year) => {
    if (year < 0) {
      return `${Math.abs(year)} BCE`;
    } else {
      return `${year} CE`;
    }
  };

  const renderTimePeriodItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TimePeriodDetail", {
          id: item.id,
          name: item.name,
        })
      }
      style={{ marginBottom: theme.spacing.m }}
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
        <Text variant="body" color="textSecondary" numberOfLines={2}>
          {item.description}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <Box flex={1} justifyContent="center" alignItems="center" padding="l">
      <Ionicons name="search" size={60} color={theme.colors.textSecondary} />
      <Text
        variant="subheader"
        marginTop="m"
        marginBottom="s"
        textAlign="center"
      >
        No time periods found
      </Text>
      <Text variant="body" color="textSecondary" textAlign="center">
        Try adjusting your search or explore our featured time periods.
      </Text>
    </Box>
  );

  return (
    <Box flex={1} backgroundColor="background">
      {/* Search Bar */}
      <Box padding="l">
        <Box
          flexDirection="row"
          alignItems="center"
          backgroundColor="surfaceSecondary"
          borderRadius="m"
          paddingHorizontal="m"
          marginBottom="l"
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.textSecondary}
          />
          <TextInput
            style={{
              flex: 1,
              height: 48,
              marginLeft: theme.spacing.s,
              color: theme.colors.text,
              fontSize: 16,
            }}
            placeholder="Search time periods..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </Box>
      </Box>

      {/* Time Periods List */}
      {isLoading && timePeriods.length === 0 ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="body" color="textSecondary" marginTop="m">
            Loading time periods...
          </Text>
        </Box>
      ) : (
        <FlatList
          data={filteredPeriods}
          renderItem={renderTimePeriodItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: theme.spacing.l,
            paddingTop: 0,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </Box>
  );
};

export default ExploreScreen;
