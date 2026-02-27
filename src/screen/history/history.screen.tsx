import { Button } from "@/src/components/button/button";
import { Dropdown } from "@/src/components/button/dropdown";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
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
  { value: 950, label: "Jul" },
  { value: 350, label: "Aug" },
  { value: 850, label: "Sep" },
  { value: 600, label: "Oct" },
  { value: 400, label: "Nov" },
  { value: 750, label: "Dec" },
  { value: 500, label: "Jan" },
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
];

type HistoryTab = "Software Wallet" | "SolPay";

export const HistoryScreen = () => {
  const [selectedTab, setSelectedTab] = useState<HistoryTab>("Software Wallet");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("November");
  const [selectedYear, setSelectedYear] = useState(2025);

  return (
    <GradientLayout>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={EXPENSES_HISTORY}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Header */}
              <Text style={styles.header}>History</Text>

              {/* Tabs + Dropdown */}
              <View style={styles.tabContainer}>
                <Button
                  title="Software Wallet"
                  variant={
                    selectedTab === "Software Wallet" ? "solid" : "outline"
                  }
                  color="v300"
                  onPress={() => setSelectedTab("Software Wallet")}
                  style={[
                    styles.tabButton,
                    selectedTab !== "Software Wallet" &&
                      styles.unselectedTabButton,
                  ]}
                  textStyle={[
                    styles.tabButtonText,
                    selectedTab !== "Software Wallet" &&
                      styles.unselectedTabText,
                  ]}
                />

                <Button
                  title="SolPay"
                  variant={selectedTab === "SolPay" ? "solid" : "outline"}
                  color="v300"
                  onPress={() => setSelectedTab("SolPay")}
                  style={[
                    styles.tabButton,
                    selectedTab !== "SolPay" && styles.unselectedTabButton,
                  ]}
                  textStyle={[
                    styles.tabButtonText,
                    selectedTab !== "SolPay" && styles.unselectedTabText,
                  ]}
                />

                <Dropdown
                  label={`${selectedMonth} ${selectedYear}`}
                  onPress={() => setPickerVisible(true)}
                  style={styles.dropdownButton}
                />
              </View>

              {/* Charts */}
              <ChartSection
                monthlyData={MONTHLY_DATA}
                pieData={HISTORY_CHART_DATA}
              />

              {/* Section title */}
              <Text style={styles.sectionTitle}>Expenses History</Text>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.historyItemWrapper}>
              <ExpenseHistoryItem item={item} />
            </View>
          )}
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
  header: {
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    color: Theme.colors.surface,
    textAlign: "center",
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  tabButton: {
    minWidth: 100,
    marginRight: 9,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  unselectedTabButton: {
    borderColor: Theme.colors.v300,
  },
  tabButtonText: {
    fontSize: Theme.fontSize.h7,
    fontWeight: "500",
  },
  unselectedTabText: {
    color: Theme.colors.v100,
  },
  dropdownButton: {
    flex: 1,
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
});
