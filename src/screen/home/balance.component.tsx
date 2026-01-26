import { ButtonWithIcon } from "@/src/components/button/buttonWithIcon";
import { GlassCard } from "@/src/components/card/glass";
import { Theme } from "@/src/theme/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const BalanceComponent = () => {
  const [isVisible, setIsVisible] = useState(true);
  const rawBalance = "1,000.00";

  return (
    <GlassCard style={styles.balanceCard}>
      <View style={styles.cardContent}>
        <Text style={styles.balanceLabel}>Total balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>
            {isVisible ? `${rawBalance} THB` : "****** THB"}
          </Text>
          <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
            <Ionicons
              name={isVisible ? "eye-outline" : "eye-off-outline"}
              style={[styles.iconSize, styles.eyeIcon]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <ButtonWithIcon
            label="Top Up"
            icon={<Ionicons name="add" style={styles.iconSize} />}
            onPress={() => {}}
          />
          <ButtonWithIcon
            label="Swap"
            icon={
              <MaterialCommunityIcons
                name="swap-horizontal"
                style={styles.iconSize}
              />
            }
            onPress={() => {}}
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
    fontWeight: "bold",
    marginBottom: 16,
  },
  balanceRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  balanceValue: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "bold",
  },
  eyeIcon: { marginLeft: 20 },
  actionButtons: { flexDirection: "row", justifyContent: "center", gap: 15 },
  iconSize: {
    fontSize: 24,
    color: Theme.colors.surface,
  },
});
