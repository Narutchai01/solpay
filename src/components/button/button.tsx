import React, { FC } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Theme } from "../../core/theme/theme";

type ButtonVariant = "solid" | "outline" | "tag";

type SolidColorKey = {
  [K in keyof typeof Theme.colors]: (typeof Theme.colors)[K] extends string
    ? K
    : never;
}[keyof typeof Theme.colors];

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  color?: SolidColorKey;
  textColor?: SolidColorKey;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  iconBgColor?: SolidColorKey;
  iconSize?: number;
  rounded?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

const COLORS = Theme.colors;

const VARIANT_MAP: Record<
  ButtonVariant,
  (colorKey: SolidColorKey) => {
    container: ViewStyle;
    text: TextStyle;
    disabled?: boolean;
  }
> = {
  solid: (colorKey) => ({
    container: {
      backgroundColor: COLORS[colorKey],
      borderWidth: 2,
      borderColor: COLORS[colorKey],
    },
    text: {
      color: COLORS.g300,
    },
  }),

  outline: (colorKey) => ({
    container: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: COLORS[colorKey],
    },
    text: {
      color: COLORS[colorKey],
    },
  }),

  tag: (colorKey) => ({
    container: {
      backgroundColor: COLORS[colorKey],
      borderWidth: 1,
      borderColor: COLORS[colorKey],
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
      opacity: 0.8,
    },
    text: {
      color: COLORS.g300,
      fontSize: Theme.fontSize.textS,
      fontWeight: "500",
    },
    disabled: true,
  }),
};

export const Button: FC<ButtonProps> = ({
  title,
  variant = "solid",
  color = "surface",
  textColor,
  icon,
  iconPosition = "left",
  iconBgColor,
  iconSize = 30,
  rounded = false,
  style,
  textStyle,
  onPress,
}) => {
  const variantStyles = VARIANT_MAP[variant](color);

  const customTextStyle: TextStyle = textColor
    ? { color: COLORS[textColor] }
    : {};

  const renderIcon = () => {
    if (!icon) return null;

    if (!iconBgColor) {
      return <View style={styles.iconWrapper}>{icon}</View>;
    }

    return (
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: COLORS[iconBgColor],
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize / 2,
          },
        ]}
      >
        {icon}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.baseContainer,
        variantStyles.container,
        rounded && styles.rounded,
        style,
      ]}
    >
      {iconPosition === "left" && renderIcon()}

      <Text
        style={[
          styles.baseText,
          variantStyles.text,
          customTextStyle,
          textStyle,
        ]}
      >
        {title}
      </Text>

      {iconPosition === "right" && renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingLeft: 6,
    paddingRight: 10,
    borderRadius: 12,
  },
  rounded: {
    borderRadius: 50,
  },
  baseText: {
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    color: Theme.colors.g300,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
});
