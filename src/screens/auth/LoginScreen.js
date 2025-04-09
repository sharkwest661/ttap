import React, { useState } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useTheme } from "@shopify/restyle";

import {
  Box,
  Text,
  Input,
  Button,
  Card,
  TouchableBox,
} from "../../theme/components";
import { useAuthStore } from "../../store/authStore";

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [biometricSupported, setBiometricSupported] = useState(false);

  // Check for biometric support on component mount
  React.useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setBiometricSupported(compatible);
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      // Simple validation
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the store and displayed below
      console.log("Login error:", error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with biometrics",
        fallbackLabel: "Use password",
      });

      if (result.success) {
        // For demo purposes, we'll use test credentials
        await login("test@example.com", "password");
      }
    } catch (error) {
      console.log("Biometric login error:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Box
            flex={1}
            backgroundColor="background"
            padding="l"
            justifyContent="center"
          >
            <Box marginBottom="xl" alignItems="center">
              <Text variant="header" color="primary" marginBottom="m">
                Time Tourism
              </Text>
              <Text
                variant="subheader"
                color="textSecondary"
                textAlign="center"
              >
                Login to start your time travel adventures
              </Text>
            </Box>

            <Card marginBottom="l">
              <Box marginBottom="m">
                <Text variant="body" color="textSecondary" marginBottom="xs">
                  Email
                </Text>
                <Input
                  placeholder="your.email@example.com"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  backgroundColor="surfaceSecondary"
                  color="text"
                  padding="m"
                  borderRadius="m"
                  value={email}
                  onChangeText={setEmail}
                />
              </Box>

              <Box marginBottom="m">
                <Text variant="body" color="textSecondary" marginBottom="xs">
                  Password
                </Text>
                <Input
                  placeholder="Your password"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry
                  backgroundColor="surfaceSecondary"
                  color="text"
                  padding="m"
                  borderRadius="m"
                  value={password}
                  onChangeText={setPassword}
                />
              </Box>

              {error && (
                <Text variant="caption" color="error" marginBottom="m">
                  {error}
                </Text>
              )}

              <Button
                label={isLoading ? "Logging in..." : "Login"}
                onPress={handleLogin}
                disabled={isLoading || !email || !password}
                marginBottom="m"
              />

              {biometricSupported && (
                <Button
                  label="Login with Biometrics"
                  variant="outline"
                  onPress={handleBiometricLogin}
                  marginBottom="s"
                />
              )}
            </Card>

            <Box flexDirection="row" justifyContent="center" marginTop="m">
              <Text variant="body" color="textSecondary" marginRight="xs">
                Don't have an account?
              </Text>
              <TouchableBox onPress={() => navigation.navigate("Register")}>
                <Text variant="body" color="primary" fontWeight="bold">
                  Sign Up
                </Text>
              </TouchableBox>
            </Box>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
