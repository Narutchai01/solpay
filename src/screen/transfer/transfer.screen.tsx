import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { WalletSelectorCard } from "@/src/components/card/walletSelectorCard";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/core/theme/theme";
import { WalletOption } from "@/src/core/type/wallet-option";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WALLET_OPTIONS: WalletOption[] = [
  { id: "1", name: "SolPay", type: "solpay", balance: "1,000 THB" },
  { id: "2", name: "Software Wallet", type: "software" },
];

export const TransferScreen = () => {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [walletType, setWalletType] = useState<"solpay" | "software">("solpay");
  const isAmountEmpty = amount.trim() === "" || amount === "0";

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={28}
              color={Theme.colors.surface}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transfer</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.mainWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.label}>From:</Text>
            <WalletSelectorCard
              wallets={WALLET_OPTIONS}
              onWalletChange={(wallet) => setWalletType(wallet.type)}
            />

            <View style={styles.divider} />

            <Text style={styles.label}>To:</Text>
            <View style={styles.receiverContainer}>
              <View style={styles.avatarPlaceholder} />
              <View>
                <Text style={styles.receiverName}>QR PromptPay</Text>
                <Text style={styles.receiverDetail}>412-8-25624-3</Text>
              </View>
            </View>

            {/* Coins Section */}
            {walletType === "software" && (
              <View style={styles.coinSection}>
                <Text style={styles.label}>Coins:</Text>
                <GlassCard style={styles.coinCard}>
                  <View style={styles.coinContent}>
                    <Image
                      source={require("@/assets/images/usdt-icon.png")}
                      style={styles.tokenIcon}
                    />
                    <Text style={styles.coinText}>USDT</Text>
                  </View>
                </GlassCard>
              </View>
            )}

            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>THB Amount:</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={Theme.colors.g100}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              {/* Warning for Software Wallet */}
              {walletType === "software" && (
                <Text style={styles.helperText}>
                  *Enter THB; calculation is automatic.
                </Text>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Next"
              variant="solid"
              color={isAmountEmpty ? "g200" : "v300"}
              disabled={isAmountEmpty}
              onPress={() => {
                router.push({
                  pathname: "/transferVerifyInformation",
                  params: {
                    amount: amount,
                    walletType: walletType,
                  },
                });
              }}
              style={styles.nextButton}
              textColor={isAmountEmpty ? "surface" : "g300"}
            />
          </View>
        </View>
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
  mainWrapper: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  label: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
    marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: Theme.colors.g50, marginVertical: 30 },
  receiverContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.g50,
    marginRight: 16,
  },
  receiverName: { color: Theme.colors.surface, fontSize: Theme.fontSize.textL },
  receiverDetail: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginTop: 4,
  },
  coinSection: { marginTop: 25 },
  coinCard: { paddingVertical: 14, paddingHorizontal: 16, marginTop: 10 },
  coinContent: { flexDirection: "row", alignItems: "center" },
  tokenIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: Theme.colors.g50,
  },
  coinText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
  amountSection: { marginTop: 30 },
  amountLabel: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginBottom: 16,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: Theme.colors.g75,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: "center",
  },
  amountInput: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
  },
  helperText: {
    color: Theme.colors.errorText,
    fontSize: Theme.fontSize.textS,
    marginVertical: 16,
  },
  footer: { paddingHorizontal: 16, paddingBottom: 20, paddingTop: 10 },
  nextButton: { width: "100%", paddingVertical: 10 },
});
