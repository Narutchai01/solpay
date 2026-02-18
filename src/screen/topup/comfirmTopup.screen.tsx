import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/core/theme/theme";
import { LabelValueItem } from "@/src/core/type/detail-item.type";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const topupData: LabelValueItem[] = [
  { label: "THB Amount", value: "200 THB" },
  { label: "USDT Amount", value: "6.18 USDT" },
  { label: "Fee", value: "0.00 USDT" },
  { label: "Exchange Rate", value: "1 USDT  = 32.39 THB" },
];

export const ComfirmTopupScreen = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const DetailRow = ({ label, value }: LabelValueItem) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Confirm</Text>
          </View>

          <GlassCard style={[styles.detailCard]}>
            <FlatList
              data={topupData}
              keyExtractor={(item, index) => `${item.label}-${index}`}
              renderItem={({ item }) => (
                <DetailRow label={item.label} value={item.value} />
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </GlassCard>
        </View>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            variant="solid"
            color="g200"
            onPress={() => setShowCancelModal(true)}
            style={styles.footerButton}
            textColor="surface"
          />
          <Button
            title="Confirm"
            variant="solid"
            color="v300"
            onPress={() => router.replace("/topupSuccess")}
            style={[styles.footerButton, { marginLeft: 16 }]}
            textColor="g300"
          />
        </View>

        <ConfirmModal
          visible={showCancelModal}
          title="Do you wish to cancel?"
          cancelLabel="No"
          confirmLabel="Yes"
          onCancel={() => setShowCancelModal(false)}
          onConfirm={() => {
            setShowCancelModal(false);
            router.back();
          }}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  headerTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
  },
  detailCard: {
    width: "100%",
    paddingHorizontal: 12,
    marginTop: 32,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowLabel: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "500",
  },
  rowValue: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 10,
  },
});
