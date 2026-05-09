import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { useSwap } from "@/src/hooks/useSwap";
import { useAuthStore } from "@/src/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";

export const ConfirmSwapScreen = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (title: string, message: string) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setShowErrorModal(true);
  };
  const [isSigning, setIsSigning] = useState(false);
  const {
    fromToken,
    amountIn,
    amountOut,
    currentPrice,
    slippage,
    getSwapQuote,
    buildSwapTransactionByInstruction,
    executeSwap,
    loading,
  } = useSwap();

  useEffect(() => {
    if (amountIn) {
      void getSwapQuote({
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: "USDCoctVLVnvTXBEuP9s8hntucdJokbo17RwHuNXemT",
        amountIn: amountIn,
        slippage: parseFloat(slippage) / 100,
      });
    }
  }, [amountIn, getSwapQuote, slippage]);

  const handleConfirm = async () => {
    // Capture current values to ensure consistency throughout the async flow
    const currentAmountIn = amountIn;
    const currentAmountOut = amountOut;
    const currentSlippage = slippage;

    if (!currentAmountIn || !currentAmountOut) {
      showError("Error", "Missing amount information.");
      return;
    }

    setIsSigning(true);
    try {
      console.log("--- Starting Swap Confirmation ---");
      console.log(
        `[Screen] Input: ${currentAmountIn}, Expected: ${currentAmountOut}, Slippage: ${currentSlippage}`,
      );

      // 1 & 2. Build instructions, get FRESH blockhash, and sign transaction
      console.log(
        "[Screen] Step 1: Initiating instruction-based transaction building...",
      );
      const signedTxBase64 = await buildSwapTransactionByInstruction({
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: "USDCoctVLVnvTXBEuP9s8hntucdJokbo17RwHuNXemT",
        amountIn: currentAmountIn,
        slippage: parseFloat(currentSlippage) / 100,
      });

      if (!signedTxBase64) {
        throw new Error("Failed to build or sign transaction.");
      }

      // 3. Execute the swap via backend
      console.log("[Screen] Step 2: Sending signed transaction to backend...");
      const result = await executeSwap({
        sol_amount: currentAmountIn,
        usdt_amount: currentAmountOut,
        tx_hash: signedTxBase64,
      });

      console.log("[Screen] Step 3: Result received from backend");

      if (result) {
        console.log("[Screen] Success! Redirecting to swapSuccess");
        router.replace({
          pathname: "/swapSuccess",
          params: {
            txUUID: result.transaction_uuid,
            txHash: result.transaction_on_chain?.signature,
          },
        });
      } else {
        showError(
          "Execution Failed",
          "The server could not process the swap. The blockhash might have expired or the price moved beyond your slippage.",
        );
      }
    } catch (error) {
      console.error("[Screen] handleConfirm Error Detail:", error);
      showError(
        "Swap Failed",
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsSigning(false);
      console.log("--- Swap Confirmation Flow Finished ---");
    }
  };

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Swap" />

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
                  <Text style={styles.balanceText}>
                    {fromToken?.val || "0"}{" "}
                    {fromToken?.name === "Solana"
                      ? "SOL"
                      : fromToken?.name || ""}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.tokenDisplay}>
                  <Image
                    source={require("@/assets/images/sol-logo.png")}
                    style={styles.tokenIcon}
                  />
                  <Text style={styles.tokenName}>
                    {fromToken?.name || "SOL"}
                  </Text>
                </View>
                <Text style={styles.amountText}>{amountIn}</Text>
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
                  <Text style={styles.balanceText}>Balance: -- USDC</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.tokenDisplay}>
                  <Image
                    source={require("@/assets/images/usdc-icon.jpg")}
                    style={styles.tokenIcon}
                  />
                  <Text style={styles.tokenName}>USDC</Text>
                </View>
                {loading ? (
                  <ActivityIndicator color={Theme.colors.surface} />
                ) : (
                  <Text style={styles.amountText}>{amountOut}</Text>
                )}
              </View>

              <Text style={styles.rateText}>
                1 {fromToken?.name || "SOL"} ≈ {currentPrice} USDC
              </Text>
            </GlassCard>
          </View>

          {/* Fee */}
          {/*<GlassCard style={styles.feeCard}>
            <Text style={styles.feeLabel}>Fee</Text>
            <Text style={styles.feeAmount}>0.00</Text>
          </GlassCard>*/}
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
            disabled={isSigning}
          />
          <Button
            title={isSigning ? "Signing..." : "Confirm"}
            variant="solid"
            color="v300"
            onPress={handleConfirm}
            style={[styles.footerButton, { marginLeft: 16 }]}
            textColor="g300"
            disabled={isSigning || loading}
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

        <ConfirmModal
          visible={showErrorModal}
          iconName="close-circle"
          iconColor={Theme.colors.errorText}
          title={errorTitle}
          description={errorMessage}
          confirmLabel="Close"
          onConfirm={() => setShowErrorModal(false)}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
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
    backgroundColor: Theme.colors.onSurface,
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
