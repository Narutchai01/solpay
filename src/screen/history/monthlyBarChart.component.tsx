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
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const isCurrentYear = selectedYear === currentYear;

  const availableMonths = useMemo(() => {
    if (isCurrentYear) {
      return ALL_MONTHS.slice(0, currentMonthIndex + 1);
    }
    return ALL_MONTHS;
  }, [isCurrentYear, currentMonthIndex]);

  const shortSelectedMonth = selectedMonth.substring(0, 3);
  let selectedIndex = availableMonths.indexOf(shortSelectedMonth);
  if (selectedIndex === -1) selectedIndex = 0;

  const startIndex = selectedIndex < 6 ? 0 : 6;
  const displayMonths = availableMonths.slice(startIndex, startIndex + 6);

  const maxDataValue = Math.max(
    ...displayMonths.map((monthLabel) => {
      const foundData = data.find((item) => item.label === monthLabel);
      return foundData ? foundData.value : 0;
    }),
  );

  const rawMax = Math.max(1000, maxDataValue * 1.2);
  const roundStep = rawMax > 10000 ? 1000 : 100;
  const chartMaxValue = Math.ceil(rawMax / roundStep) * roundStep;

  const mappedData = displayMonths.map((monthLabel) => {
    const foundData = data.find((item) => item.label === monthLabel);
    const isSelected = monthLabel === shortSelectedMonth;
    const actualValue = foundData ? foundData.value : 0;

    let displayValue = actualValue;
    if (actualValue === 0) {
      displayValue = chartMaxValue * 0.01;
    } else if (actualValue < chartMaxValue * 0.05) {
      displayValue = chartMaxValue * 0.05;
    }

    return {
      value: displayValue,
      label: monthLabel,
      frontColor: isSelected ? Theme.colors.v300 : Theme.colors.g50,
      topLabelComponent: isSelected
        ? () => <Text style={styles.topLabelText}>{actualValue} THB</Text>
        : undefined,
    };
  });

  const availableWidth = width - 130;
  const itemCount = displayMonths.length;
  const barWidth = 24;
  const sideSpacing = 30;

  let spacing = 0;
  if (itemCount > 1) {
    const spaceForGaps =
      availableWidth - barWidth * itemCount - sideSpacing * 2;
    spacing = Math.max(0, Math.floor(spaceForGaps / (itemCount - 1)));
  }

  const dynamicInitialSpacing =
    itemCount === 1 ? (availableWidth - barWidth) / 2 : sideSpacing;

  const exactChartWidth =
    dynamicInitialSpacing +
    barWidth * itemCount +
    spacing * (itemCount > 1 ? itemCount - 1 : 0) +
    dynamicInitialSpacing;

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
        initialSpacing={dynamicInitialSpacing}
        endSpacing={dynamicInitialSpacing}
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
