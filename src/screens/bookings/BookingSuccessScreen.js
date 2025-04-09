import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

import { Box, Text, Button } from "../../theme/components";
import { useBookingStore } from "../../store/bookingStore";

const BookingSuccessScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const getBookingById = useBookingStore((state) => state.getBookingById);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const bookingData = getBookingById(bookingId);
    setBooking(bookingData);
  }, [bookingId]);

  // Generate QR code data
  const qrData = booking
    ? JSON.stringify({
        bookingId: booking.id,
        userId: booking.userId,
        tourId: booking.tourId,
        travelDate: booking.travelDate,
        timestamp: new Date().toISOString(),
      })
    : "";

  const handleViewBooking = () => {
    navigation.navigate("Bookings");
  };

  const handleBackToHome = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <Box
      flex={1}
      backgroundColor="background"
      padding="l"
      justifyContent="center"
      alignItems="center"
    >
      {/* Success Icon */}
      <Box
        width={80}
        height={80}
        borderRadius="round"
        backgroundColor="success"
        justifyContent="center"
        alignItems="center"
        marginBottom="l"
      >
        <Ionicons name="checkmark" size={40} color={theme.colors.surface} />
      </Box>

      <Text variant="header" marginBottom="m" textAlign="center">
        Time Travel Booked!
      </Text>

      <Text
        variant="body"
        color="textSecondary"
        marginBottom="xl"
        textAlign="center"
      >
        Your journey through time has been successfully scheduled. An email
        confirmation has been sent with all the details.
      </Text>

      {/* QR Code */}
      <Box
        padding="l"
        backgroundColor="surface"
        borderRadius="m"
        marginBottom="l"
        alignItems="center"
        width={width * 0.8}
      >
        <Text variant="subheader" marginBottom="m" textAlign="center">
          Your Time Travel Ticket
        </Text>

        {booking && (
          <QRCode
            value={qrData}
            size={200}
            color={theme.colors.text}
            backgroundColor={theme.colors.surface}
          />
        )}

        <Text
          variant="caption"
          color="textSecondary"
          marginTop="m"
          textAlign="center"
        >
          Present this QR code at the departure facility
        </Text>
      </Box>

      {/* Buttons */}
      <Button
        label="View My Bookings"
        onPress={handleViewBooking}
        marginBottom="m"
        width={width * 0.8}
      />

      <Button
        label="Back to Home"
        variant="outline"
        onPress={handleBackToHome}
        width={width * 0.8}
      />
    </Box>
  );
};

export default BookingSuccessScreen;
