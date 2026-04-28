import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Theme } from "../../core/theme/theme";

type DropdownProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconColor?: string;
};

export const Dropdown = ({
  label,
  onPress,
  style,
  containerStyle,
  textStyle,
  iconColor = "white",
}: DropdownProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, style, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle]} numberOfLines={1}>
        {label}
      </Text>
      <MaterialCommunityIcons name="chevron-down" size={20} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: Theme.colors.v300,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  text: {
    color: Theme.colors.v100,
    fontSize: Theme.fontSize.h7,
    fontWeight: "500",
    marginRight: 4,
    flexShrink: 1,
  },
});
