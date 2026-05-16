import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { WalletSelectorCard } from "@/src/components/card/walletSelectorCard";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { Theme } from "@/src/core/theme/theme";
import { WalletOption } from "@/src/core/type/wallet-option";
import { formatPromptPayID } from "@/src/core/utils/promptpay";
import { CreateQuoteRequest } from "@/src/domain/model/quote";
import { useAccount } from "@/src/hooks/useAccount";
import { useBalance } from "@/src/hooks/useBalance";
import { useQuote } from "@/src/hooks/useQuote";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const TransferScreen = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scale = SCREEN_WIDTH / 375;

  const { profile } = useAccount();
  const { balance, GetBalance } = useBalance();
  const { createQuote } = useQuote();
  const router = useRouter();
  const { qrData } = useLocalSearchParams<{ qrData: string }>();

  const [reqQuote, setReqQuote] = useState<CreateQuoteRequest>({
    thb_amount: 0,
    action_type: "OFFCHAIN",
    promptpay_id: "1234567890",
  });

  const [amountStr, setAmountStr] = useState<string>("");

  const isKycVerified = profile?.is_kyc_verified ?? false;
  const isAmountEmpty = reqQuote.thb_amount === 0;

  const isInsufficientBalance =
    reqQuote.action_type === "OFFCHAIN" && balance
      ? reqQuote.thb_amount > balance.thb_amount
      : false;

  const isButtonDisabled =
    isAmountEmpty || !isKycVerified || isInsufficientBalance;

  const dynamicStyles = useMemo(
    () => ({
      scrollContent: {
        paddingHorizontal: 16 * scale,
        paddingTop: 20 * scale,
      },
      label: {
        fontSize: Math.min(Theme.fontSize.textL, 16 * scale),
        marginBottom: 10 * scale,
      },
      divider: {
        marginVertical: 30 * scale,
      },
      coinSection: {
        marginTop: 25 * scale,
      },
      coinCard: {
        paddingVertical: 14 * scale,
        paddingHorizontal: 16 * scale,
        marginTop: 10 * scale,
      },
      tokenIcon: {
        width: 48 * scale,
        height: 48 * scale,
        borderRadius: 24 * scale,
        marginRight: 12 * scale,
      },
      coinText: {
        fontSize: Math.min(Theme.fontSize.h6, 16 * scale),
      },
      amountSection: {
        marginTop: 30 * scale,
      },
      amountLabel: {
        fontSize: Math.min(Theme.fontSize.textM, 14 * scale),
        marginBottom: 16 * scale,
      },
      inputWrapper: {
        borderRadius: 12 * scale,
        paddingHorizontal: 12 * scale,
        paddingVertical: 4 * scale,
      },
      amountInput: {
        fontSize: Math.min(Theme.fontSize.h5, 20 * scale),
      },
      helperText: {
        fontSize: Math.min(Theme.fontSize.textS, 12 * scale),
        marginVertical: 16 * scale,
      },
      footer: {
        paddingHorizontal: 16 * scale,
        paddingTop: 10 * scale,
      },
      nextButton: {
        paddingVertical: 10 * scale,
      },
    }),
    [scale],
  );

  useEffect(() => {
    GetBalance();
  }, [GetBalance]);

  useEffect(() => {
    if (qrData) {
      setReqQuote((prev) => ({
        ...prev,
        promptpay_id: qrData,
      }));
    }
  }, [qrData]);

  const walletOptions: WalletOption[] = useMemo(
    () => [
      {
        id: "1",
        name: "SolPay",
        type: "OFFCHAIN",
        balance: balance
          ? `${balance.thb_amount.toLocaleString()} THB`
          : "0 THB",
      },
      { id: "2", name: "Software Wallet", type: "ONCHAIN" },
    ],
    [balance],
  );

  const handleCreateQuote = async () => {
    const newQuote = await createQuote(reqQuote);
    router.push({
      pathname: "/transferVerifyInformation",
      params: { quoteID: newQuote?.quote_id },
    });
  };

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <Header title="Transfer" />

              <View style={styles.mainWrapper}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.scrollContent,
                    dynamicStyles.scrollContent,
                  ]}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={[styles.label, dynamicStyles.label]}>From:</Text>
                  <WalletSelectorCard
                    wallets={walletOptions}
                    onWalletChange={(wallet) =>
                      setReqQuote({
                        ...reqQuote,
                        action_type: wallet.type,
                      })
                    }
                  />

                  <View style={[styles.divider, dynamicStyles.divider]} />

                  <Text style={[styles.label, dynamicStyles.label]}>To:</Text>
                  <View style={styles.instructionBlock}>
                    <View style={styles.iconWrapper}>
                      <Image
                        source={require("@/assets/images/thaiQR-logo.png")}
                        style={styles.qrLogo}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.textWrapper}>
                      <Text style={styles.stepTitle}>QR PromptPay</Text>
                      <Text style={styles.stepSubtitle}>
                        {formatPromptPayID(reqQuote.promptpay_id || "")}
                      </Text>
                    </View>
                  </View>

                  {/* Coins Section */}
                  {reqQuote.action_type === "ONCHAIN" && (
                    <View
                      style={[styles.coinSection, dynamicStyles.coinSection]}
                    >
                      <Text style={[styles.label, dynamicStyles.label]}>
                        Coins:
                      </Text>
                      <GlassCard
                        style={[styles.coinCard, dynamicStyles.coinCard]}
                      >
                        <View style={styles.coinContent}>
                          <Image
                            source={require("@/assets/images/usdc-icon.jpg")}
                            style={[styles.tokenIcon, dynamicStyles.tokenIcon]}
                          />
                          <Text
                            style={[styles.coinText, dynamicStyles.coinText]}
                          >
                            USDC
                          </Text>
                        </View>
                      </GlassCard>
                    </View>
                  )}

                  <View
                    style={[styles.amountSection, dynamicStyles.amountSection]}
                  >
                    <Text
                      style={[styles.amountLabel, dynamicStyles.amountLabel]}
                    >
                      THB Amount:
                    </Text>
                    <View
                      style={[styles.inputWrapper, dynamicStyles.inputWrapper]}
                    >
                      <TextInput
                        style={[styles.amountInput, dynamicStyles.amountInput]}
                        value={amountStr}
                        onChangeText={(text) => {
                          // Allow numbers and a single decimal point
                          let numericOnly = text.replace(/[^0-9.]/g, "");
                          const parts = numericOnly.split(".");
                          if (parts.length > 2) {
                            numericOnly =
                              parts[0] + "." + parts.slice(1).join("");
                          }

                          setAmountStr(numericOnly);

                          const newAmount =
                            numericOnly === "" ? 0 : parseFloat(numericOnly);
                          setReqQuote({
                            ...reqQuote,
                            thb_amount: isNaN(newAmount) ? 0 : newAmount,
                          });
                        }}
                        placeholder="0.00"
                        placeholderTextColor={Theme.colors.g100}
                        keyboardType="numeric"
                        textAlign="right"
                      />
                    </View>
                    {/* Warning for Software Wallet */}
                    {reqQuote.action_type === "ONCHAIN" && (
                      <Text
                        style={[styles.helperText, dynamicStyles.helperText]}
                      >
                        *Enter THB; calculation is automatic.
                      </Text>
                    )}
                    {/* Warning for Insufficient Balance */}
                    {isInsufficientBalance && (
                      <Text
                        style={[styles.helperText, dynamicStyles.helperText]}
                      >
                        *Insufficient balance.
                      </Text>
                    )}
                  </View>
                </ScrollView>

                <View style={[styles.footer, dynamicStyles.footer]}>
                  <Button
                    title={!isKycVerified ? "KYC Required" : "Next"}
                    variant="solid"
                    color={isButtonDisabled ? "g200" : "v300"}
                    disabled={isButtonDisabled}
                    onPress={() => {
                      handleCreateQuote();
                    }}
                    style={[styles.nextButton, dynamicStyles.nextButton]}
                    textColor={isButtonDisabled ? "surface" : "g300"}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  mainWrapper: { flex: 1 },
  scrollContent: {},
  label: {
    color: Theme.colors.surface,
  },
  divider: { height: 1, backgroundColor: Theme.colors.g50 },
  instructionBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    backgroundColor: Theme.colors.g50,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  qrLogo: {
    width: 40,
    height: 40,
  },
  textWrapper: {
    flex: 1,
    justifyContent: "center",
    height: 60, // align with icon wrapper height
  },
  stepTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepSubtitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    lineHeight: 20,
  },
  coinSection: {},
  coinCard: {},
  coinContent: { flexDirection: "row", alignItems: "center" },
  tokenIcon: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.g50,
  },
  coinText: {
    color: Theme.colors.surface,
    fontWeight: "600",
  },
  amountSection: {},
  amountLabel: {
    color: Theme.colors.surface,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: Theme.colors.g75,
    justifyContent: "center",
  },
  amountInput: {
    color: Theme.colors.surface,
    fontWeight: "700",
  },
  helperText: {
    color: Theme.colors.errorText,
  },
  footer: {},
  nextButton: { width: "100%" },
});
