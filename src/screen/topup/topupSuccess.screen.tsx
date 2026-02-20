import { SuccessLayout } from "@/src/components/shard/successLayout";
import { DetailConfirmationCard } from "@/src/core/type/detail-confirmation-card.type";
import { router } from "expo-router";

export const TopupSuccessScreen = () => {
  const swapData: DetailConfirmationCard[] = [
    { label: "Transaction Id", value: "222222" },
    { label: "Exchange Rate", value: "1 USDT  = 32.39 THB" },
    { label: "Fee", value: "0.00 USDT" },
    { label: "THB Amount", value: "200 THB" },
    { label: "USDT Amount", value: "6.18 USDT" },
    { label: "Completion Date", value: "27 Nov 2025 - 18:43" },
  ];

  return (
    <SuccessLayout
      details={swapData}
      onButtonPress={() => router.replace("/(tabs)")}
    />
  );
};
