import { GlassCard } from "@/src/components/card/glass";
import React, { useState } from "react";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";
import { Theme } from "../../core/theme/theme";
import { BarChartData, MonthlyBarChart } from "./monthlyBarChart.component";
import { PieChartComponent, PieChartData } from "./pieChart.component";

interface Props {
  monthlyData: BarChartData[];
  pieData: PieChartData[];
  onSlideChange?: (title: string) => void;
  selectedMonth: string;
}

export const ChartSection = ({
  monthlyData,
  pieData,
  onSlideChange,
  selectedMonth,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const slides = [
    {
      id: "bar",
      title: "Monthly Summary",
      component: (
        <MonthlyBarChart data={monthlyData} selectedMonth={selectedMonth} />
      ),
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
        style={{ height: 365 }}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const newIndex = Math.round(x / SCREEN_WIDTH);
          setActiveIndex(newIndex);
          if (onSlideChange) {
            onSlideChange(slides[newIndex].title);
          }
        }}
        renderItem={({ item }) => (
          <View style={[styles.slideWrapper, { width: SCREEN_WIDTH }]}>
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
        style={{ width: SCREEN_WIDTH, marginTop: 16 }}
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
    paddingHorizontal: 16,
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
