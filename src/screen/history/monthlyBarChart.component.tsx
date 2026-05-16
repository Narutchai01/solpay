import React, { useMemo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Theme } from "../../core/theme/theme";

export interface BarChartData {
  value: number;
  label: string;
  frontColor?: string;
  topLabelComponent?: () => React.ReactElement;
}

interface MonthlyBarChartProps {
  data: BarChartData[];
  selectedMonth: string;
  selectedYear?: number;
}

const ALL_MONTHS = [
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

export const MonthlyBarChart = ({
  data,
  selectedMonth,
  selectedYear = new Date().getFullYear(),
}: MonthlyBarChartProps) => {
  const { width } = useWindowDimensions();

  const shortSelectedMonth = selectedMonth.substring(0, 3);
  const displayMonths = data.map((d) => d.label);

  const maxDataValue = Math.max(...data.map((item) => item.value));

  const rawMax = Math.max(1000, maxDataValue * 1.2);
  const roundStep = rawMax > 10000 ? 1000 : 100;
  const chartMaxValue = Math.ceil(rawMax / roundStep) * roundStep;

  const mappedData = data.map((item) => {
    const isSelected = item.label === shortSelectedMonth;
    const actualValue = item.value;

    let displayValue = actualValue;
    if (actualValue === 0) {
      displayValue = chartMaxValue * 0.01;
    } else if (actualValue < chartMaxValue * 0.05) {
      displayValue = chartMaxValue * 0.05;
    }

    return {
      value: displayValue,
      label: item.label,
      frontColor: isSelected ? Theme.colors.v300 : Theme.colors.g50,
      topLabelComponent: isSelected
        ? () => <Text style={styles.topLabelText}>{actualValue} THB</Text>
        : undefined,
    };
  });

  const availableWidth = width - 90; // Account for y-axis and padding
  const itemCount = mappedData.length;
  const barWidth = 24;

  // Provide enough end spacing so the 80px wide topLabel doesn't clip on the final bar
  let initialSpacing = 10;
  let endSpacing = 35;

  let spacing = 0;
  if (itemCount > 1) {
    const spaceForGaps =
      availableWidth - barWidth * itemCount - initialSpacing - endSpacing;
    spacing = Math.max(0, Math.floor(spaceForGaps / (itemCount - 1)));
  } else {
    initialSpacing = (availableWidth - barWidth) / 2;
    endSpacing = initialSpacing;
  }

  const exactChartWidth =
    initialSpacing +
    barWidth * itemCount +
    spacing * (itemCount > 1 ? itemCount - 1 : 0) +
    endSpacing;

  if (mappedData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.labelText}>No Data Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <BarChart
        data={mappedData}
        width={exactChartWidth}
        barWidth={barWidth}
        height={285}
        spacing={spacing}
        initialSpacing={initialSpacing}
        endSpacing={endSpacing}
        barBorderRadius={8}
        yAxisThickness={1}
        xAxisThickness={1}
        xAxisColor={Theme.colors.g50}
        yAxisColor={Theme.colors.g50}
        rulesColor={`${Theme.colors.g50}50`}
        rulesType="dashed"
        dashWidth={4}
        dashGap={8}
        yAxisTextStyle={styles.labelText}
        yAxisLabelWidth={45}
        noOfSections={4}
        maxValue={chartMaxValue}
        xAxisLabelTextStyle={styles.labelText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textS,
    textAlign: "center",
  },
  topLabelText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textS,
    marginBottom: 4,
    fontWeight: "500",
    textAlign: "center",
    width: 80,
  },
});
