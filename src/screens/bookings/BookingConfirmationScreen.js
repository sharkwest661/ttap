import React, { useState, useEffect } from "react";
import { ScrollView, Alert } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

import { Box, Text, Card, Button } from "../../theme/components";
import { useTourismStore } from "../../store/tourismStore";
import { useAuthStore } from "../../store/authStore";
import { useBookingStore } from "../../store/bookingStore";

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { tourId, travelDate, travelers, totalPrice } = route.params;
  const theme = useTheme();

  const getTourById = useTourismStore((state) => state.getTourById);
  const getTimePeriodById = useTourismStore((state) => state.getTimePeriodById);
  const user = useAuthStore((state) => state.user);
  const createBooking = useBookingStore((state) => state.createBooking);
  const isLoading = useBookingStore((state) => state.isLoading);

  const [tour, setTour] = useState(null);
  const [timePeriod, setTimePeriod] = useState(null);
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    const tourData = getTourById(tourId);
    setTour(tourData);

    if (tourData) {
      const periodData = getTimePeriodById(tourData.timePeriodId);
      setTimePeriod(periodData);
    }

    // Check for biometric support
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setBiometricSupported(compatible);
    })();
  }, [tourId]);

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to confirm your time travel booking",
        fallbackLabel: "Use password instead",
      });

      if (result.success) {
        handleConfirmBooking();
      }
    } catch (error) {
      console.log("Biometric authentication error:", error);
      Alert.alert(
        "Authentication Failed",
        "Please try again or use the regular confirmation button.",
        [{ text: "OK" }]
      );
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
        tourId,
        tourTitle: tour.title,
        travelDate: travelDate.toISOString(),
        numberOfTravelers: travelers,
        totalPrice,
        paymentId: "payment-" + Math.random().toString(36).substring(2),
      };

      const booking = await createBooking(bookingData);
      navigation.navigate("BookingSuccess", { bookingId: booking.id });
    } catch (error) {
      console.log("Booking error:", error);
      Alert.alert(
        "Booking Failed",
        "There was an error processing your booking. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  if (!tour || !user) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="background"
      >
        <Text>Loading details...</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.l }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="header" marginBottom="l">
          Booking Confirmation
        </Text>

        {/* Tour Details */}
        <Card marginBottom="l">
          <Text variant="subheader" marginBottom="m">
            Tour Details
          </Text>

          <Box marginBottom="m">
            <Text variant="body" color="textSecondary" marginBottom="xs">
              Tour
            </Text>
            <Text variant="body" fontWeight="bold">
              {tour.title}
            </Text>
          </Box>

          {timePeriod && (
            <Box marginBottom="m">
              <Text variant="body" color="textSecondary" marginBottom="xs">
                Time Period
              </Text>
              <Text variant="body">{timePeriod.name}</Text>
            </Box>
          )}

          <Box marginBottom="m">
            <Text variant="body" color="textSecondary" marginBottom="xs">
              Duration
            </Text>
            <Text variant="body">{tour.duration} days</Text>
          </Box>
        </Card>

        {/* Booking Details */}
        <Card marginBottom="l">
          <Text variant="subheader" marginBottom="m">
            Booking Details
          </Text>

          <Box marginBottom="m">
            <Text variant="body" color="textSecondary" marginBottom="xs">
              Travel Date
            </Text>
            <Text variant="body">{travelDate.toDateString()}</Text>
          </Box>

          <Box marginBottom="m">
            <Text variant="body" color="textSecondary" marginBottom="xs">
              Number of Travelers
            </Text>
            <Text variant="body">{travelers}</Text>
          </Box>

          <Box marginBottom="m">
            <Text variant="body" color="textSecondary" marginBottom="xs">
              Traveler
            </Text>
            <Text variant="body">{user.username}</Text>
            <Text variant="caption" color="textSecondary">
              {user.email}
            </Text>
          </Box>

          <Box marginBottom="m">
            <Text variant="body" color="textSecondary" marginBottom="xs">
              Price per Traveler
            </Text>
            <Text variant="body">
              ${(totalPrice / travelers).toLocaleString()}
            </Text>
          </Box>

          <Box marginBottom="m">
            <Text variant="body" color="textSecondary" marginBottom="xs">
              Total Price
            </Text>
            <Text variant="subheader" color="primary">
              ${totalPrice.toLocaleString()}
            </Text>
          </Box>
        </Card>

        {/* Safety Notice */}
        <Card marginBottom="l">
          <Text variant="subheader" marginBottom="m">
            Time Travel Safety Notice
          </Text>

          <Box flexDirection="row" marginBottom="m">
            <Ionicons
              name="warning-outline"
              size={20}
              color={theme.colors.secondary}
              style={{ marginTop: 2 }}
            />
            <Text variant="body" color="textSecondary" marginLeft="s">
              All travelers must adhere to temporal regulations and
              non-interference protocols.
            </Text>
          </Box>

          <Box flexDirection="row" marginBottom="m">
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={theme.colors.success}
              style={{ marginTop: 2 }}
            />
            <Text variant="body" color="textSecondary" marginLeft="s">
              Your booking includes comprehensive temporal displacement
              insurance.
            </Text>
          </Box>

          <Box flexDirection="row">
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.colors.info}
              style={{ marginTop: 2 }}
            />
            <Text variant="body" color="textSecondary" marginLeft="s">
              Follow all instructions from your time travel guide at all times.
            </Text>
          </Box>
        </Card>

        {/* Cancellation Policy */}
        <Card marginBottom="l">
          <Text variant="subheader" marginBottom="m">
            Cancellation Policy
          </Text>

          <Text variant="body" color="textSecondary" marginBottom="m">
            Free cancellation up to 72 hours before your scheduled departure.
            After that, a 50% fee will apply.
          </Text>

          <Text variant="caption" color="textSecondary">
            By confirming this booking, you agree to our terms and conditions,
            including all temporal regulations governing time travel.
          </Text>
        </Card>

        {/* Confirmation Buttons */}
        <Box marginBottom="xxl">
          {biometricSupported && (
            <Button
              label="Confirm with Biometrics"
              onPress={handleBiometricAuth}
              marginBottom="m"
              leftIcon={
                <Ionicons
                  name="finger-print"
                  size={20}
                  color={theme.colors.surface}
                />
              }
            />
          )}

          <Button
            label={isLoading ? "Processing..." : "Confirm Booking"}
            onPress={handleConfirmBooking}
            disabled={isLoading}
          />
        </Box>
      </ScrollView>
    </Box>
  );
};

export default BookingConfirmationScreen;
