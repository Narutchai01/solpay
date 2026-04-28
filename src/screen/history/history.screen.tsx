import { Dropdown } from "@/src/components/button/dropdown";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
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
import {
  ExpenseHistoryData,
  ExpenseHistoryItem,
} from "./expenseHistoryItem.component";
import { MonthYearPickerModal } from "./monthYearPicker.component";
import { BarChartData } from "./monthlyBarChart.component";
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

const MONTHLY_DATA: BarChartData[] = [
  { value: 5050, label: "Jul" },
  { value: 350, label: "Aug" },
  { value: 850, label: "Sep" },
  { value: 1600, label: "Oct" },
  { value: 400, label: "Nov" },
  { value: 750, label: "Dec" },
  { value: 500, label: "Jan" },
  { value: 150, label: "Apr" },
];

const HISTORY_CHART_DATA: PieChartData[] = [
  { value: 50, color: Theme.colors.violet, label: "Food/Drink" },
  { value: 20, color: Theme.colors.coral, label: "Shopping" },
  { value: 20, color: Theme.colors.cyan, label: "Invest" },
  { value: 10, color: Theme.colors.amber, label: "Others" },
];

const EXPENSES_HISTORY: ExpenseHistoryData[] = [
  {
    id: "1",
    date: "21 Nov 2025 18:43",
    transactionId: "transaction id",
    amount: "125.00",
    category: "Food/Drink",
  },
  {
    id: "2",
    date: "20 Nov 2025 12:30",
    transactionId: "transaction id",
    amount: "450.00",
    category: "Shopping",
  },
  {
    id: "3",
    date: "19 Nov 2025 09:15",
    transactionId: "transaction id",
    amount: "300.00",
    category: "Invest",
  },
  {
    id: "4",
    date: "18 Nov 2025 14:20",
    transactionId: "transaction id",
    amount: "75.00",
    category: "Others",
  },
  {
    id: "5",
    date: "05 Apr 2026 10:00",
    transactionId: "transaction id",
    amount: "150.00",
    category: "Food/Drink",
  },
];

export const HistoryScreen = () => {
  const [chartTitle, setChartTitle] = useState("Monthly Summary");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[new Date().getMonth()],
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filteredHistory = useMemo(() => {
    const shortMonth = selectedMonth.substring(0, 3);
    const searchString = `${shortMonth} ${selectedYear}`;

    return EXPENSES_HISTORY.filter((item) => item.date.includes(searchString));
  }, [selectedMonth, selectedYear]);

  return (
    <GradientLayout>
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

              {/* Charts */}
              <ChartSection
                monthlyData={MONTHLY_DATA}
                pieData={HISTORY_CHART_DATA}
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
                  params: { from: "history", id: item.id },
                })
              }
            >
              <ExpenseHistoryItem item={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No transactions found for {selectedMonth} {selectedYear}
              </Text>
            </View>
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
