import React, { useState } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setValidationError("All fields are required");
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(username, email, password);
      // On successful registration, user will be automatically logged in
    } catch (error) {
      // Error is handled in the store and displayed below
      console.log("Registration error:", error);
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
                Join Time Tourism
              </Text>
              <Text
                variant="subheader"
                color="textSecondary"
                textAlign="center"
              >
                Create an account to start exploring history
              </Text>
            </Box>

            <Card marginBottom="l">
              <Box marginBottom="m">
                <Text variant="body" color="textSecondary" marginBottom="xs">
                  Username
                </Text>
                <Input
                  placeholder="Choose a username"
                  placeholderTextColor={theme.colors.textSecondary}
                  autoCapitalize="none"
                  backgroundColor="surfaceSecondary"
                  color="text"
                  padding="m"
                  borderRadius="m"
                  value={username}
                  onChangeText={setUsername}
                />
              </Box>

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
                  placeholder="Create a password"
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

              <Box marginBottom="m">
                <Text variant="body" color="textSecondary" marginBottom="xs">
                  Confirm Password
                </Text>
                <Input
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry
                  backgroundColor="surfaceSecondary"
                  color="text"
                  padding="m"
                  borderRadius="m"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </Box>

              {(validationError || error) && (
                <Text variant="caption" color="error" marginBottom="m">
                  {validationError || error}
                </Text>
              )}

              <Button
                label={isLoading ? "Creating Account..." : "Create Account"}
                onPress={handleRegister}
                disabled={isLoading}
                marginBottom="m"
              />
            </Card>

            <Box flexDirection="row" justifyContent="center" marginTop="m">
              <Text variant="body" color="textSecondary" marginRight="xs">
                Already have an account?
              </Text>
              <TouchableBox onPress={() => navigation.navigate("Login")}>
                <Text variant="body" color="primary" fontWeight="bold">
                  Log In
                </Text>
              </TouchableBox>
            </Box>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
