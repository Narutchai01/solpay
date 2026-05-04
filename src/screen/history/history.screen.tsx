import { Dropdown } from "@/src/components/button/dropdown";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { LoadingSpinner } from "@/src/components/shard/loadingSpinner";
import { useTransactionHistory } from "@/src/hooks/useTransactionHistory";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";
import { ChartSection } from "./chartSection.component";
import { EXPENSE_CATEGORY_CONFIG } from "./expenseCategory.config";
import { ExpenseHistoryItem } from "./expenseHistoryItem.component";
import { MonthYearPickerModal } from "./monthYearPicker.component";
import { PieChartData } from "./pieChart.component";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = Array.from({ length: 20 }, (_, i) => 2026 - i);

export const HistoryScreen = () => {
  const { historyData, isLoading, fetchHistory } = useTransactionHistory();
  const [chartTitle, setChartTitle] = useState("Monthly Summary");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[new Date().getMonth()],
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchHistory(1, 100);
  }, [fetchHistory]);

  const filteredHistory = useMemo(() => {
    const monthIndex = MONTHS.indexOf(selectedMonth);
    const formattedMonth = String(monthIndex + 1).padStart(2, "0");
    const searchString = `${selectedYear}-${formattedMonth}`;

    const filtered = historyData.filter((item) => {
      if (!item.created_at) return false;
      const isCorrectDate = item.created_at.startsWith(searchString);
      const isCorrectType =
        item.transaction_type === "ONCHAIN" ||
        item.transaction_type === "OFFCHAIN";
      return isCorrectDate && isCorrectType;
    });

    return filtered.map((item) => {
      const cleanDateString = item.created_at.split(" +")[0].replace(" ", "T");
      const dateObj = new Date(cleanDateString);

      const displayDate = `${String(dateObj.getDate()).padStart(2, "0")} ${MONTHS[
        dateObj.getMonth()
      ].substring(
        0,
        3,
      )} ${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

      const rawCategory = item.category?.name || "Others";
      const validCategories = ["Food/Drink", "Shopping", "Invest", "Others"];

      const matchedCategory = validCategories.find(
        (c) => c.toLowerCase() === rawCategory.toLowerCase(),
      );

      const finalCategory = matchedCategory ? matchedCategory : "Others";

      return {
        id: String(item.id),
        date: displayDate,
        transactionId: item.transaction_uuid,
        amount: item.thb_amount.toFixed(2),
        category: finalCategory as
          | "Food/Drink"
          | "Shopping"
          | "Invest"
          | "Others",
        slipUrl: item.transaction_off_chain?.slip_url,
      };
    });
  }, [selectedMonth, selectedYear, historyData]);

  const dynamicBarData = useMemo(() => {
    const monthlyTotals = Array(12).fill(0);

    historyData.forEach((item) => {
      if (item.transaction_type === "TOPUP") return;
      if (!item.created_at) return;

      const cleanDateString = item.created_at.split(" +")[0].replace(" ", "T");
      const dateObj = new Date(cleanDateString);

      if (dateObj.getFullYear() === selectedYear) {
        monthlyTotals[dateObj.getMonth()] += item.thb_amount;
      }
    });

    return MONTHS.map((month, index) => ({
      label: month.substring(0, 3),
      value: monthlyTotals[index],
    }));
  }, [historyData, selectedYear]);

  const dynamicPieData = useMemo(() => {
    const monthIndex = MONTHS.indexOf(selectedMonth);
    const formattedMonth = String(monthIndex + 1).padStart(2, "0");
    const searchString = `${selectedYear}-${formattedMonth}`;

    let totalExpense = 0;
    const categorySums: Record<string, number> = {
      "Food/Drink": 0,
      Shopping: 0,
      Invest: 0,
      Others: 0,
    };

    historyData.forEach((item) => {
      if (item.transaction_type === "TOPUP") return;
      if (!item.created_at || !item.created_at.startsWith(searchString)) return;

      const rawCategory = item.category?.name || "Others";
      const validCategories = ["Food/Drink", "Shopping", "Invest", "Others"];
      const matchedCategory = validCategories.find(
        (c) => c.toLowerCase() === rawCategory.toLowerCase(),
      );
      const finalCategory = matchedCategory ? matchedCategory : "Others";

      categorySums[finalCategory] += item.thb_amount;
      totalExpense += item.thb_amount;
    });

    if (totalExpense === 0) {
      return [{ value: 100, color: Theme.colors.g50, label: "No Data" }];
    }

    return Object.keys(categorySums)
      .map((key) => {
        const amount = categorySums[key];
        if (amount === 0) return null;

        const percentage = Math.round((amount / totalExpense) * 100);

        const colorName =
          EXPENSE_CATEGORY_CONFIG[key as keyof typeof EXPENSE_CATEGORY_CONFIG]
            .color;
        const actualColor =
          Theme.colors[colorName as keyof typeof Theme.colors];

        return {
          label: key,
          value: percentage,
          color: actualColor,
        };
      })
      .filter(Boolean) as PieChartData[];
  }, [historyData, selectedMonth, selectedYear]);

  return (
    <GradientLayout>
      {isLoading && <LoadingSpinner overlay={true} />}
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Header */}
              <Header title="History" showBackButton={false} />

              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartTitleText}>{chartTitle}</Text>
                <Dropdown
                  label={`${selectedMonth} ${selectedYear}`}
                  onPress={() => setPickerVisible(true)}
                />
              </View>

              <ChartSection
                monthlyData={dynamicBarData}
                pieData={dynamicPieData}
                onSlideChange={(newTitle) => setChartTitle(newTitle)}
                selectedMonth={selectedMonth.substring(0, 3)}
              />

              {/* Section title */}
              <Text style={styles.sectionTitle}>Expenses History</Text>
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyItemWrapper}
              onPress={() =>
                router.push({
                  pathname: "/transferSuccessful",
                  params: {
                    from: "history",
                    txUUID: item.transactionId,
                  },
                })
              }
            >
              <ExpenseHistoryItem item={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No transactions found for {selectedMonth} {selectedYear}
                </Text>
              </View>
            ) : null
          }
        />

        <MonthYearPickerModal
          visible={isPickerVisible}
          months={MONTHS}
          years={YEARS}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onSelectMonth={setSelectedMonth}
          onSelectYear={setSelectedYear}
          onClose={() => setPickerVisible(false)}
          onConfirm={() => setPickerVisible(false)}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  chartHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  chartTitleText: {
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    color: Theme.colors.surface,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    color: Theme.colors.surface,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  historyItemWrapper: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Theme.colors.g100,
    fontSize: Theme.fontSize.textM,
  },
});
