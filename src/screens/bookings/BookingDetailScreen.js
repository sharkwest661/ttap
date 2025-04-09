import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Share } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

import { Box, Text, Card, Button, ThemedImage } from "../../theme/components";
import { useBookingStore } from "../../store/bookingStore";
import { useTourismStore } from "../../store/tourismStore";

const BookingDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const theme = useTheme();

  const getBookingById = useBookingStore((state) => state.getBookingById);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);
  const getTourById = useTourismStore((state) => state.getTourById);
  const isLoading = useBookingStore((state) => state.isLoading);

  const [booking, setBooking] = useState(null);
  const [tour, setTour] = useState(null);

  useEffect(() => {
    const bookingData = getBookingById(id);
    setBooking(bookingData);

    if (bookingData) {
      const tourData = getTourById(bookingData.tourId);
      setTour(tourData);
    }
  }, [id]);

  const handleCancelBooking = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this time travel booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelBooking(id);
              // Refresh booking data
              const updatedBooking = getBookingById(id);
              setBooking(updatedBooking);
            } catch (error) {
              console.log("Error canceling booking:", error);
              Alert.alert(
                "Error",
                "There was an error canceling your booking."
              );
            }
          },
        },
      ]
    );
  };

  const handleShareBooking = async () => {
    try {
      const message = `I'm traveling back in time to ${
        booking.tourTitle
      } on ${new Date(
        booking.travelDate
      ).toLocaleDateString()}! Join the Time Tourism adventure and book your own journey through history.`;

      await Share.share({
        message,
        title: "My Time Travel Adventure",
      });
    } catch (error) {
      console.log("Error sharing booking:", error);
    }
  };

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

  if (!booking) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="background"
      >
        <Text>Loading booking details...</Text>
      </Box>
    );
  }

  const travelDate = new Date(booking.travelDate);
  const isPast = travelDate < new Date();
  const isCanceled = booking.status === "canceled";
  const canCancel = !isPast && !isCanceled;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.l }}
      showsVerticalScrollIndicator={false}
    >
      {/* Status Badge */}
      <Box flexDirection="row" justifyContent="space-between" marginBottom="l">
        <Text variant="header">Booking Details</Text>
        {isCanceled ? (
          <Box
            backgroundColor="error"
            paddingHorizontal="m"
            paddingVertical="s"
            borderRadius="m"
          >
            <Text variant="body" color="surface">
              Canceled
            </Text>
          </Box>
        ) : isPast ? (
          <Box
            backgroundColor="textSecondary"
            paddingHorizontal="m"
            paddingVertical="s"
            borderRadius="m"
          >
            <Text variant="body" color="surface">
              Completed
            </Text>
          </Box>
        ) : (
          <Box
            backgroundColor="success"
            paddingHorizontal="m"
            paddingVertical="s"
            borderRadius="m"
          >
            <Text variant="body" color="surface">
              Confirmed
            </Text>
          </Box>
        )}
      </Box>

      {/* Tour Info */}
      {tour && (
        <Card marginBottom="l">
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

          <Button
            label="View Tour Details"
            variant="outline"
            onPress={() =>
              navigation.navigate("TourDetail", {
                id: tour.id,
                title: tour.title,
              })
            }
          />
        </Card>
      )}

      {/* QR Code Ticket */}
      <Card marginBottom="l">
        <Text variant="subheader" marginBottom="m">
          Time Travel Ticket
        </Text>

        <Box alignItems="center" marginBottom="m">
          <QRCode
            value={qrData}
            size={200}
            color={theme.colors.text}
            backgroundColor={theme.colors.surface}
          />

          <Text variant="caption" color="textSecondary" marginTop="m">
            Present this QR code at the departure facility
          </Text>
        </Box>

        <Box marginTop="m">
          <Text variant="body" color="textSecondary" marginBottom="xs">
            Booking Reference
          </Text>
          <Text variant="body" fontFamily="monospace">
            {booking.id}
          </Text>
        </Box>
      </Card>

      {/* Booking Details */}
      <Card marginBottom="l">
        <Text variant="subheader" marginBottom="m">
          Travel Details
        </Text>

        <Box marginBottom="m">
          <Text variant="body" color="textSecondary" marginBottom="xs">
            Departure Date
          </Text>
          <Box flexDirection="row" alignItems="center">
            <Ionicons
              name="calendar-outline"
              size={16}
              color={theme.colors.text}
            />
            <Text variant="body" marginLeft="xs">
              {travelDate.toDateString()}
            </Text>
          </Box>
        </Box>

        <Box marginBottom="m">
          <Text variant="body" color="textSecondary" marginBottom="xs">
            Number of Travelers
          </Text>
          <Box flexDirection="row" alignItems="center">
            <Ionicons
              name="people-outline"
              size={16}
              color={theme.colors.text}
            />
            <Text variant="body" marginLeft="xs">
              {booking.numberOfTravelers}{" "}
              {booking.numberOfTravelers === 1 ? "traveler" : "travelers"}
            </Text>
          </Box>
        </Box>

        <Box marginBottom="m">
          <Text variant="body" color="textSecondary" marginBottom="xs">
            Total Price
          </Text>
          <Text variant="subheader" color="primary">
            ${booking.totalPrice.toLocaleString()}
          </Text>
        </Box>

        <Box marginBottom="m">
          <Text variant="body" color="textSecondary" marginBottom="xs">
            Booking Date
          </Text>
          <Text variant="body">
            {new Date(booking.createdAt).toLocaleString()}
          </Text>
        </Box>
      </Card>

      {/* Important Information */}
      <Card marginBottom="l">
        <Text variant="subheader" marginBottom="m">
          Important Information
        </Text>

        <Box flexDirection="row" marginBottom="m">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={theme.colors.info}
            style={{ marginTop: 2 }}
          />
          <Text variant="body" color="textSecondary" marginLeft="s">
            Please arrive at the departure facility 30 minutes before your
            scheduled time travel.
          </Text>
        </Box>

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

        <Box flexDirection="row">
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={theme.colors.success}
            style={{ marginTop: 2 }}
          />
          <Text variant="body" color="textSecondary" marginLeft="s">
            Your booking includes comprehensive temporal displacement insurance.
          </Text>
        </Box>
      </Card>

      {/* Action Buttons */}
      <Box marginBottom="xxl">
        <Button
          label="Share This Adventure"
          variant="outline"
          onPress={handleShareBooking}
          leftIcon={
            <Ionicons
              name="share-social-outline"
              size={20}
              color={theme.colors.primary}
            />
          }
          marginBottom="m"
        />

        {canCancel && (
          <Button
            label={isLoading ? "Processing..." : "Cancel Booking"}
            variant="danger"
            onPress={handleCancelBooking}
            disabled={isLoading}
            leftIcon={
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={theme.colors.surface}
              />
            }
          />
        )}
      </Box>
    </ScrollView>
  );
};

export default BookingDetailScreen;
