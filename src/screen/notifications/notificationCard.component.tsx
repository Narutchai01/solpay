import { GlassCard } from "@/src/components/card/glass";
import { Theme } from "@/src/core/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface NotificationCardProps {
  title: string;
  description: string;
  date: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  containerStyle?: StyleProp<ViewStyle>;
}

export const NotificationCard = ({
  title,
  description,
  date,
  iconName = "person-circle-outline",
  containerStyle,
}: NotificationCardProps) => {
  return (
    <GlassCard style={[styles.cardContainer, containerStyle]}>
      <View style={styles.cardContent}>
        {/* Icon Section */}
        <View style={styles.iconWrapper}>
          <Ionicons name={iconName} size={38} color={Theme.colors.surface} />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrapper: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.textM,
    marginBottom: 4,
  },
  date: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.textS,
  },
});
