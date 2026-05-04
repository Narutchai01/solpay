import { useAuth } from "@/src/hooks/useAuth";
import { useSwap } from "@/src/hooks/useSwap";
import { Redirect } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const { getSwapQuote } = useSwap();

  useEffect(() => {
    if (isAuthenticated) {
      void getSwapQuote({ inputMint: "So11111111111111111111111111111111111111112", outputMint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        amountIn: "1000000", // Default amount for initial price fetch
        slippage: 0.5,
      });
    }
  }, [isAuthenticated, getSwapQuote]);

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)"} />;
}
