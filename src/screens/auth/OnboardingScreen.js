import React, { useState, useRef } from "react";
import { FlatList, useWindowDimensions, Animated } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";

import {
  Box,
  Text,
  Button,
  ThemedImage,
  TouchableBox,
} from "../../theme/components";

// Onboarding data
const onboardingData = [
  {
    id: "1",
    title: "Welcome to Time Tourism",
    description:
      "Discover the ultimate time travel adventure platform. Book journeys through history with just a few taps.",
    image: require("../../../assets/onboarding1.png"), // Make sure to create these assets
  },
  {
    id: "2",
    title: "Explore Historical Periods",
    description:
      "Browse through different eras and learn fascinating details about history's most interesting time periods.",
    image: require("../../../assets/onboarding2.png"),
  },
  {
    id: "3",
    title: "Book Time Travel Tours",
    description:
      "Choose from a variety of tours, from witnessing the construction of the pyramids to experiencing the Renaissance firsthand.",
    image: require("../../../assets/onboarding3.png"),
  },
  {
    id: "4",
    title: "Experience History Safely",
    description:
      "All our time travel experiences adhere to strict temporal regulations ensuring your safety and the integrity of the timeline.",
    image: require("../../../assets/onboarding4.png"),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = (index) => {
    if (slidesRef.current) {
      slidesRef.current.scrollToIndex({ index });
    }
  };

  const renderDotIndicator = () => {
    return (
      <Box flexDirection="row" marginTop="xl" justifyContent="center">
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index.toString()}
              style={{
                height: 10,
                width: dotWidth,
                borderRadius: 5,
                backgroundColor: theme.colors.primary,
                marginHorizontal: 8,
                opacity,
              }}
            />
          );
        })}
      </Box>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Box
        width={width}
        padding="l"
        alignItems="center"
        justifyContent="center"
      >
        <ThemedImage
          source={item.image}
          width={width * 0.8}
          height={width * 0.8}
          resizeMode="contain"
          marginBottom="xl"
        />
        <Text
          variant="header"
          color="primary"
          marginBottom="m"
          textAlign="center"
        >
          {item.title}
        </Text>
        <Text variant="body" color="textSecondary" textAlign="center">
          {item.description}
        </Text>
      </Box>
    );
  };

  const renderNextButton = () => {
    const isLastSlide = currentIndex === onboardingData.length - 1;

    return (
      <Box alignItems="center" marginVertical="xl">
        {isLastSlide ? (
          <Button
            label="Get Started"
            onPress={() => navigation.navigate("Login")}
            width={width * 0.8}
          />
        ) : (
          <TouchableBox
            backgroundColor="primary"
            width={60}
            height={60}
            borderRadius="round"
            justifyContent="center"
            alignItems="center"
            onPress={() => scrollTo(currentIndex + 1)}
          >
            <Ionicons
              name="arrow-forward"
              size={24}
              color={theme.colors.surface}
            />
          </TouchableBox>
        )}

        {!isLastSlide && (
          <TouchableBox
            marginTop="l"
            onPress={() => navigation.navigate("Login")}
          >
            <Text variant="body" color="primary">
              Skip
            </Text>
          </TouchableBox>
        )}
      </Box>
    );
  };

  return (
    <Box flex={1} backgroundColor="background">
      <Box flex={3}>
        <FlatList
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </Box>

      <Box flex={1} justifyContent="space-between">
        {renderDotIndicator()}
        {renderNextButton()}
      </Box>
    </Box>
  );
};

export default OnboardingScreen;
