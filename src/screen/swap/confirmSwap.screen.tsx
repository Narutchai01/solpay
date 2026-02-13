import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ConfirmSwapScreen = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons
              name="chevron-back"
              size={28}
              color={Theme.colors.surface}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Swap</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.container}>
          <View style={styles.swapSection}>
            {/* From */}
            <GlassCard style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.label}>From:</Text>
                <View style={styles.balanceRow}>
                  <Ionicons
                    name="wallet-outline"
                    size={18}
                    color={Theme.colors.surface}
                  />
                  <Text style={styles.balanceText}>5 SOL</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.tokenDisplay}>
                  <Image
                    source={require("@/assets/images/usdt-icon.png")}
                    style={styles.tokenIcon}
                  />
                  <Text style={styles.tokenName}>SOL</Text>
                </View>
                <Text style={styles.amountText}>125</Text>
              </View>
            </GlassCard>

            {/* Connector */}
            <View style={{ height: 85 }} />

            <View style={styles.connectorContainer}>
              <View style={styles.verticalLine} />
              <View style={styles.arrowCircle}>
                <Ionicons
                  name="arrow-down"
                  size={18}
                  color={Theme.colors.surface}
                />
              </View>
              <View style={styles.verticalLine} />
            </View>

            {/* To */}
            <GlassCard style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.label}>To:</Text>
                <View style={styles.balanceRow}>
                  <Ionicons
                    name="wallet-outline"
                    size={18}
                    color={Theme.colors.surface}
                  />
                  <Text style={styles.balanceText}>500 USDT</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.tokenDisplay}>
                  <Image
                    source={require("@/assets/images/usdt-icon.png")}
                    style={styles.tokenIcon}
                  />
                  <Text style={styles.tokenName}>USDT</Text>
                </View>
                <Text style={styles.amountText}>172.587371</Text>
              </View>

              <Text style={styles.rateText}>1 USDT ≈ 0.0072 SOL</Text>
            </GlassCard>
          </View>

          {/* Fee */}
          <GlassCard style={styles.feeCard}>
            <Text style={styles.feeLabel}>Fee</Text>
            <Text style={styles.feeAmount}>0.00 THB</Text>
          </GlassCard>
        </View>

        {/* Button */}
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
            onPress={() => router.replace("/swapSuccess")}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    color: Theme.colors.surface,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  // Swap Section
  swapSection: {
    position: "relative",
  },
  card: {
    padding: 12,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  tokenDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tokenName: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "500",
    marginRight: 4,
  },
  amountText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
  },
  rateText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    paddingVertical: 12,
  },
  // Connector
  connectorContainer: {
    position: "absolute",
    left: 12,
    top: 140,
    alignItems: "center",
    zIndex: 10,
  },
  verticalLine: {
    width: 1.5,
    height: 22,
    backgroundColor: Theme.colors.v300,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 16,
    backgroundColor: Theme.colors.v300,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 0,
  },
  // Fee
  feeCard: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  feeLabel: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
  feeAmount: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
  // Button Footer
  footer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 10,
  },
});
