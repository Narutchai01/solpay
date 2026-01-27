import { Theme } from "@/src/theme/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface KeypadButtonProps {
  value: string | React.ReactNode;
  onPress: () => void;
  isIcon?: boolean;
}

export const KeypadButton = ({
  value,
  onPress,
  isIcon = false,
}: KeypadButtonProps) => (
  <TouchableOpacity style={styles.keypadButton} onPress={onPress}>
    {isIcon ? value : <Text style={styles.keypadText}>{value}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  keypadButton: {
    width: "33%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  keypadText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "medium",
    borderWidth: 1,
    borderColor: Theme.colors.surface,
    width: 75,
    height: 75,
    borderRadius: 50,
    textAlign: "center",
    lineHeight: 75,
  },
});
