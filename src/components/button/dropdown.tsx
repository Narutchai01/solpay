import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Theme } from "../../core/theme/theme";

type DropdownProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

export const Dropdown = ({ label, onPress, style }: DropdownProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
      <MaterialCommunityIcons name="chevron-down" size={20} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: Theme.colors.v300,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  text: {
    color: Theme.colors.v100,
    fontSize: Theme.fontSize.h7,
    fontWeight: "500",
    marginRight: 4,
    flexShrink: 1,
  },
});
