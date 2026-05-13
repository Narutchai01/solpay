import { useAuth } from "@/src/hooks/useAuth";
import { useSwap } from "@/src/hooks/useSwap";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { useExchangeRate } from "@/src/hooks/useExchangeRate";

export default function Index() {
  const { isAuthenticated, hasPin, isInitialized } = useAuth();
  const { getSwapQuote } = useSwap();
  const { fetchExchangeRate } = useExchangeRate();

  useEffect(() => {
    if (isAuthenticated) {
      void getSwapQuote(
        {
          inputMint: "So11111111111111111111111111111111111111112",
          outputMint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          amountIn: "1000000", // Default amount for initial price fetch
          slippage: 0.5,
        },
        false,
      );
      void fetchExchangeRate("USDC_THB");
    }
  }, [isAuthenticated, getSwapQuote, fetchExchangeRate]);

  if (!isInitialized) return null;

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return <Redirect href={hasPin ? "/(tabs)" : "/pin"} />;
}
