import React, { FC } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Theme } from "../../theme/theme";

type ButtonVariant = "solid" | "outline";

const COLORS = Theme.colors;
type colorKey = keyof typeof Theme.colors;

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  color?: colorKey;
  textColor?: colorKey;
  style?: ViewStyle;
  onPress?: () => void;
}

const VARIANT_MAP = {
  solid: (colorKey: keyof typeof COLORS) => ({
    container: { backgroundColor: COLORS[colorKey] as string, borderWidth: 0 },
    text: { color: COLORS.g300 },
  }),
  outline: (colorKey: keyof typeof COLORS) => ({
    container: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: COLORS[colorKey] as string,
    },
    text: { color: COLORS[colorKey] as string },
  }),
};

export const Button: FC<ButtonProps> = ({
  title,
  variant = "solid",
  onPress,
  color = "primary",
  textColor,
  style,
}) => {
  const variantStyles = VARIANT_MAP[variant](color);

  const customTextStyle: TextStyle = textColor
    ? { color: COLORS[textColor] as string }
    : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.baseContainer, variantStyles.container, style]}
    >
      <Text style={[styles.baseText, variantStyles.text, customTextStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  baseText: {
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
});
