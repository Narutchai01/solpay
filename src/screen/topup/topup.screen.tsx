import { ButtonWithIcon } from "@/src/components/button/buttonWithIcon";
import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOPUP_HISTORY = [
  {
    id: "1",
    date: "18 Nov 2025 16:33",
    transactionId: "transaction id",
    amount: "400.00",
    usdt: "12.35",
  },
  {
    id: "2",
    date: "17 Nov 2025 12:00",
    transactionId: "transaction id",
    amount: "700.00",
    usdt: "21.61",
  },
];

export const TopupScreen = () => {
  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Top Up</Text>
          </View>

          {/* Available Balance Card */}
          <GlassCard style={styles.balanceCard}>
            <View style={styles.cardInner}>
              <View style={styles.balanceInfo}>
                <Text style={styles.label}>Available Balance</Text>
                <View style={styles.amountRow}>
                  <Text style={styles.amountText}>1,000</Text>
                  <Text style={styles.currencyText}>THB</Text>
                </View>
                <Text style={styles.subAmount}>~30.88 USDT</Text>
              </View>

              <ButtonWithIcon
                label="Top Up"
                icon={
                  <Ionicons name="add" size={20} color={Theme.colors.surface} />
                }
                onPress={() => console.log("Top Up Pressed")}
              />
            </View>
          </GlassCard>

          {/* History Section */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Top Up History</Text>

            {TOPUP_HISTORY.map((item) => (
              <GlassCard key={item.id} style={styles.historyItem}>
                <View style={styles.historyInner}>
                  <View>
                    <Text style={styles.historyDate}>{item.date}</Text>
                    <Text style={styles.historyId}>{item.transactionId}</Text>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyAmount}>
                      + {item.amount} THB
                    </Text>
                    <Text style={styles.historyUsdt}>~{item.usdt} USDT</Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
  },
  headerTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
  },
  // Balance Card
  balanceCard: {
    marginTop: 26,
  },
  cardInner: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceInfo: {
    flex: 1,
  },
  label: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  amountText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "700",
    marginRight: 24,
  },
  currencyText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "700",
  },
  subAmount: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginTop: 16,
  },
  // History Section
  historySection: {
    marginTop: 32,
  },
  sectionTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    marginBottom: 16,
  },
  historyItem: {
    marginBottom: 16,
  },
  historyInner: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyDate: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
  historyId: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textS,
    marginTop: 4,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyAmount: {
    color: Theme.colors.success,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
  historyUsdt: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textS,
    marginTop: 4,
  },
});
