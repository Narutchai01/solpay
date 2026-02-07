import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/theme/theme";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const SwapSuccessScreen = () => {
  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Success Icon */}
          <Image
            source={require("@/assets/images/success-icon.png")}
            style={styles.successIcon}
          />

          {/* Detail Card */}
          <GlassCard style={styles.detailCard}>
            <DetailRow label="Transaction Id" value="11111111" />
            <DetailRow label="Exchange Rate" value="1 USDT ≈ 0.0072 SOL" />
            <DetailRow label="Fee" value="0.00 THB" />
            <DetailRow label="SOL Amount" value="2.50 SOL" />
            <DetailRow label="USDT Amount" value="345.16312 USDT" />
            <DetailRow label="Completion date" value="27 Nov 2025 - 18:43" />
          </GlassCard>
        </View>

        {/* Button */}
        <View style={styles.button}>
          <Button
            title="Done"
            variant="solid"
            color="v300"
            onPress={() => router.replace("/(tabs)")}
            style={styles.doneButton}
            textColor="g300"
          />
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  // Icon
  successIcon: {
    width: 125,
    height: 103,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  // Card
  detailCard: {
    width: "100%",
    paddingHorizontal: 12,
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
  },
  // Button
  button: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  doneButton: {
    paddingVertical: 10,
  },
});
