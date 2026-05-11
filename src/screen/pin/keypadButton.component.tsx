import { Theme } from "@/src/core/theme/theme";
import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

interface KeypadButtonProps {
  value: string | React.ReactNode;
  onPress: () => void;
  isIcon?: boolean;
}

export const KeypadButton = ({
  value,
  onPress,
  isIcon = false,
}: KeypadButtonProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scale = SCREEN_WIDTH / 375;

  const dynamicStyles = useMemo(
    () => ({
      keypadButton: {
        marginVertical: 10 * scale,
      },
      keypadText: {
        fontSize: Theme.fontSize.h3 * scale,
        width: 75 * scale,
        height: 75 * scale,
        borderRadius: 37.5 * scale,
        lineHeight: 75 * scale,
      },
    }),
    [scale],
  );

  return (
    <TouchableOpacity
      style={[styles.keypadButton, dynamicStyles.keypadButton]}
      onPress={onPress}
    >
      {isIcon ? (
        value
      ) : (
        <Text style={[styles.keypadText, dynamicStyles.keypadText]}>
          {value}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  keypadButton: {
    width: "33%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keypadText: {
    color: Theme.colors.surface,
    fontWeight: "500",
    borderWidth: 1,
    borderColor: Theme.colors.surface,
    textAlign: "center",
  },
});
