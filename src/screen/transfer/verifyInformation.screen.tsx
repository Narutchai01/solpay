import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { LoadingSpinner } from "@/src/components/shard/loadingSpinner";
import { PinService } from "@/src/core/services/pin.service";
import { CategoryModel } from "@/src/domain/model/category";
import { useAuth } from "@/src/hooks/useAuth";
import { useCategory } from "@/src/hooks/useCategory";
import { useQuote } from "@/src/hooks/useQuote";
import { useTransaction } from "@/src/hooks/useTransaction";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";
import {
  EXPENSE_CATEGORY_CONFIG,
  ExpenseCategory,
} from "../history/expenseCategory.config";
import { KeypadSection } from "../pin/keypadSection.component";
import { PinDots } from "../pin/pinDots";

const PIN_LENGTH = 6;

export const TransferVerifyInformationScreen = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scale = SCREEN_WIDTH / 375;

  const { GetQuoteByID, quote } = useQuote();
  const { CreateTransactionOffchain, CreateTransactionOnchain } =
    useTransaction();
  const router = useRouter();
  const { quoteID } = useLocalSearchParams<{
    quoteID: string;
  }>();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const showError = (title: string, message: string) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setShowErrorModal(true);
  };
  const { categories, GetCategories } = useCategory();
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | string | null
  >(null);

  const { ConfirmQuote } = useQuote();

  const dynamicStyles = useMemo(
    () => ({
      scrollContent: {
        paddingHorizontal: 16 * scale,
        paddingTop: 10 * scale,
        paddingBottom: 100 * scale,
      },
      card: {
        padding: 12 * scale,
      },
      accountIconSize: 50 * scale,
      accountLabel: {
        fontSize: Math.min(Theme.fontSize.h6, 16 * scale),
        marginLeft: 16 * scale,
      },
      accountValue: {
        fontSize: Math.min(Theme.fontSize.textM, 14 * scale),
        marginTop: 4 * scale,
      },
      connectorContainer: {
        left: 31 * scale,
        top: 100 * scale,
      },
      verticalLine: {
        width: 1.5 * scale,
        height: 22 * scale,
      },
      arrowCircle: {
        width: 28 * scale,
        height: 28 * scale,
        borderRadius: 16 * scale,
      },
      arrowIconSize: 18 * scale,
      avatarContainer: {
        width: 50 * scale,
        height: 50 * scale,
        borderRadius: 25 * scale,
        marginRight: 16 * scale,
      },
      receiverName: {
        fontSize: Math.min(Theme.fontSize.h6, 16 * scale),
      },
      receiverAccount: {
        fontSize: Math.min(Theme.fontSize.textM, 14 * scale),
        marginVertical: 4 * scale,
      },
      receiverBank: {
        fontSize: Math.min(Theme.fontSize.textM, 14 * scale),
      },
      amountCard: {
        marginTop: 20 * scale,
        padding: 16 * scale,
      },
      amountContainer: {
        gap: 12 * scale,
      },
      amountLabel: {
        fontSize: Math.min(Theme.fontSize.textL, 16 * scale),
      },
      amountValue: {
        fontSize: Math.min(Theme.fontSize.h6, 16 * scale),
        marginLeft: 10 * scale,
      },
      sectionTitle: {
        fontSize: Math.min(Theme.fontSize.h6, 16 * scale),
        marginBottom: 16 * scale,
      },
      categorySection: {
        marginTop: 25 * scale,
        paddingBottom: 20 * scale,
      },
      categoryButton: {
        borderRadius: 8 * scale,
        minWidth: 80 * scale,
        marginRight: 12 * scale,
      },
      categoryButtonText: {
        fontSize: Math.min(Theme.fontSize.textS, 12 * scale),
        marginLeft: 4 * scale,
      },
      categoryIconSize: 18 * scale,
      footer: {
        paddingHorizontal: 16 * scale,
        paddingBottom: Platform.OS === "ios" ? 0 : 16 * scale,
      },
      footerButton: {
        paddingVertical: 10 * scale,
      },
      pinScreenContainer: {
        paddingVertical: 20 * scale,
      },
      pinScreenCloseButton: {
        top: (Platform.OS === "ios" ? 44 : 24) * scale,
        right: 24 * scale,
      },
      pinScreenCloseIcon: {
        fontSize: 28 * scale,
      },
      pinScreenHeader: {
        marginTop: 40 * scale,
      },
      pinScreenTitle: {
        fontSize: Math.min(Theme.fontSize.h5, 20 * scale),
        marginBottom: 12 * scale,
      },
      pinScreenSubtitle: {
        fontSize: Math.min(Theme.fontSize.textL, 16 * scale),
        marginBottom: 20 * scale,
      },
      pinScreenErrorContainer: {
        marginTop: 20 * scale,
      },
      pinScreenErrorText: {
        fontSize: Math.min(Theme.fontSize.textL, 16 * scale),
        marginBottom: 10 * scale,
      },
    }),
    [scale],
  );

  useEffect(() => {
    GetCategories();
  }, [GetCategories]);

  const renderCategoryItem = ({ item }: { item: CategoryModel }) => {
    const isSelected = selectedCategoryId === item.id;
    const config =
      EXPENSE_CATEGORY_CONFIG[item.name as ExpenseCategory] ||
      EXPENSE_CATEGORY_CONFIG["Others"];

    return (
      <Button
        title={item.name}
        variant={isSelected ? "solid" : "outline"}
        color={isSelected ? config.color : "surface"}
        onPress={() => setSelectedCategoryId(item.id)}
        style={[
          styles.categoryButton,
          dynamicStyles.categoryButton,
          !isSelected && styles.unselectedCategoryButton,
        ]}
        textStyle={[
          styles.categoryButtonText,
          dynamicStyles.categoryButtonText,
          isSelected
            ? { color: Theme.colors.g300 }
            : { color: Theme.colors.surface },
        ]}
        icon={
          <MaterialCommunityIcons
            name={config.icon}
            size={dynamicStyles.categoryIconSize}
            color={isSelected ? Theme.colors.g300 : Theme.colors.surface}
          />
        }
      />
    );
  };

  useEffect(() => {
    const fetchQuote = async () => {
      if (quoteID && quote?.quote_id !== quoteID) {
        await GetQuoteByID(quoteID);
      }
    };
    void fetchQuote();
  }, [quoteID, GetQuoteByID, quote?.quote_id]);

  const { account } = useAuth();
  const walletAddress = account?.publicKey?.toBase58();

  useEffect(() => {
    const verifyUserPin = async () => {
      if (pin.length === PIN_LENGTH) {
        if (!walletAddress) {
          setPinError("Wallet not connected.");
          setPin("");
          return;
        }
        const isValid = await PinService.verifyPin(walletAddress, pin);
        if (isValid) {
          setShowPinModal(false);
          setPin("");
          await executeTransfer();
        } else {
          setPinError("Incorrect PIN. Please try again.");
          setPin("");
        }
      }
    };
    verifyUserPin();
  }, [pin, walletAddress]);

  const handlePinPress = (num: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin((prev) => prev + num);
      setPinError("");
    }
  };

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (!quote) return;
    setShowPinModal(true);
  };

  const executeTransfer = async () => {
    if (!quote) return;

    setIsSubmitting(true);

    try {
      if (quote.quote_type === "OFFCHAIN") {
        const tx = await CreateTransactionOffchain({
          quoteID: quote.quote_id,
          category_id: selectedCategoryId,
        });
        if (tx && tx.transaction_uuid) {
          router.replace({
            pathname: "/transferSuccessful",
            params: {
              txUUID: tx.transaction_uuid.trim(),
            },
          });
        } else {
          showError(
            "Transaction failed",
            "Failed to initiate off-chain transfer.",
          );
        }
      } else if (quote.quote_type === "ONCHAIN") {
        const signedTxBase64 = await ConfirmQuote(quote?.quote_id);

        if (!signedTxBase64) {
          setIsSubmitting(false);
          return;
        }

        const tx = await CreateTransactionOnchain({
          quoteID: quote.quote_id,
          tx_hash: signedTxBase64,
          category_id: selectedCategoryId,
        });

        if (tx && tx.transaction_uuid) {
          router.replace({
            pathname: "/transferSuccessful",
            params: {
              txUUID: tx.transaction_uuid.trim(),
              txHash: tx.transaction_on_chain?.signature?.trim() ?? "",
            },
          });
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      showError(
        "Transfer Error",
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GradientLayout>
      {isSubmitting && <LoadingSpinner overlay={true} />}

      <SafeAreaView style={styles.safeArea}>
        <Header title="Verify Information" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            dynamicStyles.scrollContent,
          ]}
        >
          {/* Sender Account */}
          <GlassCard style={[styles.card, dynamicStyles.card]}>
            <View style={styles.accountRow}>
              <Ionicons
                name="person-circle-outline"
                size={dynamicStyles.accountIconSize}
                color={Theme.colors.surface}
              />
              <View style={dynamicStyles.accountLabel}>
                <Text style={styles.accountLabel}>Account</Text>
                <Text style={[styles.accountValue, dynamicStyles.accountValue]}>
                  XXX-X-X5624-X
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Connection Line with Arrow */}
          <View style={{ height: 85 * scale }} />

          <View
            style={[
              styles.connectorContainer,
              dynamicStyles.connectorContainer,
            ]}
          >
            <View style={[styles.verticalLine, dynamicStyles.verticalLine]} />
            <View style={[styles.arrowCircle, dynamicStyles.arrowCircle]}>
              <Ionicons
                name="arrow-down"
                size={dynamicStyles.arrowIconSize}
                color={Theme.colors.surface}
              />
            </View>
            <View style={[styles.verticalLine, dynamicStyles.verticalLine]} />
          </View>

          {/* Receiver Info */}
          <GlassCard
            style={[styles.card, dynamicStyles.card, { marginTop: 12 * scale }]}
          >
            <View style={styles.accountRow}>
              <View
                style={[styles.avatarContainer, dynamicStyles.avatarContainer]}
              >
                <Image
                  source={require("@/assets/images/thaiQR-logo.png")}
                  style={styles.avatarInsideImage}
                  resizeMode="contain"
                />
              </View>

              <View>
                <Text style={[styles.receiverName, dynamicStyles.receiverName]}>
                  Mr. Dee Jai
                </Text>
                <Text
                  style={[
                    styles.receiverAccount,
                    dynamicStyles.receiverAccount,
                  ]}
                >
                  {quote?.promptpay_id}
                </Text>
                <Text style={[styles.receiverBank, dynamicStyles.receiverBank]}>
                  PromptPay
                </Text>
              </View>
            </View>
          </GlassCard>
          {/* Amount Display */}
          <GlassCard style={[styles.amountCard, dynamicStyles.amountCard]}>
            {quote?.quote_type === "ONCHAIN" ? (
              <View
                style={[styles.amountContainer, dynamicStyles.amountContainer]}
              >
                <View style={styles.amountDetailRow}>
                  <Text style={[styles.amountLabel, dynamicStyles.amountLabel]}>
                    THB Amount:
                  </Text>
                  <Text style={[styles.amountValue, dynamicStyles.amountValue]}>
                    {quote?.thb_amount} THB
                  </Text>
                </View>
                <View style={styles.amountDetailRow}>
                  <Text style={[styles.amountLabel, dynamicStyles.amountLabel]}>
                    USDC Amount:
                  </Text>
                  <Text
                    style={[
                      styles.amountValue,
                      dynamicStyles.amountValue,
                      { fontSize: Math.min(Theme.fontSize.textM, 14 * scale) },
                    ]}
                  >
                    {quote?.usdt_amount} USDC
                  </Text>
                </View>
                <View style={styles.amountDetailRow}>
                  <Text style={[styles.amountLabel, dynamicStyles.amountLabel]}>
                    Fee:
                  </Text>
                  <Text style={[styles.amountValue, dynamicStyles.amountValue]}>
                    {quote?.fee} USDC
                  </Text>
                </View>
                <View style={styles.amountDetailRow}>
                  <Text style={[styles.amountLabel, dynamicStyles.amountLabel]}>
                    Estimated Time:
                  </Text>
                  <Text style={[styles.amountValue, dynamicStyles.amountValue]}>
                    4.23 s
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.amountRowSimple}>
                <Text style={[styles.amountLabel, dynamicStyles.amountLabel]}>
                  THB Amount:
                </Text>
                <Text style={[styles.amountValue, dynamicStyles.amountValue]}>
                  {quote?.thb_amount} THB
                </Text>
              </View>
            )}
          </GlassCard>

          {/* Category Selection */}
          <View style={[styles.categorySection, dynamicStyles.categorySection]}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Category
            </Text>

            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.categoryListContainer,
                { paddingRight: 20 * scale },
              ]}
              style={{ width: SCREEN_WIDTH - 32 * scale }}
            />
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={[styles.footer, dynamicStyles.footer]}>
          <Button
            title="Cancel"
            variant="solid"
            color="g200"
            onPress={() => setShowCancelModal(true)}
            style={[styles.footerButton, dynamicStyles.footerButton]}
            textColor="surface"
          />
          <Button
            title="Confirm"
            variant="solid"
            color="v300"
            onPress={() => handleConfirm()}
            style={[
              styles.footerButton,
              dynamicStyles.footerButton,
              { marginLeft: 16 * scale },
            ]}
            textColor="g300"
          />
        </View>

        <ConfirmModal
          visible={showErrorModal}
          iconName="close-circle"
          iconColor={Theme.colors.errorText}
          title={errorTitle}
          description={errorMessage}
          confirmLabel="Close"
          onConfirm={() => setShowErrorModal(false)}
        />

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

        <Modal
          visible={showPinModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => {
            setShowPinModal(false);
            setPin("");
            setPinError("");
          }}
        >
          <GradientLayout>
            <SafeAreaView
              style={[
                styles.pinScreenContainer,
                dynamicStyles.pinScreenContainer,
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.pinScreenCloseButton,
                  dynamicStyles.pinScreenCloseButton,
                ]}
                onPress={() => {
                  setShowPinModal(false);
                  setPin("");
                  setPinError("");
                }}
              >
                <Ionicons
                  name="close"
                  style={[
                    styles.pinScreenCloseIcon,
                    dynamicStyles.pinScreenCloseIcon,
                  ]}
                />
              </TouchableOpacity>

              <View style={styles.pinScreenHeader}>
                <Text style={styles.pinScreenTitle}>Enter your PIN</Text>
                <Text style={styles.pinScreenSubtitle}>
                  {"Please verify it's you"}
                </Text>
              </View>

              <PinDots
                pinLength={PIN_LENGTH}
                currentLength={pin.length}
                scale={scale}
              />

              {pinError ? (
                <View
                  style={[
                    styles.pinScreenErrorContainer,
                    dynamicStyles.pinScreenErrorContainer,
                  ]}
                >
                  <Text
                    style={[
                      styles.pinScreenErrorText,
                      dynamicStyles.pinScreenErrorText,
                    ]}
                  >
                    {pinError}
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.pinScreenErrorContainer,
                    dynamicStyles.pinScreenErrorContainer,
                  ]}
                >
                  <Text
                    style={[
                      styles.pinScreenErrorText,
                      dynamicStyles.pinScreenErrorText,
                    ]}
                  >
                    {" "}
                  </Text>
                </View>
              )}

              <View style={styles.pinScreenKeypadContainer}>
                <KeypadSection
                  onPress={handlePinPress}
                  onDelete={handlePinDelete}
                  scale={scale}
                />
              </View>
            </SafeAreaView>
          </GradientLayout>
        </Modal>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  pinScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  pinScreenCloseButton: {
    position: "absolute",
    zIndex: 10,
  },
  pinScreenCloseIcon: {
    color: "white",
  },
  pinScreenHeader: {
    alignItems: "center",
  },
  pinScreenTitle: {
    color: "white",
    fontWeight: "bold",
  },
  pinScreenSubtitle: {
    color: Theme.colors.surface,
    textAlign: "center",
  },
  pinScreenErrorContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  pinScreenErrorText: {
    color: Theme.colors.errorText,
    textAlign: "center",
  },
  pinScreenKeypadContainer: {
    flex: 1,
    width: "85%",
    justifyContent: "center",
    marginBottom: 40,
  },
  safeArea: { flex: 1 },
  scrollContent: {},
  card: {},
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    backgroundColor: Theme.colors.v300,
    justifyContent: "center",
    alignItems: "center",
  },
  accountLabel: {
    color: Theme.colors.surface,
    fontWeight: "600",
  },
  accountValue: {
    color: Theme.colors.surface,
  },
  // Connection Line
  connectorContainer: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  verticalLine: {
    backgroundColor: Theme.colors.v300,
  },
  arrowCircle: {
    backgroundColor: Theme.colors.v300,
    justifyContent: "center",
    alignItems: "center",
  },
  // Receiver
  receiverName: {
    color: Theme.colors.surface,
    fontWeight: "600",
  },
  receiverAccount: {
    color: Theme.colors.surface,
  },
  receiverBank: {
    color: Theme.colors.surface,
    opacity: 0.8,
  },
  avatarContainer: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
  },
  avatarInsideImage: {
    width: "100%",
    height: "100%",
  },
  // Amount
  amountCard: {},
  // SolPay
  amountRowSimple: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Software Wallet
  amountContainer: {
    width: "100%",
  },
  amountDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  amountLabel: {
    color: Theme.colors.surface,
    opacity: 0.9,
  },
  amountValue: {
    color: Theme.colors.surface,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
  },
  // Category
  sectionTitle: {
    color: Theme.colors.surface,
    fontWeight: "600",
  },
  categorySection: {},
  categoryListContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryButtonText: {},
  unselectedCategoryButton: {
    borderWidth: 1,
    borderColor: Theme.colors.g50,
  },
  // Footer
  footer: {
    flexDirection: "row",
  },
  footerButton: {
    flex: 1,
  },
});
