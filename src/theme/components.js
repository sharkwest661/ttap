import {
  createBox,
  createText,
  createRestyleComponent,
} from "@shopify/restyle";
import { TouchableOpacity, Image, TextInput } from "react-native";

// Create base themed components
export const Box = createBox();
export const Text = createText();

// Create themed TouchableOpacity
export const TouchableBox = createRestyleComponent(
  [
    "backgroundColor",
    "borderRadius",
    "padding",
    "paddingVertical",
    "paddingHorizontal",
    "margin",
    "marginVertical",
    "marginHorizontal",
    "flex",
    "justifyContent",
    "alignItems",
    "shadow",
    "opacity",
    "width",
    "height",
  ],
  TouchableOpacity
);

// Create themed Image
export const ThemedImage = createRestyleComponent(
  [
    "width",
    "height",
    "borderRadius",
    "margin",
    "marginVertical",
    "marginHorizontal",
    "padding",
    "paddingVertical",
    "paddingHorizontal",
  ],
  Image
);

// Create themed TextInput
export const Input = createRestyleComponent(
  [
    "backgroundColor",
    "color",
    "paddingVertical",
    "paddingHorizontal",
    "margin",
    "marginVertical",
    "marginHorizontal",
    "borderRadius",
    "borderWidth",
    "borderColor",
    "width",
    "height",
  ],
  TextInput
);

// Common component styles
export const Card = ({ children, ...rest }) => (
  <Box
    backgroundColor="surface"
    borderRadius="m"
    padding="m"
    shadow="medium"
    {...rest}
  >
    {children}
  </Box>
);

export const Button = ({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  ...rest
}) => {
  let backgroundColor;
  let textColor;

  switch (variant) {
    case "secondary":
      backgroundColor = "secondary";
      textColor = "text";
      break;
    case "outline":
      backgroundColor = "transparent";
      textColor = "primary";
      break;
    case "danger":
      backgroundColor = "error";
      textColor = "surface";
      break;
    case "success":
      backgroundColor = "success";
      textColor = "surface";
      break;
    case "primary":
    default:
      backgroundColor = "primary";
      textColor = "surface";
  }

  return (
    <TouchableBox
      backgroundColor={disabled ? "disabled" : backgroundColor}
      paddingVertical="m"
      paddingHorizontal="l"
      borderRadius="m"
      alignItems="center"
      justifyContent="center"
      opacity={disabled ? 0.7 : 1}
      onPress={disabled ? null : onPress}
      {...rest}
    >
      <Text variant="button" color={disabled ? "textSecondary" : textColor}>
        {label}
      </Text>
    </TouchableBox>
  );
};
