import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";
import {
  EXPENSE_CATEGORY_CONFIG,
  ExpenseCategory,
} from "../history/expenseCategory.config";

const CATEGORIES = [
  { id: "food", title: "Food/Drink", icon: "silverware-fork-knife" },
  { id: "shopping", title: "Shopping", icon: "shopping" },
  { id: "invest", title: "Invest", icon: "finance" },
  { id: "others", title: "Others", icon: "file-document-outline" },
];

export const TransferVerifyInformationScreen = () => {
  const router = useRouter();
  const { amount, walletType } = useLocalSearchParams<{
    amount: string;
    walletType: "solpay" | "software";
  }>();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    ExpenseCategory | ""
  >("");
  const exchangeRate = 35.5;
  const usdtAmount = (parseFloat(amount || "0") / exchangeRate).toFixed(6);

  const renderCategoryItem = ({ item }: { item: (typeof CATEGORIES)[0] }) => {
    const isSelected = selectedCategory === item.title;
    const config = EXPENSE_CATEGORY_CONFIG[item.title as ExpenseCategory];

    return (
      <Button
        title={item.title}
        variant={isSelected ? "solid" : "outline"}
        color={isSelected ? config.color : "surface"}
        onPress={() => setSelectedCategory(item.title as ExpenseCategory)}
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

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={28}
              color={Theme.colors.surface}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Information</Text>
          <View style={{ width: 28 }} />
        </View>

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
              <View
                style={[styles.avatarCircle, { backgroundColor: "#D9D9D9" }]}
              />
              <View>
                <Text style={styles.receiverName}>Mr. Dee Jai</Text>
                <Text style={styles.receiverAccount}>412-8-25624-3</Text>
                <Text style={styles.receiverBank}>ABC Bank</Text>
              </View>
            </View>
          </GlassCard>

          {/* Amount Display */}
          <GlassCard style={styles.amountCard}>
            {walletType === "software" ? (
              <View style={styles.amountContainer}>
                <View style={styles.amountDetailRow}>
                  <Text style={styles.amountLabel}>THB Amount:</Text>
                  <Text style={styles.amountValue}>{amount} THB</Text>
                </View>
                <View style={styles.amountDetailRow}>
                  <Text style={styles.amountLabel}>USDT Amount:</Text>
                  <Text
                    style={[
                      styles.amountValue,
                      { fontSize: Theme.fontSize.textM },
                    ]}
                  >
                    {usdtAmount} USDT
                  </Text>
                </View>
                <View style={styles.amountDetailRow}>
                  <Text style={styles.amountLabel}>Fee:</Text>
                  <Text style={styles.amountValue}>0.00 USDT</Text>
                </View>
                <View style={styles.amountDetailRow}>
                  <Text style={styles.amountLabel}>Estimated Time:</Text>
                  <Text style={styles.amountValue}>4.23 s</Text>
                </View>
              </View>
            ) : (
              <View style={styles.amountRowSimple}>
                <Text style={styles.amountLabel}>THB Amount:</Text>
                <Text style={styles.amountValue}>{amount} THB</Text>
              </View>
            )}
          </GlassCard>

          {/* Category Selection */}
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Category</Text>
            <FlatList
              data={CATEGORIES}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
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
            onPress={() => router.replace("/transferSuccessful")}
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
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    color: Theme.colors.surface,
  },
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
