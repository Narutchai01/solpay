import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/theme/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AvailableBalanceComponent } from "./availableBalance.component";
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
          <AvailableBalanceComponent
            amount="1,000"
            usdt="30.88"
            onPressTopup={() => {}}
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
  },
  headerTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "bold",
  },
});
