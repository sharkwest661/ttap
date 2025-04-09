import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@shopify/restyle";
import { NavigationContainer } from "@react-navigation/native";

import theme from "./src/theme";
import Navigation from "./src/navigation";
import { useThemeStore } from "./src/store/themeStore";

export default function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const currentTheme = isDarkMode ? theme.darkTheme : theme.lightTheme;

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={currentTheme}>
        <NavigationContainer>
          <StatusBar style={isDarkMode ? "light" : "dark"} />
          <Navigation />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
