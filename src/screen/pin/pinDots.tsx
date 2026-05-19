import { Theme } from "@/src/core/theme/theme";
import React, { useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

interface PinDotsProps {
  pinLength: number;
  currentLength: number;
}

export const PinDots = ({ pinLength, currentLength }: PinDotsProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scale = SCREEN_WIDTH / 375;

  const dynamicStyles = useMemo(
    () => ({
      dotsContainer: {
        marginVertical: 30 * scale,
      },
      dot: {
        width: 16 * scale,
        height: 16 * scale,
        borderRadius: 8 * scale,
        marginHorizontal: 10 * scale,
        borderWidth: 2 * scale,
      },
    }),
    [scale],
  );

  return (
    <View style={[styles.dotsContainer, dynamicStyles.dotsContainer]}>
      {Array.from({ length: pinLength }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            dynamicStyles.dot,
            {
              backgroundColor:
                i < currentLength ? Theme.colors.v300 : "transparent",
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
  },
  dot: {
    borderColor: Theme.colors.v300,
  },
});
