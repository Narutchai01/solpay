import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const GlassCard = ({ children, style }: GlassCardProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[StyleSheet.absoluteFill, styles.glassBase]} />
      <View style={[StyleSheet.absoluteFill, styles.glassOverlay]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  glassBase: {
    backgroundColor: "rgba(94, 94, 94, 0.4)",
  },
  glassOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
