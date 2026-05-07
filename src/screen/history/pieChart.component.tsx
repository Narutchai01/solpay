import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  const isEmpty =
    !data ||
    data.length === 0 ||
    (data.length === 1 && data[0].label === "No Data");

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrapper}>
          <MaterialCommunityIcons
            name="chart-donut"
            size={88}
            color={Theme.colors.g75}
          />
        </View>
        <Text style={styles.emptyTitle}>No expense data</Text>
      </View>
    );
  }

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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 360,
  },
  emptyIconWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: 20,
  },
  emptyTitle: {
    color: Theme.colors.g75,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    marginBottom: 6,
  },
});
