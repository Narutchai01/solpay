import { GlassCard } from "@/src/components/card/glass";
import React, { useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { Theme } from "../../core/theme/theme";
import { BarChartData, MonthlyBarChart } from "./monthlyBarChart.component";
import { PieChartComponent, PieChartData } from "./pieChart.component";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Props {
  monthlyData: BarChartData[];
  pieData: PieChartData[];
}

export const ChartSection = ({ monthlyData, pieData }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: "bar",
      title: "Monthly Summary",
      component: <MonthlyBarChart data={monthlyData} />,
    },
    {
      id: "pie",
      title: "Expense Breakdown",
      component: <PieChartComponent data={pieData} />,
    },
  ];

  return (
    <>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        snapToInterval={SCREEN_WIDTH}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={{ height: 410 }}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setActiveIndex(Math.round(x / SCREEN_WIDTH));
        }}
        renderItem={({ item }) => (
          <View style={styles.slideWrapper}>
            <Text style={styles.title}>{item.title}</Text>
            <GlassCard>{item.component}</GlassCard>
          </View>
        )}
      />

      <FlatList
        data={slides}
        horizontal
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.pagination}
        style={{ width: SCREEN_WIDTH, marginTop: 24 }}
        renderItem={({ index }) => (
          <View
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 24,
    width: "100%",
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginHorizontal: 4 },
  activeDot: { backgroundColor: Theme.colors.v300 },
  inactiveDot: { backgroundColor: Theme.colors.g50 },
});
