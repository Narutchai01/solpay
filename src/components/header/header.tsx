import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  iconback?: boolean;
}

export const Header = ({ title, iconback = true }: HeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container]}>
      {/* Icon Back */}
      <View style={styles.side}>
        {iconback && (
          <Link href="../" asChild>
            <TouchableOpacity>
              <Ionicons
                name="chevron-back"
                size={24}
                color={Theme.colors.surface}
              />
            </TouchableOpacity>
          </Link>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right */}
      <View style={styles.side} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  side: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "600",
  },
});
