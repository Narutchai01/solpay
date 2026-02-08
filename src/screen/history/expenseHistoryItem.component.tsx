import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { Theme } from "@/src/theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    EXPENSE_CATEGORY_CONFIG,
    ExpenseCategory,
} from "./expenseCategory.config";

export interface ExpenseHistoryData {
  id: string;
  date: string;
  transactionId: string;
  amount: string;
  category: ExpenseCategory;
}

interface ExpenseHistoryItemProps {
  item: ExpenseHistoryData;
}

export const ExpenseHistoryItem = ({ item }: ExpenseHistoryItemProps) => {
  const categoryConfig = EXPENSE_CATEGORY_CONFIG[item.category];

  return (
    <GlassCard style={styles.historyCard}>
      <View style={styles.historyContent}>
        <View style={styles.topRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.idText}>{item.transactionId}</Text>

            <Button
              title={item.category}
              variant="tag"
              color={categoryConfig.color}
              style={[
                styles.categoryButton,
                { borderColor: Theme.colors[categoryConfig.color] },
              ]}
              textStyle={styles.categoryText}
              icon={
                <MaterialCommunityIcons
                  name={categoryConfig.icon}
                  size={16}
                  color={Theme.colors.g300}
                />
              }
            />
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.amountWrapper}>
              <Text style={styles.amountText}>- {item.amount} THB</Text>
            </View>
          </View>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  historyCard: {
    marginBottom: 16,
  },
  historyContent: {
    padding: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftColumn: {
    flex: 1,
    justifyContent: "center",
    rowGap: 8,
  },
  rightColumn: {
    justifyContent: "center",
    alignItems: "center",
  },
  amountWrapper: {
    justifyContent: "center",
  },
  dateText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
  idText: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.textS,
  },
  amountText: {
    color: Theme.colors.errorText,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
  tagIcon: {
    marginRight: 6,
  },
  categoryButton: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: Theme.fontSize.textS,
    fontWeight: "500",
    color: Theme.colors.g300,
  },
});
