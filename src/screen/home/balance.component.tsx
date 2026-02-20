import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { Theme } from "@/src/core/theme/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BalanceComponentProps {
  balance: string;
  currency?: string;
}

export const BalanceComponent = ({
  balance,
  currency = "THB",
}: BalanceComponentProps) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <GlassCard style={styles.balanceCard}>
      <View style={styles.cardContent}>
        <Text style={styles.balanceLabel}>Total balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>
            {isVisible ? `${balance} ${currency}` : `****** ${currency}`}
          </Text>
          <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
            <Ionicons
              name={isVisible ? "eye-outline" : "eye-off-outline"}
              style={[styles.iconSize, styles.eyeIcon]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Top Up"
            rounded
            icon={
              <Ionicons name="add" size={24} color={Theme.colors.surface} />
            }
            iconBgColor="v300"
            style={{ minWidth: 110 }}
            onPress={() => router.replace("/topup")}
          />

          <Button
            title="Swap"
            rounded
            icon={
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={24}
                color={Theme.colors.surface}
              />
            }
            iconBgColor="v300"
            style={{ minWidth: 110 }}
            onPress={() => router.replace("/swap")}
          />
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  balanceCard: { marginTop: 10 },
  cardContent: { padding: 24, alignItems: "center" },
  balanceLabel: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    marginBottom: 16,
  },
  balanceRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  balanceValue: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "700",
  },
  eyeIcon: { marginLeft: 20 },
  actionButtons: { flexDirection: "row", justifyContent: "center", gap: 16 },
  iconSize: {
    fontSize: 24,
    color: Theme.colors.surface,
  },
});
