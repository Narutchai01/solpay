import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { Theme } from "@/src/core/theme/theme";
import { DetailConfirmationCard } from "@/src/core/type/detail-confirmation-card.type";
import { useQuote } from "@/src/hooks/useQuote";
import { useTransaction } from "@/src/hooks/useTransaction";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DetailRow = ({ label, value }: DetailConfirmationCard) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export const ConfirmTopupScreen = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { quote, GetQuoteByID, ConfirmQuote } = useQuote();
  const { CreateTransactionTopUP } = useTransaction();

  const handleConfirm = async () => {
    if (!id) {
      Alert.alert("Missing quote", "Quote ID is not available.");
      return;
    }

    setIsConfirming(true);
    try {
      const signedTx = await ConfirmQuote(id);
      console.log("Signed transaction:", signedTx);

      if (!signedTx) {
        Alert.alert("Error", "Failed to get signed transaction.");
        return;
      }

      const createdTransaction = await CreateTransactionTopUP({
        quoteID: id,
        tx_hash: signedTx,
        max_slippage: 0,
      });

      if (!createdTransaction) {
        Alert.alert("Error", "Failed to create transaction.");
        return;
      }

      console.log(createdTransaction);
      router.replace("/topupSuccess");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to confirm quote";
      Alert.alert("Confirm failed", message);
    } finally {
      setIsConfirming(false);
    }
  };

  const formatAmount = (value?: number, currency?: string) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return `0.00 ${currency ?? ""}`.trim();
    }
    return `${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency ?? ""}`.trim();
  };

  const formatExchangeRate = (value?: number) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return "1 USDT = 32.39 THB";
    }
    return `1 USDT = ${value.toFixed(2)} THB`;
  };

  const topupData: DetailConfirmationCard[] = useMemo(
    () => [
      {
        label: "THB Amount",
        value: formatAmount(quote?.thb_amount, "THB"),
      },
      {
        label: "USDT Amount",
        value: formatAmount(quote?.usdt_amount, "USDT"),
      },
      {
        label: "Fee",
        value: formatAmount(quote?.fee, "USDT"),
      },
      {
        label: "Exchange Rate",
        value: formatExchangeRate(quote?.exchange_rate),
      },
    ],
    [quote],
  );

  useEffect(() => {
    const fetchQuote = async () => {
      if (id && quote?.quote_id !== id) {
        await GetQuoteByID(id);
      }
    };

    void fetchQuote();
  }, [GetQuoteByID, id, quote?.quote_id]);

  console.log("quote inconfirm :", quote);

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContent}>
          <Header title="Confirm" showBackButton={false} />

          <GlassCard style={[styles.detailCard]}>
            <FlatList
              data={topupData}
              keyExtractor={(item, index) => `${item.label}-${index}`}
              renderItem={({ item }) => (
                <DetailRow label={item.label} value={item.value} />
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </GlassCard>
        </View>

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
            title={isConfirming ? "Confirming..." : "Confirm"}
            variant="solid"
            color="v300"
            onPress={handleConfirm}
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
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  detailCard: {
    width: "100%",
    paddingHorizontal: 12,
    marginTop: 32,
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
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 10,
  },
});
