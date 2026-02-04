import { Theme } from "@/src/core/theme/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface PinDotsProps {
  pinLength: number;
  currentLength: number;
}

export const PinDots = ({ pinLength, currentLength }: PinDotsProps) => {
  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: pinLength }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
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
    marginVertical: 30,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Theme.colors.v300,
    marginHorizontal: 10,
  },
});
