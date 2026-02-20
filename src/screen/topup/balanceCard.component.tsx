import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { Theme } from "@/src/core/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface BalanceCardProps {
  label: string;
  mainAmount: string;
  mainCurrency: string;
  subAmount: string;
  subCurrency: string;
  showTopUp?: boolean;
  style?: ViewStyle;
}

export const BalanceCardComponent = ({
  label,
  mainAmount,
  mainCurrency,
  subAmount,
  subCurrency,
  showTopUp = false,
  style,
}: BalanceCardProps) => {
  return (
    <GlassCard style={[styles.balanceCard, style]}>
      <View style={styles.cardInner}>
        <View style={styles.balanceInfo}>
          <Text style={styles.label}>{label}</Text>

          <View style={styles.mainContentRow}>
            <View style={styles.amountRow}>
              <Text style={styles.amountText}>{mainAmount}</Text>
              <Text style={styles.currencyText}>{mainCurrency}</Text>
            </View>

            {!showTopUp && (
              <Text style={styles.subAmountInline}>
                ~{subAmount} {subCurrency}
              </Text>
            )}
          </View>

          {showTopUp && (
            <View style={styles.subAmountMargin}>
              <Text style={styles.subAmount}>
                ~{subAmount} {subCurrency}
              </Text>
            </View>
          )}
        </View>

        {showTopUp && (
          <Button
            title="Top Up"
            rounded
            icon={
              <Ionicons name="add" size={24} color={Theme.colors.surface} />
            }
            iconBgColor="v300"
            style={{ minWidth: 110 }}
            onPress={() => router.replace("/topupVia")}
          />
        )}
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
    fontWeight: "600",
    marginBottom: 16,
  },
  mainContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  amountText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "700",
    marginRight: 12,
  },
  currencyText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "700",
  },
  subAmountMargin: {
    marginTop: 16,
  },
  subAmountInline: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    paddingRight: 4,
  },
  subAmount: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
  },
});
