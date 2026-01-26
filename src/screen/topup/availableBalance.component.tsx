import { ButtonWithIcon } from "@/src/components/button/buttonWithIcon";
import { GlassCard } from "@/src/components/card/glass";
import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AvailableBalanceComponentProps {
  amount: string;
  usdt: string;
}

export const AvailableBalanceComponent = ({
  amount,
  usdt,
}: AvailableBalanceComponentProps) => {
  return (
    <GlassCard style={styles.balanceCard}>
      <View style={styles.cardInner}>
        <View style={styles.balanceInfo}>
          <Text style={styles.label}>Available Balance</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountText}>{amount}</Text>
            <Text style={styles.currencyText}>THB</Text>
          </View>
          <Text style={styles.subAmount}>~{usdt} USDT</Text>
        </View>

        <Link href="/topup">
          <ButtonWithIcon
            label="Top Up"
            icon={<Ionicons name="add" style={styles.iconSize} />}
          />
        </Link>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  balanceCard: { marginTop: 26 },
  cardInner: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceInfo: { flex: 1 },
  label: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "semibold",
    marginBottom: 16,
  },
  amountRow: { flexDirection: "row", alignItems: "baseline" },
  amountText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "bold",
    marginRight: 24,
  },
  currencyText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "bold",
  },
  subAmount: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginTop: 16,
  },
  iconSize: {
    fontSize: 24,
    color: Theme.colors.surface,
  },
});
