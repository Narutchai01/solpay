import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Theme } from "../../theme/theme";

type ButtonVariant = "solid" | "outline";

const COLORS = Theme.colors;
type colorKey = keyof typeof Theme.colors;

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  onPress?: () => void;
  color?: colorKey;
  style?: ViewStyle;
}

const VARIANT_MAP = {
  solid: (colorKey: keyof typeof COLORS) => ({
    container: { backgroundColor: COLORS[colorKey] as string, borderWidth: 0 },
    text: { color: COLORS.surface },
  }),
  outline: (colorKey: keyof typeof COLORS) => ({
    container: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
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
  style,
}) => {
  const variantStyles = VARIANT_MAP[variant](color);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.baseContainer, variantStyles.container, style]}
    >
      <Text style={[styles.baseText, variantStyles.text]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  baseText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
