import React from "react";
import { ScrollView, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

import { Box, Text, Card, ThemedImage, Button } from "../../theme/components";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { useBookingStore } from "../../store/bookingStore";

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const bookings = useBookingStore((state) => state.bookings);

  const handleLogout = async () => {
    try {
      // Try to authenticate with biometrics before logout (optional security feature)
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to log out",
        fallbackLabel: "Use password",
      });

      if (biometricAuth.success) {
        await logout();
      }
    } catch (error) {
      // If biometric auth fails or isn't available, just logout normally
      await logout();
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert(
              "Feature Not Available",
              "Account deletion is not available in this demo."
            );
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="background"
      >
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  // Count completed bookings
  const completedBookings = bookings.filter((booking) => {
    const travelDate = new Date(booking.travelDate);
    return travelDate < new Date() && booking.status !== "canceled";
  });

  // Calculate possible achievements
  const achievements = [
    {
      id: 1,
      title: "Time Voyager",
      description: "Complete your first time travel",
      earned: completedBookings.length > 0,
    },
    {
      id: 2,
      title: "Temporal Explorer",
      description: "Visit 3 different time periods",
      earned: completedBookings.length >= 3,
    },
    {
      id: 3,
      title: "History Enthusiast",
      description: "Book 5 time travel tours",
      earned: bookings.length >= 5,
    },
  ];

  const earnedAchievements = achievements.filter((a) => a.earned);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <Box
        backgroundColor="primary"
        paddingHorizontal="l"
        paddingTop="xl"
        paddingBottom="xl"
        alignItems="center"
      >
        {/* Profile Image */}
        <Box
          width={100}
          height={100}
          borderRadius="round"
          backgroundColor="surface"
          marginBottom="m"
          overflow="hidden"
          borderWidth={3}
          borderColor="surface"
        >
          {user.profilePicture ? (
            <ThemedImage
              source={{ uri: user.profilePicture }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Box
              flex={1}
              backgroundColor="surfaceSecondary"
              justifyContent="center"
              alignItems="center"
            >
              <Ionicons
                name="person"
                size={50}
                color={theme.colors.textSecondary}
              />
            </Box>
          )}
        </Box>

        <Text variant="header" color="surface" marginBottom="xs">
          {user.username}
        </Text>
        <Text variant="body" color="surface" opacity={0.8}>
          {user.email}
        </Text>

        {/* User Stats */}
        <Box
          flexDirection="row"
          marginTop="l"
          width="100%"
          justifyContent="space-between"
        >
          <Box alignItems="center">
            <Text variant="subheader" color="surface">
              {bookings.length}
            </Text>
            <Text variant="caption" color="surface" opacity={0.8}>
              Bookings
            </Text>
          </Box>

          <Box alignItems="center">
            <Text variant="subheader" color="surface">
              {completedBookings.length}
            </Text>
            <Text variant="caption" color="surface" opacity={0.8}>
              Trips
            </Text>
          </Box>

          <Box alignItems="center">
            <Text variant="subheader" color="surface">
              {earnedAchievements.length}
            </Text>
            <Text variant="caption" color="surface" opacity={0.8}>
              Achievements
            </Text>
          </Box>

          <Box alignItems="center">
            <Text variant="subheader" color="surface">
              {user.points || 0}
            </Text>
            <Text variant="caption" color="surface" opacity={0.8}>
              Points
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Box padding="l">
        {/* Account Settings */}
        <Text variant="subheader" marginBottom="m">
          Account Settings
        </Text>

        <Card marginBottom="l">
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Feature Not Available",
                "This feature is not available in the demo."
              )
            }
            style={{ paddingVertical: theme.spacing.s }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text variant="body" marginLeft="m">
                  Edit Profile
                </Text>
              </Box>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </Box>
          </TouchableOpacity>

          <Box
            height={1}
            backgroundColor="surfaceSecondary"
            marginVertical="s"
          />

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Feature Not Available",
                "This feature is not available in the demo."
              )
            }
            style={{ paddingVertical: theme.spacing.s }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text variant="body" marginLeft="m">
                  Change Password
                </Text>
              </Box>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </Box>
          </TouchableOpacity>

          <Box
            height={1}
            backgroundColor="surfaceSecondary"
            marginVertical="s"
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("Bookings")}
            style={{ paddingVertical: theme.spacing.s }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text variant="body" marginLeft="m">
                  My Bookings
                </Text>
              </Box>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </Box>
          </TouchableOpacity>
        </Card>

        {/* App Settings */}
        <Text variant="subheader" marginBottom="m">
          App Settings
        </Text>

        <Card marginBottom="l">
          <TouchableOpacity
            onPress={handleThemeToggle}
            style={{ paddingVertical: theme.spacing.s }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <Ionicons
                  name={isDarkMode ? "moon-outline" : "sunny-outline"}
                  size={24}
                  color={theme.colors.text}
                />
                <Text variant="body" marginLeft="m">
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </Text>
              </Box>
              <Box
                width={50}
                height={30}
                backgroundColor={isDarkMode ? "primary" : "surfaceSecondary"}
                borderRadius="round"
                justifyContent="center"
                paddingHorizontal="xs"
              >
                <Box
                  width={24}
                  height={24}
                  borderRadius="round"
                  backgroundColor="surface"
                  style={{
                    transform: [{ translateX: isDarkMode ? 20 : 0 }],
                  }}
                />
              </Box>
            </Box>
          </TouchableOpacity>

          <Box
            height={1}
            backgroundColor="surfaceSecondary"
            marginVertical="s"
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            style={{ paddingVertical: theme.spacing.s }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text variant="body" marginLeft="m">
                  Settings
                </Text>
              </Box>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </Box>
          </TouchableOpacity>
        </Card>

        {/* Achievements */}
        <Text variant="subheader" marginBottom="m">
          Achievements
        </Text>

        <Card marginBottom="l">
          {achievements.map((achievement, index) => (
            <React.Fragment key={achievement.id}>
              {index > 0 && (
                <Box
                  height={1}
                  backgroundColor="surfaceSecondary"
                  marginVertical="s"
                />
              )}
              <Box
                flexDirection="row"
                alignItems="center"
                paddingVertical="s"
                opacity={achievement.earned ? 1 : 0.5}
              >
                <Box
                  width={40}
                  height={40}
                  borderRadius="round"
                  backgroundColor={
                    achievement.earned ? "accent" : "surfaceSecondary"
                  }
                  justifyContent="center"
                  alignItems="center"
                  marginRight="m"
                >
                  <Ionicons
                    name={achievement.earned ? "trophy" : "lock-closed"}
                    size={20}
                    color={
                      achievement.earned
                        ? theme.colors.text
                        : theme.colors.textSecondary
                    }
                  />
                </Box>
                <Box flex={1}>
                  <Text variant="body" marginBottom="xs">
                    {achievement.title}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {achievement.description}
                  </Text>
                </Box>
              </Box>
            </React.Fragment>
          ))}
        </Card>

        {/* Help & Support */}
        <Text variant="subheader" marginBottom="m">
          Help & Support
        </Text>

        <Card marginBottom="l">
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Feature Not Available",
                "This feature is not available in the demo."
              )
            }
            style={{ paddingVertical: theme.spacing.s }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text variant="body" marginLeft="m">
                  Help Center
                </Text>
              </Box>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </Box>
          </TouchableOpacity>

          <Box
            height={1}
            backgroundColor="surfaceSecondary"
            marginVertical="s"
          />

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Feature Not Available",
                "This feature is not available in the demo."
              )
            }
            style={{ paddingVertical: theme.spacing.s }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text variant="body" marginLeft="m">
                  About Time Tourism
                </Text>
              </Box>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </Box>
          </TouchableOpacity>

          <Box
            height={1}
            backgroundColor="surfaceSecondary"
            marginVertical="s"
          />

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Feature Not Available",
                "This feature is not available in the demo."
              )
            }
            style={{ paddingVertical: theme.spacing.s }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text variant="body" marginLeft="m">
                  Privacy Policy
                </Text>
              </Box>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </Box>
          </TouchableOpacity>
        </Card>

        {/* Logout & Delete Account */}
        <Button
          label="Logout"
          variant="outline"
          onPress={handleLogout}
          marginBottom="m"
        />

        <Button
          label="Delete Account"
          variant="danger"
          onPress={handleDeleteAccount}
          marginBottom="xxl"
        />
      </Box>
    </ScrollView>
  );
};

export default ProfileScreen;
