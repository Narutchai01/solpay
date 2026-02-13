import {
  SuccessDetailItem,
  SuccessLayout,
} from "@/src/components/shard/successLayout";
import { router } from "expo-router";

export const SwapSuccessScreen = () => {
  const swapData: SuccessDetailItem[] = [
    { label: "Transaction Id", value: "11111111" },
    { label: "Exchange Rate", value: "1 USDT ≈ 0.0072 SOL" },
    { label: "Fee", value: "0.00 THB" },
    { label: "SOL Amount", value: "2.50 SOL" },
    { label: "USDT Amount", value: "345.16312 USDT" },
    { label: "Completion date", value: "27 Nov 2025 - 18:43" },
  ];

  return (
    <SuccessLayout
      details={swapData}
      onButtonPress={() => router.replace("/(tabs)")}
    />
  );
};
