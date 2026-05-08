import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { WalletSelectorCard } from "@/src/components/card/walletSelectorCard";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { Theme } from "@/src/core/theme/theme";
import { WalletOption } from "@/src/core/type/wallet-option";
import { formatPromptPayID } from "@/src/core/utils/promptpay";
import { CreateQuoteRequest } from "@/src/domain/model/quote";
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

  const { balance, GetBalance } = useBalance();
  const { createQuote } = useQuote();
  const router = useRouter();
  const { qrData } = useLocalSearchParams<{ qrData: string }>();

  const [reqQuote, setReqQuote] = useState<CreateQuoteRequest>({
    thb_amount: 0,
    action_type: "OFFCHAIN",
    promptpay_id: "1234567890",
  });

  const isAmountEmpty = reqQuote.thb_amount === 0;

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
      receiverContainer: {
        marginTop: 10 * scale,
      },
      avatarPlaceholder: {
        width: 60 * scale,
        height: 60 * scale,
        borderRadius: 30 * scale,
        marginRight: 16 * scale,
      },
      receiverName: {
        fontSize: Math.min(Theme.fontSize.textL, 16 * scale),
      },
      receiverDetail: {
        fontSize: Math.min(Theme.fontSize.textM, 14 * scale),
        marginTop: 4 * scale,
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
                  <View
                    style={[
                      styles.receiverContainer,
                      dynamicStyles.receiverContainer,
                    ]}
                  >
                    <View
                      style={[
                        styles.avatarPlaceholder,
                        dynamicStyles.avatarPlaceholder,
                      ]}
                    />
                    <View>
                      <Text
                        style={[
                          styles.receiverName,
                          dynamicStyles.receiverName,
                        ]}
                      >
                        QR PromptPay
                      </Text>
                      <Text
                        style={[
                          styles.receiverDetail,
                          dynamicStyles.receiverDetail,
                        ]}
                      >
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
                        value={
                          reqQuote.thb_amount === 0
                            ? ""
                            : reqQuote.thb_amount.toString()
                        }
                        onChangeText={(text) => {
                          const numericOnly = text.replace(/[^0-9.]/g, "");
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
                  </View>
                </ScrollView>

                <View style={[styles.footer, dynamicStyles.footer]}>
                  <Button
                    title="Next"
                    variant="solid"
                    color={isAmountEmpty ? "g200" : "v300"}
                    disabled={isAmountEmpty}
                    onPress={() => {
                      handleCreateQuote();
                    }}
                    style={[styles.nextButton, dynamicStyles.nextButton]}
                    textColor={isAmountEmpty ? "surface" : "g300"}
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
  receiverContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    backgroundColor: Theme.colors.g50,
  },
  receiverName: { color: Theme.colors.surface },
  receiverDetail: {
    color: Theme.colors.surface,
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
