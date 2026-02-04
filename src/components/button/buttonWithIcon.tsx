import { Theme } from "@/src/theme/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ButtonWithIconProps {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

export const ButtonWithIcon = ({
  label,
  icon,
  onPress,
}: ButtonWithIconProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingLeft: 6,
    borderRadius: 50,
    minWidth: 110,
  },
  iconWrapper: {
    backgroundColor: Theme.colors.v300,
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  label: {
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    color: Theme.colors.g300,
  },
});
