import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { LoadingSpinner } from "@/src/components/shard/loadingSpinner";
import { CategoryModel } from "@/src/domain/model/category";
import { useCategory } from "@/src/hooks/useCategory";
import { useQuote } from "@/src/hooks/useQuote";
import { useTransaction } from "@/src/hooks/useTransaction";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";
import {
  EXPENSE_CATEGORY_CONFIG,
  ExpenseCategory,
} from "../history/expenseCategory.config";

export const TransferVerifyInformationScreen = () => {
  const { GetQuoteByID, quote } = useQuote();
  const { CreateTransactionOffchain, transaction, CreateTransactionOnchain } =
    useTransaction();
  const router = useRouter();
  const { quoteID } = useLocalSearchParams<{
    quoteID: string;
  }>();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categories, GetCategories } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { ConfirmQuote } = useQuote();

  useEffect(() => {
    GetCategories();
  }, [GetCategories]);

  const renderCategoryItem = ({ item }: { item: CategoryModel }) => {
    const isSelected = selectedCategory === item.name;
    const config =
      EXPENSE_CATEGORY_CONFIG[item.name as ExpenseCategory] ||
      EXPENSE_CATEGORY_CONFIG["Others"];

    return (
      <Button
        title={item.name}
        variant={isSelected ? "solid" : "outline"}
        color={isSelected ? config.color : "surface"}
        onPress={() => setSelectedCategory(item.name as ExpenseCategory)}
        style={[
          styles.categoryButton,
          !isSelected && styles.unselectedCategoryButton,
        ]}
        textStyle={[
          styles.categoryButtonText,
          isSelected
            ? { color: Theme.colors.g300 }
            : { color: Theme.colors.surface },
        ]}
        icon={
          <MaterialCommunityIcons
            name={config.icon}
            size={18}
            color={isSelected ? Theme.colors.g300 : Theme.colors.surface}
          />
        }
      />
    );
  };

  console.log("quoteID in Verify", quoteID);

  useEffect(() => {
    const fetchQuote = async () => {
      if (quoteID && quote?.quote_id !== quoteID) {
        await GetQuoteByID(quoteID);
      }
    };
    void fetchQuote();
  }, [quoteID, GetQuoteByID, quote?.quote_id]);

  console.log("quote in Verify", quote);

  const handleConfirm = async () => {
    if (!quote) return;

    setIsSubmitting(true);

    try {
      if (quote.quote_type === "OFFCHAIN") {
        const tx = await CreateTransactionOffchain({ quoteID: quote.quote_id });
        if (tx) {
          router.replace({ pathname: "/transferSuccessful" });
        }
      } else if (quote.quote_type === "ONCHAIN") {
        const signedTx = await ConfirmQuote(quote?.quote_id);

        if (!signedTx) {
          setIsSubmitting(false);
          return;
        }

        const tx = await CreateTransactionOnchain({
          quoteID: quote.quote_id,
          tx_hash: signedTx,
        });

        console.log("transaction in Verify", tx);

        if (tx) {
          router.replace({
            pathname: "/transferSuccessful",
            params: { txHash: signedTx },
          });
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("transaction in Verify", transaction);

  return (
    <GradientLayout>
      {isSubmitting && <LoadingSpinner overlay={true} />}

      <SafeAreaView style={styles.safeArea}>
        <Header title="Verify Information" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Sender Account */}
          <GlassCard style={styles.card}>
            <View style={styles.accountRow}>
              <Ionicons
                name="person-circle-outline"
                size={50}
                color={Theme.colors.surface}
              />
              <View style={{ marginLeft: 16 }}>
                <Text style={styles.accountLabel}>Account</Text>
                <Text style={styles.accountValue}>XXX-X-X5624-X</Text>
              </View>
            </View>
          </GlassCard>

          {/* Connection Line with Arrow */}
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

          {/* Receiver Info */}
          <GlassCard style={[styles.card, { marginTop: 12 }]}>
            <View style={styles.accountRow}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require("@/assets/images/thaiQR-logo.png")}
                  style={styles.avatarInsideImage}
                  resizeMode="contain"
                />
              </View>

              <View>
                <Text style={styles.receiverName}>Mr. Dee Jai</Text>
                <Text style={styles.receiverAccount}>
                  {quote?.promptpay_id}
                </Text>
                <Text style={styles.receiverBank}>PromptPay</Text>
              </View>
            </View>
          </GlassCard>
          {/* Amount Display */}
          <GlassCard style={styles.amountCard}>
            {quote?.quote_type === "ONCHAIN" ? (
              <View style={styles.amountContainer}>
                <View style={styles.amountDetailRow}>
                  <Text style={styles.amountLabel}>THB Amount:</Text>
                  <Text style={styles.amountValue}>
                    {quote?.thb_amount} THB
                  </Text>
                </View>
                <View style={styles.amountDetailRow}>
                  <Text style={styles.amountLabel}>USDT Amount:</Text>
                  <Text
                    style={[
                      styles.amountValue,
                      { fontSize: Theme.fontSize.textM },
                    ]}
                  >
                    {quote?.usdt_amount} USDT
                  </Text>
                </View>
                <View style={styles.amountDetailRow}>
                  <Text style={styles.amountLabel}>Fee:</Text>
                  <Text style={styles.amountValue}>{quote?.fee} USDT</Text>
                </View>
                <View style={styles.amountDetailRow}>
                  <Text style={styles.amountLabel}>Estimated Time:</Text>
                  <Text style={styles.amountValue}>4.23 s</Text>
                </View>
              </View>
            ) : (
              <View style={styles.amountRowSimple}>
                <Text style={styles.amountLabel}>THB Amount:</Text>
                <Text style={styles.amountValue}>{quote?.thb_amount} THB</Text>
              </View>
            )}
          </GlassCard>

          {/* Category Selection */}
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Category</Text>

            {/* TODO(UI-BUG): Fix screen jump when selecting category
      - Screen shifts/jumps when a category is selected
      - Likely caused by layout changes (borderWidth, size, font, icon, etc.)
      - Ensure Button has consistent height/width across all states
      - Use consistent styles for selected/unselected (avoid layout changes)
      - Investigate FlatList re-render behavior
      - Check interaction with parent ScrollView
  */}
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryListContainer}
            />
          </View>
        </ScrollView>

        {/* Footer Buttons */}
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
            onPress={() => handleConfirm()}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  card: {
    padding: 12,
    width: "100%",
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Theme.colors.v300,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  accountLabel: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
  accountValue: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginTop: 4,
  },
  // Connection Line
  connectorContainer: {
    position: "absolute",
    left: 30,
    top: 100,
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
  // Receiver
  receiverName: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
  receiverAccount: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginVertical: 4,
  },
  receiverBank: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    opacity: 0.8,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: Theme.colors.surface,
  },
  avatarInsideImage: {
    width: "100%",
    height: "100%",
  },
  // Amount
  amountCard: {
    marginTop: 20,
    padding: 16,
    width: "100%",
  },
  // SolPay
  amountRowSimple: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Software Wallet
  amountContainer: {
    width: "100%",
    gap: 12,
  },
  amountDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  amountLabel: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
    opacity: 0.9,
  },
  amountValue: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  // Category
  sectionTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    marginBottom: 16,
  },
  categorySection: {
    marginTop: 25,
    paddingBottom: 20,
    width: "100%",
  },
  categoryListContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    minWidth: 80,
  },
  categoryButtonText: {
    fontSize: Theme.fontSize.textS,
    marginLeft: 4,
  },
  unselectedCategoryButton: {
    borderWidth: 1,
    borderColor: Theme.colors.g50,
  },
  // Footer
  footer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 10,
  },
});
