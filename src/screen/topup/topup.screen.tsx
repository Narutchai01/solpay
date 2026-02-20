import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/core/theme/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BalanceCardComponent } from "./balanceCard.component";
import { HistoryListComponent } from "./historyList.component";

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
  {
    id: "3",
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
          <BalanceCardComponent
            label="Available Balance"
            mainAmount="1,000"
            mainCurrency="THB"
            subAmount="30.88"
            subCurrency="USDT"
            showTopUp={true}
          />

          {/* History Section */}
          <HistoryListComponent data={TOPUP_HISTORY} />
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
    paddingHorizontal: 16,
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
});
