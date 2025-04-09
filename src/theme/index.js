import { createTheme } from "@shopify/restyle";

// Base theme with shared values
const baseTheme = {
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    round: 9999,
  },
  textVariants: {
    header: {
      fontFamily: "System",
      fontWeight: "bold",
      fontSize: 24,
      lineHeight: 30,
    },
    subheader: {
      fontFamily: "System",
      fontWeight: "600",
      fontSize: 18,
      lineHeight: 24,
    },
    body: {
      fontFamily: "System",
      fontSize: 16,
      lineHeight: 22,
    },
    caption: {
      fontFamily: "System",
      fontSize: 12,
      lineHeight: 16,
    },
    button: {
      fontFamily: "System",
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 22,
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
};

// Light theme colors
const lightTheme = createTheme({
  ...baseTheme,
  colors: {
    primary: "#4A6FA5",
    secondary: "#FF9D5C",
    background: "#F5F7FA",
    surface: "#FFFFFF",
    surfaceSecondary: "#F0F2F5",
    text: "#1A1A2E",
    textSecondary: "#555770",
    accent: "#FFD700",
    error: "#FF5252",
    success: "#4CAF50",
    info: "#2196F3",
    disabled: "#CCCCCC",
    shadow: "rgba(0, 0, 0, 0.1)",
  },
});

// Dark theme colors
const darkTheme = createTheme({
  ...baseTheme,
  colors: {
    primary: "#5C82C2",
    secondary: "#FF8A3D",
    background: "#121212",
    surface: "#1E1E1E",
    surfaceSecondary: "#2A2A2A",
    text: "#F5F5F5",
    textSecondary: "#BBBBBB",
    accent: "#FFD700",
    error: "#FF5252",
    success: "#4CAF50",
    info: "#2196F3",
    disabled: "#555555",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
});

// Export the themes
export default { lightTheme, darkTheme };

// Export themed components
export * from "./components";
