import React from "react";
import { StyleSheet, View } from "react-native";
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
}

export const MonthlyBarChart = ({ data }: MonthlyBarChartProps) => {
  return (
    <View style={styles.container} pointerEvents="none">
      <BarChart
        data={data}
        barWidth={40}
        height={285}
        spacing={20}
        barBorderRadius={10}
        hideRules
        hideYAxisText
        yAxisThickness={0}
        xAxisThickness={0}
        noOfSections={3}
        maxValue={1000}
        xAxisLabelTextStyle={styles.labelText}
        frontColor={Theme.colors.g50}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
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
    fontSize: Theme.fontSize.h7,
    marginBottom: 4,
    fontWeight: "500",
  },
});
