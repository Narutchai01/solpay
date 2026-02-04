import { GlassCard } from "@/src/components/card/glass";
import { Theme } from "@/src/core/theme/theme";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface HistoryItem {
  id: string;
  date: string;
  transactionId: string;
  amount: string;
  usdt: string;
}

interface HistoryListProps {
  data: HistoryItem[];
}

const HistoryCard = ({ item }: { item: HistoryItem }) => (
  <GlassCard style={styles.historyItem}>
    <View style={styles.historyInner}>
      <View>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={styles.historyId}>{item.transactionId}</Text>
      </View>
      <View style={styles.historyRight}>
        <Text style={styles.historyAmount}>+ {item.amount} THB</Text>
        <Text style={styles.historyUsdt}>~{item.usdt} USDT</Text>
      </View>
    </View>
  </GlassCard>
);

export const HistoryListComponent = ({ data }: HistoryListProps) => {
  return (
    <View style={styles.historySection}>
      <Text style={styles.sectionTitle}>Top Up History</Text>
      <FlatList
        data={data}
        renderItem={HistoryCard}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  historySection: { marginTop: 32 },
  sectionTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "semibold",
    marginBottom: 16,
  },
  historyItem: { marginBottom: 16 },
  historyInner: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyDate: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "semibold",
  },
  historyId: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textS,
    marginTop: 4,
  },
  historyRight: { alignItems: "flex-end" },
  historyAmount: {
    color: Theme.colors.success,
    fontSize: Theme.fontSize.h6,
    fontWeight: "semibold",
  },
  historyUsdt: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textS,
    marginTop: 4,
  },
});
