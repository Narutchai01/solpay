import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { LoadingSpinner } from "@/src/components/shard/loadingSpinner";
import { Theme } from "@/src/core/theme/theme";
import { useAccount } from "@/src/hooks/useAccount";
import { useBalance } from "@/src/hooks/useBalance";
import { useTransactionHistory } from "@/src/hooks/useTransactionHistory";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BalanceCardComponent } from "./balanceCard.component";
import { HistoryListComponent } from "./historyList.component";

const EXCHANGE_RATE = 32;

export const TopupScreen = () => {
  const { profile, GetProfile } = useAccount();
  const { balance, GetBalance } = useBalance();
  const { historyData, isLoading, fetchHistory } = useTransactionHistory();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      GetProfile(),
      GetBalance(),
      fetchHistory(1, 100, ["TOPUP"]),
    ]);
    setRefreshing(false);
  }, [GetProfile, GetBalance, fetchHistory]);

  useEffect(() => {
    GetBalance();
    fetchHistory(1, 100, ["TOPUP"]);
  }, [GetBalance, fetchHistory]);

  const balanceDisplay = useMemo(() => {
    const amount = balance?.thb_amount ?? 0;
    return {
      thb: amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      usdt: (amount / EXCHANGE_RATE).toFixed(2),
    };
  }, [balance]);

  const formattedTopupHistory = useMemo(() => {
    if (!historyData) return [];

    return historyData.map((item) => {
      const cleanDateString = item.created_at.split(" +")[0].replace(" ", "T");
      const dateObj = new Date(cleanDateString);

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const displayDate = `${String(dateObj.getDate()).padStart(2, "0")} ${
        months[dateObj.getMonth()]
      } ${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

      return {
        id: String(item.id),
        date: displayDate,
        transactionId: item.transaction_uuid,
        amount: item.thb_amount.toFixed(2),
        usdt: item.usdt_amount.toFixed(2),
      };
    });
  }, [historyData]);

  const isKycVerified = profile?.is_kyc_verified ?? false;

  return (
    <GradientLayout>
      {isLoading && <LoadingSpinner overlay={true} />}

      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Theme.colors.surface}
              colors={[Theme.colors.v300]}
            />
          }
        >
          <Header title="Top Up" />

          {/* Available Balance Card */}
          <BalanceCardComponent
            label="Available Balance"
            mainAmount={balanceDisplay.thb}
            mainCurrency="THB"
            subAmount={balanceDisplay.usdt}
            subCurrency="USDC"
            showTopUp={true}
            topUpDisabled={!isKycVerified}
            topUpTitle={!isKycVerified ? "KYC Required" : "Top Up"}
          />

          {/* History Section */}
          <HistoryListComponent data={formattedTopupHistory} />
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
