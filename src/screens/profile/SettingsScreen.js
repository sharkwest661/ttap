import React, { useState } from "react";
import { ScrollView, Switch, Alert } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

import { Box, Text, Card } from "../../theme/components";
import { useThemeStore } from "../../store/themeStore";

const SettingsScreen = () => {
  const theme = useTheme();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(true);

  const handleNotificationToggle = async (value) => {
    if (value) {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "To enable notifications, please grant permission in your device settings.",
          [{ text: "OK" }]
        );
        return;
      }
    }

    setNotificationsEnabled(value);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.l }}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="header" marginBottom="l">
        Settings
      </Text>

      {/* Appearance */}
      <Card marginBottom="l">
        <Text variant="subheader" marginBottom="m">
          Appearance
        </Text>

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="m"
        >
          <Box flexDirection="row" alignItems="center">
            <Ionicons
              name={isDarkMode ? "moon-outline" : "sunny-outline"}
              size={24}
              color={theme.colors.text}
            />
            <Text variant="body" marginLeft="m">
              Dark Mode
            </Text>
          </Box>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{
              false: theme.colors.surfaceSecondary,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
          />
        </Box>

        <Text variant="caption" color="textSecondary">
          Toggles between light and dark themes. Changes apply throughout the
          app.
        </Text>
      </Card>

      {/* Notifications */}
      <Card marginBottom="l">
        <Text variant="subheader" marginBottom="m">
          Notifications
        </Text>

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="m"
        >
          <Box flexDirection="row" alignItems="center">
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text variant="body" marginLeft="m">
              Push Notifications
            </Text>
          </Box>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{
              false: theme.colors.surfaceSecondary,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
          />
        </Box>

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="m"
        >
          <Box flexDirection="row" alignItems="center">
            <Ionicons name="mail-outline" size={24} color={theme.colors.text} />
            <Text variant="body" marginLeft="m">
              Email Notifications
            </Text>
          </Box>
          <Switch
            value={emailNotificationsEnabled}
            onValueChange={setEmailNotificationsEnabled}
            trackColor={{
              false: theme.colors.surfaceSecondary,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
          />
        </Box>

        <Text variant="caption" color="textSecondary">
          Receive notifications about upcoming time travels, special promotions,
          and new temporal destinations.
        </Text>
      </Card>

      {/* Privacy */}
      <Card marginBottom="l">
        <Text variant="subheader" marginBottom="m">
          Privacy & Security
        </Text>

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="m"
        >
          <Box flexDirection="row" alignItems="center">
            <Ionicons
              name="location-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text variant="body" marginLeft="m">
              Location Services
            </Text>
          </Box>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{
              false: theme.colors.surfaceSecondary,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
          />
        </Box>

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="m"
        >
          <Box flexDirection="row" alignItems="center">
            <Ionicons
              name="finger-print-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text variant="body" marginLeft="m">
              Biometric Authentication
            </Text>
          </Box>
          <Switch
            value={biometricsEnabled}
            onValueChange={setBiometricsEnabled}
            trackColor={{
              false: theme.colors.surfaceSecondary,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
          />
        </Box>

        <Text variant="caption" color="textSecondary">
          Control how your data is used and secure your account with biometric
          authentication.
        </Text>
      </Card>

      {/* Data & Storage */}
      <Card marginBottom="l">
        <Text variant="subheader" marginBottom="m">
          Data & Storage
        </Text>

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="m"
        >
          <Box flexDirection="row" alignItems="center">
            <Ionicons
              name="cloud-offline-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text variant="body" marginLeft="m">
              Offline Mode
            </Text>
          </Box>
          <Switch
            value={offlineModeEnabled}
            onValueChange={setOfflineModeEnabled}
            trackColor={{
              false: theme.colors.surfaceSecondary,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
          />
        </Box>

        <Text variant="caption" color="textSecondary">
          Cache time period data and your bookings for offline viewing.
        </Text>
      </Card>

      {/* About */}
      <Card marginBottom="xxl">
        <Text variant="subheader" marginBottom="m">
          About
        </Text>

        <Box marginBottom="m">
          <Text variant="body" color="textSecondary" marginBottom="xs">
            Version
          </Text>
          <Text variant="body">1.0.0</Text>
        </Box>

        <Box marginBottom="m">
          <Text variant="body" color="textSecondary" marginBottom="xs">
            Developer
          </Text>
          <Text variant="body">Time Tourism LLC</Text>
        </Box>

        <Box>
          <Text variant="body" color="textSecondary" marginBottom="xs">
            Legal
          </Text>
          <Text variant="body">
            © 2025 Time Tourism. All temporal rights reserved.
          </Text>
        </Box>
      </Card>
    </ScrollView>
  );
};

export default SettingsScreen;
