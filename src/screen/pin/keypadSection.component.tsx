import { Theme } from "@/src/core/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { KeypadButton } from "./keypadButton.component";

interface KeypadSectionProps {
  onPress: (num: string) => void;
  onDelete: () => void;
}

export const KeypadSection = ({ onPress, onDelete }: KeypadSectionProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scale = SCREEN_WIDTH / 375;

  const data = [
    { id: "1", value: "1" },
    { id: "2", value: "2" },
    { id: "3", value: "3" },
    { id: "4", value: "4" },
    { id: "5", value: "5" },
    { id: "6", value: "6" },
    { id: "7", value: "7" },
    { id: "8", value: "8" },
    { id: "9", value: "9" },
    { id: "10", value: "empty" },
    { id: "11", value: "0" },
    { id: "12", value: "delete" },
  ];

  const rows = [
    [data[0], data[1], data[2]],
    [data[3], data[4], data[5]],
    [data[6], data[7], data[8]],
    [data[9], data[10], data[11]],
  ];

  const dynamicStyles = useMemo(
    () => ({
      keypadButtonPlaceholder: {
        width: 75 * scale,
        height: 75 * scale,
      },
      iconSize: {
        fontSize: 36 * scale, // Reduced from 44 to prevent clipping
      },
    }),
    [scale],
  );

  return (
    <View style={styles.gridContainer}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.rowContainer}>
          {row.map((item) => (
            <View key={item.id} style={styles.buttonWrapper}>
              {item.value === "empty" ? (
                <View style={dynamicStyles.keypadButtonPlaceholder} />
              ) : item.value === "delete" ? (
                <KeypadButton
                  value={
                    <Ionicons
                      name="backspace-outline"
                      style={[styles.iconSize, dynamicStyles.iconSize]}
                    />
                  }
                  isIcon
                  onPress={onDelete}
                />
              ) : (
                <KeypadButton
                  value={item.value}
                  onPress={() => onPress(item.value)}
                />
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-evenly",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  buttonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconSize: {
    color: Theme.colors.surface,
  },
});
