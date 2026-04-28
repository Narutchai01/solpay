import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
}: MonthlyBarChartProps) => {
  const shortSelectedMonth = selectedMonth.substring(0, 3);
  const selectedIndex = ALL_MONTHS.indexOf(shortSelectedMonth);
  const startIndex = selectedIndex < 6 ? 0 : 6;
  const displayMonths = ALL_MONTHS.slice(startIndex, startIndex + 6);

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

  return (
    <View style={styles.container} pointerEvents="none">
      <BarChart
        data={mappedData}
        barWidth={35}
        height={285}
        spacing={20}
        barBorderRadius={8}
        yAxisThickness={1}
        xAxisThickness={1}
        xAxisColor={Theme.colors.g50}
        yAxisColor={Theme.colors.g50}
        rulesColor={`${Theme.colors.g50}50`}
        rulesType="dashed"
        dashWidth={4}
        dashGap={8}
        initialSpacing={15}
        endSpacing={15}
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
    left: 0,
  },
});
