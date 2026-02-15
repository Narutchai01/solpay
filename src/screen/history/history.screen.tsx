import { Button } from "@/src/components/button/button";
import { Dropdown } from "@/src/components/button/dropdown";
import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import React, { useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";
import {
  ExpenseHistoryData,
  ExpenseHistoryItem,
} from "./expenseHistoryItem.component";
import { BarChartData, MonthlyBarChart } from "./monthlyBarChart.component";
import { MonthYearPickerModal } from "./monthYearPicker.component";
import { PieChartComponent, PieChartData } from "./pieChart.component";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

const HISTORY_CHART_DATA: PieChartData[] = [
  { value: 50, color: Theme.colors.violet, label: "Food/Drink" },
  { value: 20, color: Theme.colors.coral, label: "Shopping" },
  { value: 20, color: Theme.colors.cyan, label: "Invest" },
  { value: 10, color: Theme.colors.amber, label: "Others" },
];

const MONTHLY_DATA: BarChartData[] = [
  { value: 950, label: "Jul" },
  { value: 350, label: "Aug" },
  { value: 850, label: "Sep" },
  { value: 600, label: "Oct" },
  { value: 400, label: "Nov" },
  {
    value: 250,
    label: "Nov",
    frontColor: Theme.colors.v300,
    topLabelComponent: () => (
      <Text style={{ color: "white", fontSize: 12, marginBottom: 6 }}>
        625 THB
      </Text>
    ),
  },
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<HistoryTab>("Software Wallet");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("November");
  const [selectedYear, setSelectedYear] = useState(2025);

  const slides = [
    {
      id: "pie",
      title: "Expense Breakdown",
      component: <PieChartComponent data={HISTORY_CHART_DATA} />,
    },
    {
      id: "bar",
      title: "Monthly Summary",
      component: <MonthlyBarChart data={MONTHLY_DATA} />,
    },
  ];

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={styles.slideWrapper}>
      <Text style={styles.title}>{item.title}</Text>
      <GlassCard style={styles.card}>{item.component}</GlassCard>
    </View>
  );

  const ListHeader = () => (
    <View>
      <View style={styles.tabContainer}>
        <Button
          title="Software Wallet"
          variant={selectedTab === "Software Wallet" ? "solid" : "outline"}
          color="v300"
          onPress={() => setSelectedTab("Software Wallet")}
          style={[
            styles.tabButton,
            selectedTab !== "Software Wallet" && styles.unselectedTabButton,
          ]}
          textStyle={[
            styles.tabButtonText,
            selectedTab !== "Software Wallet" && styles.unselectedTabText,
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

      <FlatList
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        snapToInterval={SCREEN_WIDTH}
        showsHorizontalScrollIndicator={false}
        // TODO: Horizontal FlatList is nested inside a vertical FlatList.
        // This causes gesture conflict, requiring two swipes to change chart.
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setActiveIndex(Math.round(x / SCREEN_WIDTH));
        }}
        keyExtractor={(item) => item.id}
        style={styles.horizontalFlatList}
      />

      <FlatList
        data={slides}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.pagination}
        scrollEnabled={false}
        renderItem={({ index }) => (
          <View
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        )}
      />

      <Text style={styles.sectionTitle}>Expenses History</Text>
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.header}>History</Text>
        <FlatList
          data={EXPENSES_HISTORY}
          renderItem={({ item }) => (
            <View style={styles.historyItemWrapper}>
              <ExpenseHistoryItem item={item} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.mainListContent}
          showsVerticalScrollIndicator={false}
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
          onConfirm={() => {
            console.log(selectedMonth, selectedYear);
          }}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  mainListContent: { paddingBottom: 24 },
  header: {
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    color: Theme.colors.surface,
    textAlign: "center",
    marginBottom: 24,
  },
  horizontalFlatList: { height: 430, flexGrow: 0 },
  slideWrapper: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    color: Theme.colors.surface,
    marginBottom: 16,
  },
  card: { width: "100%" },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH,
    marginTop: 5,
    marginBottom: 24,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginHorizontal: 4 },
  activeDot: { backgroundColor: Theme.colors.v300 },
  inactiveDot: { backgroundColor: Theme.colors.g50 },
  historyItemWrapper: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    color: Theme.colors.surface,
    marginBottom: 16,
    paddingHorizontal: 16,
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
  unselectedTabButton: { borderColor: Theme.colors.v300 },
  tabButtonText: { fontSize: Theme.fontSize.h7, fontWeight: "500" },
  unselectedTabText: { color: Theme.colors.v100 },
  dropdownButton: { flex: 1, marginLeft: 10 },
});
