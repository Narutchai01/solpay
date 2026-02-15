import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Theme } from "../../core/theme/theme";

export interface PieChartData {
  value: number;
  color: string;
  label: string;
}

interface PieChartComponentProps {
  data: PieChartData[];
}

const LegendItem = ({ item }: { item: PieChartData }) => (
  <View style={styles.legendRow}>
    <View style={styles.legendLeft}>
      <View style={[styles.dot, { backgroundColor: item.color }]} />
      <Text style={styles.legendText}>{item.label}</Text>
    </View>
    <Text style={styles.percentageText}>{item.value}%</Text>
  </View>
);

export const PieChartComponent = ({ data }: PieChartComponentProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper} pointerEvents="none">
        <PieChart
          data={data}
          donut
          radius={90}
          innerCircleColor={"transparent"}
          backgroundColor="transparent"
          centerLabelComponent={() => (
            <View style={{ backgroundColor: "transparent" }} />
          )}
        />
      </View>

      <View style={styles.legendContainer}>
        <FlatList
          data={data}
          renderItem={({ item }) => <LegendItem item={item} />}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  chartWrapper: {
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  legendContainer: {
    width: "100%",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  legendText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "500",
  },
  percentageText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "500",
  },
});
