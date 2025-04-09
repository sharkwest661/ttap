import React, { useState, useEffect } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Box, Text, Card, Input, Button } from "../../theme/components";
import { useTourismStore } from "../../store/tourismStore";

const BookingPaymentScreen = ({ route, navigation }) => {
  const { tourId } = route.params;
  const theme = useTheme();

  const getTourById = useTourismStore((state) => state.getTourById);

  const [tour, setTour] = useState(null);
  const [travelDate, setTravelDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [travelers, setTravelers] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Credit card form state (just for UI, not actually processing payments)
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const tourData = getTourById(tourId);
    setTour(tourData);

    if (tourData) {
      // Calculate initial price
      const discountedPrice =
        tourData.discountPercentage > 0
          ? tourData.price * (1 - tourData.discountPercentage / 100)
          : tourData.price;

      setTotalPrice(discountedPrice);
    }
  }, [tourId]);

  useEffect(() => {
    if (tour) {
      // Calculate price based on number of travelers
      const discountedPrice =
        tour.discountPercentage > 0
          ? tour.price * (1 - tour.discountPercentage / 100)
          : tour.price;

      setTotalPrice(discountedPrice * travelers);
    }
  }, [travelers, tour]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || travelDate;
    setShowDatePicker(Platform.OS === "ios");
    setTravelDate(currentDate);
  };

  const handleTravelersChange = (value) => {
    const newValue = parseInt(value);
    if (
      !isNaN(newValue) &&
      newValue > 0 &&
      newValue <= (tour?.maxGroupSize || 10)
    ) {
      setTravelers(newValue);
    }
  };

  const handleContinue = () => {
    navigation.navigate("BookingConfirmation", {
      tourId,
      travelDate,
      travelers,
      totalPrice,
    });
  };

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
          contentContainerStyle={{ padding: theme.spacing.l }}
          showsVerticalScrollIndicator={false}
        >
          {/* Tour Summary */}
          <Card marginBottom="l">
            <Text variant="subheader" marginBottom="m">
              Tour Summary
            </Text>
            <Box flexDirection="row" marginBottom="m">
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
                      tour.images?.[0] ||
                      "https://source.unsplash.com/random/300x200/?history," +
                        tour.title.toLowerCase(),
                  }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </Box>
              <Box flex={1} justifyContent="space-between">
                <Text variant="subheader" numberOfLines={2}>
                  {tour.title}
                </Text>
                <Box flexDirection="row" alignItems="center">
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text variant="caption" color="textSecondary" marginLeft="xs">
                    {tour.duration} days
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box
              height={1}
              backgroundColor="surfaceSecondary"
              marginVertical="m"
            />

            {/* Travel Date Selection */}
            <Text variant="body" color="textSecondary" marginBottom="xs">
              Travel Date
            </Text>
            <TouchableWithoutFeedback onPress={() => setShowDatePicker(true)}>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                backgroundColor="surfaceSecondary"
                padding="m"
                borderRadius="m"
                marginBottom="m"
              >
                <Text variant="body" color="text">
                  {travelDate.toDateString()}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </Box>
            </TouchableWithoutFeedback>

            {showDatePicker && (
              <DateTimePicker
                value={travelDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            {/* Number of Travelers */}
            <Text variant="body" color="textSecondary" marginBottom="xs">
              Number of Travelers
            </Text>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginBottom="m"
            >
              <Input
                keyboardType="number-pad"
                value={travelers.toString()}
                onChangeText={handleTravelersChange}
                backgroundColor="surfaceSecondary"
                color="text"
                padding="m"
                borderRadius="m"
                width="100%"
              />
              <Text
                variant="caption"
                color="textSecondary"
                marginLeft="s"
                position="absolute"
                right={16}
              >
                Max: {tour.maxGroupSize}
              </Text>
            </Box>

            <Box
              height={1}
              backgroundColor="surfaceSecondary"
              marginVertical="m"
            />

            {/* Price Summary */}
            <Box marginBottom="m">
              <Box
                flexDirection="row"
                justifyContent="space-between"
                marginBottom="s"
              >
                <Text variant="body" color="textSecondary">
                  Base Price
                </Text>
                <Text variant="body" color="text">
                  ${tour.price.toLocaleString()}
                </Text>
              </Box>

              {tour.discountPercentage > 0 && (
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  marginBottom="s"
                >
                  <Text variant="body" color="textSecondary">
                    Discount
                  </Text>
                  <Text variant="body" color="error">
                    -$
                    {(
                      (tour.price * tour.discountPercentage) /
                      100
                    ).toLocaleString()}
                  </Text>
                </Box>
              )}

              <Box
                flexDirection="row"
                justifyContent="space-between"
                marginBottom="s"
              >
                <Text variant="body" color="textSecondary">
                  Travelers
                </Text>
                <Text variant="body" color="text">
                  × {travelers}
                </Text>
              </Box>

              <Box
                height={1}
                backgroundColor="surfaceSecondary"
                marginVertical="s"
              />

              <Box flexDirection="row" justifyContent="space-between">
                <Text variant="subheader">Total</Text>
                <Text variant="subheader" color="primary">
                  ${totalPrice.toLocaleString()}
                </Text>
              </Box>
            </Box>
          </Card>

          {/* Payment Information */}
          <Card marginBottom="l">
            <Text variant="subheader" marginBottom="m">
              Payment Information
            </Text>

            <Box marginBottom="m">
              <Text variant="body" color="textSecondary" marginBottom="xs">
                Card Number
              </Text>
              <Input
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="number-pad"
                backgroundColor="surfaceSecondary"
                color="text"
                padding="m"
                borderRadius="m"
                value={cardNumber}
                onChangeText={setCardNumber}
                maxLength={19}
              />
            </Box>

            <Box marginBottom="m">
              <Text variant="body" color="textSecondary" marginBottom="xs">
                Cardholder Name
              </Text>
              <Input
                placeholder="John Doe"
                placeholderTextColor={theme.colors.textSecondary}
                backgroundColor="surfaceSecondary"
                color="text"
                padding="m"
                borderRadius="m"
                value={cardName}
                onChangeText={setCardName}
              />
            </Box>

            <Box flexDirection="row" marginBottom="m">
              <Box flex={1} marginRight="m">
                <Text variant="body" color="textSecondary" marginBottom="xs">
                  Expiry Date
                </Text>
                <Input
                  placeholder="MM/YY"
                  placeholderTextColor={theme.colors.textSecondary}
                  backgroundColor="surfaceSecondary"
                  color="text"
                  padding="m"
                  borderRadius="m"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  maxLength={5}
                />
              </Box>
              <Box flex={1}>
                <Text variant="body" color="textSecondary" marginBottom="xs">
                  CVV
                </Text>
                <Input
                  placeholder="123"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="number-pad"
                  backgroundColor="surfaceSecondary"
                  color="text"
                  padding="m"
                  borderRadius="m"
                  value={cvv}
                  onChangeText={setCvv}
                  maxLength={4}
                />
              </Box>
            </Box>

            <Text variant="caption" color="textSecondary" marginBottom="m">
              This is a simulation. No actual payment will be processed.
            </Text>
          </Card>

          <Button
            label="Continue to Confirmation"
            onPress={handleContinue}
            marginBottom="xl"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default BookingPaymentScreen;
