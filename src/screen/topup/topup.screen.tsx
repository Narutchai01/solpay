import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { useBalance } from "@/src/hooks/useBalance";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
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
  const { balance } = useBalance();
  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header title="Top Up" />

          {/* Available Balance Card */}
          <BalanceCardComponent
            label="Available Balance"
            mainAmount={balance?.thb_amount ?? 0}
            mainCurrency="THB"
            subAmount={
              balance?.thb_amount === undefined ? 0 : balance.thb_amount / 32
            }
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
});
