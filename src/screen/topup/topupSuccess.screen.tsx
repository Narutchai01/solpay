import { SuccessLayout } from "@/src/components/shard/successLayout";
import { DetailConfirmationCard } from "@/src/core/type/detail-confirmation-card.type";
import { useTransactionWs } from "@/src/hooks/useTransaction-ws";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

export const TopupSuccessScreen = () => {
  const { txUUID } = useLocalSearchParams<{ txUUID?: string }>();
  const { GetWsTransaction, isCompleted } = useTransactionWs();

  useEffect(() => {
    const stopMonitoring = GetWsTransaction(txUUID || "");

    return () => {
      stopMonitoring();
    };
  }, [GetWsTransaction, txUUID]);

  const swapData: DetailConfirmationCard[] = [
    { label: "Transaction Id", value: txUUID || "N/A" },
    { label: "Exchange Rate", value: "1 USDT  = 32.39 THB" },
    { label: "Fee", value: "0.00 USDT" },
    { label: "THB Amount", value: "200 THB" },
    { label: "USDT Amount", value: "6.18 USDT" },
    { label: "Completion Date", value: "27 Nov 2025 - 18:43" },
  ];

  if (!isCompleted) {
    return <Text>Waiting for transaction confirmation...</Text>;
  }

  return (
    <SuccessLayout
      details={swapData}
      onButtonPress={() => router.replace("/(tabs)")}
    />
  );
};
