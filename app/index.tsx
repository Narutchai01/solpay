import { useAuth } from "@/src/hooks/useAuth";
import { useSwap } from "@/src/hooks/useSwap";
import { Redirect } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const { getSwapQuote } = useSwap();

  useEffect(() => {
    if (isAuthenticated) {
      void getSwapQuote({
        amountIn: "1000000", // Default amount for initial price fetch
        slippage: 0.5,
      });
    }
  }, [isAuthenticated, getSwapQuote]);

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)"} />;
}
