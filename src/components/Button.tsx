import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Theme } from "../theme/theme";

type ButtonVariant = "solid" | "outline";

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  onPress?: () => void;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const Button: FC<ButtonProps> = ({
  title,
  variant = "solid",
  onPress,
  style,
  fullWidth,
}) => {
  const isSolid = variant === "solid";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isSolid ? styles.buttonSolid : styles.buttonOutline,
        fullWidth && { width: "100%" },
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text style={isSolid ? styles.textSolid : styles.textOutline}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSolid: {
    backgroundColor: Theme.colors.v300,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: Theme.colors.v300,
  },
  textSolid: {
    color: Theme.colors.g300,
    fontWeight: "600",
    fontSize: Theme.fontSize.h6,
  },
  textOutline: {
    color: Theme.colors.v500,
    fontWeight: "600",
    fontSize: Theme.fontSize.h6,
  },
});
