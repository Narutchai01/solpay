import { Theme } from "@/src/core/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
  onBackPress?: () => void;
}

export const Header = ({
  title,
  showBackButton = true,
  rightElement,
  onBackPress,
}: HeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) onBackPress();
    else router.back();
  };

  return (
    <View style={styles.header}>
      {/* Left Section */}
      <View style={styles.sideContainer}>
        {showBackButton ? (
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Ionicons
              name="chevron-back"
              size={28}
              color={Theme.colors.surface}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Center Section */}
      {title ? (
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={{ flex: 2 }} />
      )}

      {/* Right Section */}
      <View style={[styles.sideContainer, styles.alignRight]}>
        {rightElement ? rightElement : <View style={{ width: 28 }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
  },
  sideContainer: {
    flex: 1,
    justifyContent: "center",
  },
  alignRight: {
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    color: Theme.colors.surface,
    textAlign: "center",
    flex: 2,
  },
});
