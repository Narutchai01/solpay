// TODO: This screen is now fully functional with token selection, amount input, percentage quick-select, and slippage settings. The swap button navigates to a confirmation screen where the user can review details before executing the swap. The current price is displayed for reference when entering amounts.
import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { useSwap } from "@/src/hooks/useSwap";
import { useTokenAccounts } from "@/src/hooks/useTokenAccounts";
import { useSwapCalculator } from "@/src/hooks/useSwapCalculator";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";
import { SlippageModal } from "./slippageModal.component";
import { TokenAsset, TokenSelectModal } from "./tokenSelectModal.component";

export const SwapScreen = () => {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { assets } = useTokenAccounts();
  const {
    fromToken,
    slippage,
    setFromToken,
    setSlippage,
    reset,
    setCurrentPrice,
  } = useSwap();

  // Find USDT/USDC balance for the "To" section
  const targetAsset = useMemo(() => {
    return assets.find((a) => a.currency === "USDT" || a.currency === "USDC");
  }, [assets]);

  const targetBalance = targetAsset?.val || "0";
  const targetSymbol = targetAsset?.currency || "USDT";

  const {
    payAmount: amountIn,
    receiveAmount: amountOut,
    currentPrice,
    handlePayAmountChange,
    handleReceiveAmountChange,
    canSwap,
  } = useSwapCalculator();

  const [isModalVisible, setModalVisible] = React.useState<boolean>(false);
  const [isSlippageVisible, setSlippageVisible] =
    React.useState<boolean>(false);

  const mappedAssets: TokenAsset[] = useMemo(() => {
    return assets.map((asset, index) => ({
      id: index + 1, // keeping numeric ID for the component
      mint: asset.id, // storing actual mint in a new field or reusing id if needed
      name: asset.name,
      sub: asset.sub,
      val: asset.val,
      icon: asset.icon,
      imageUri: asset.imageUri,
    }));
  }, [assets]);

  useEffect(() => {
    if (mappedAssets.length > 0 && !fromToken) {
      setFromToken(mappedAssets[0]);
    }
  }, [mappedAssets, fromToken, setFromToken]);

  const percentageOptions = ["25%", "50%", "75%", "MAX"];

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Swap" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.container,
              {
                paddingHorizontal: width * 0.04,
                paddingTop: height * 0.02,
              },
            ]}
          >
            {/* Select Section */}
            <View style={styles.bigCard}>
              <TouchableOpacity
                onPress={() => {
                  const savedPrice = currentPrice;
                  reset();
                  // Restore the price since reset() clears it
                  if (savedPrice) {
                    setCurrentPrice(savedPrice);
                  }
                  handlePayAmountChange("0");
                }}
              >
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name="repeat"
                    size={20}
                    color={Theme.colors.surface}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setSlippageVisible(true)}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons
                    name="timer-settings-outline"
                    size={20}
                    color={Theme.colors.surface}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* From Section */}
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
                <TouchableOpacity
                  style={styles.tokenSelector}
                  onPress={() => setModalVisible(true)}
                >
                  <View style={styles.tokenIcon}>
                    {fromToken?.icon ? (
                      <Image
                        source={{ uri: fromToken.icon }}
                        style={{ width: 32, height: 32, borderRadius: 16 }}
                      />
                    ) : (
                      <Ionicons
                        name={fromToken?.icon || "help-circle-outline"}
                        size={28}
                        color={Theme.colors.onSurface}
                      />
                    )}
                  </View>
                  <Text style={styles.tokenName}>
                    {fromToken?.name || "Select"}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={24}
                    color={Theme.colors.surface}
                  />
                </TouchableOpacity>

                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={Theme.colors.surface}
                  keyboardType="numeric"
                  value={amountIn === "0" ? "" : amountIn}
                  onChangeText={handlePayAmountChange}
                />
              </View>

              <View style={styles.percentRow}>
                {percentageOptions.map((item) => (
                  <Button
                    key={item}
                    title={item}
                    variant="outline"
                    color="v300"
                    onPress={() => {
                      if (fromToken) {
                        const maxVal = parseFloat(fromToken.val);
                        let calculated = "0";
                        if (item === "MAX") calculated = maxVal.toString();
                        else {
                          const percent = parseInt(item.replace("%", "")) / 100;
                          calculated = (maxVal * percent).toString();
                        }
                        handlePayAmountChange(calculated);
                      }
                    }}
                    style={styles.percentButton}
                    textColor="v100"
                  />
                ))}
              </View>
            </GlassCard>

            {/* Swap Arrow Button */}
            <View style={styles.arrowContainer}>
              <View style={styles.arrowButton}>
                <Ionicons name="arrow-down" size={32} color="white" />
              </View>
            </View>

            {/* To Section (Locked to USDT for now or implement target select) */}
            <GlassCard style={styles.card}>
              <View style={styles.usdtHeaderRow}>
                <Text style={styles.label}>To:</Text>
                <View style={styles.balanceRow}>
                  <Ionicons
                    name="wallet-outline"
                    size={18}
                    color={Theme.colors.surface}
                  />
                  <Text style={styles.balanceText}>
                    Balance: {targetBalance} {targetSymbol}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <TouchableOpacity style={styles.tokenSelector}>
                  <Image
                    source={require("@/assets/images/usdt-icon.png")}
                    style={styles.tokenIcon}
                  />
                  <Text style={styles.tokenName}>{targetSymbol}</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={Theme.colors.surface}
                  keyboardType="numeric"
                  value={amountOut === "0" ? "" : amountOut}
                  onChangeText={handleReceiveAmountChange}
                />
              </View>

              {currentPrice && (
                <Text
                  style={styles.rateText}
                >{`1 ${fromToken?.name || "SOL"} ≈ ${currentPrice} USDT`}</Text>
              )}
            </GlassCard>

            {/* Swap Button */}
            <Button
              title="Swap"
              variant="solid"
              color="v300"
              onPress={() => router.push("/confirmSwap")}
              style={[styles.swapButton, !canSwap && { opacity: 0.5 }]}
              textColor="onSurface"
              disabled={!canSwap}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        <TokenSelectModal
          visible={isModalVisible}
          tokens={mappedAssets}
          onClose={() => setModalVisible(false)}
          onSelect={setFromToken}
        />

        <SlippageModal
          visible={isSlippageVisible}
          slippage={slippage}
          onConfirm={setSlippage}
          onClose={() => setSlippageVisible(false)}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    paddingBottom: 40,
  },
  bigCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 5,
    paddingBottom: 16,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  label: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  tokenSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  tokenIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: Theme.colors.g50,
  },
  tokenName: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "500",
    marginRight: 4,
  },
  amountInput: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
  },
  arrowContainer: {
    alignItems: "center",
    marginVertical: -15,
    zIndex: 10,
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.v300,
    justifyContent: "center",
    alignItems: "center",
  },
  usdtHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
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
  swapButton: {
    backgroundColor: Theme.colors.v300,
    width: "100%",
    paddingVertical: 10,
    marginTop: 20,
  },
  mainWrapperCard: {
    padding: 16,
    borderRadius: 32,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderWidth: 1,
  },
  percentRow: {
    width: "80%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 16,
    gap: 8,
  },
  percentButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Theme.colors.glassBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.glassBorder,
  },
  rateText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginTop: 14,
  },
});
