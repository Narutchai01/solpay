import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect } from "react";
import { useSwapStore } from "../store/swap.store";

/**
 * Custom hook for token swap logic and state management.
 * Optimized for reactive calculations, store synchronization, and robust "0" defaults.
 */
export const useSwapCalculator = () => {
  const amountIn = useSwapStore((state) => state.amountIn);
  const amountOut = useSwapStore((state) => state.amountOut);
  const currentPrice = useSwapStore((state) => state.currentPrice);
  const setAmountIn = useSwapStore((state) => state.setAmountIn);
  const setAmountOut = useSwapStore((state) => state.setAmountOut);
  const setCurrentPrice = useSwapStore((state) => state.setCurrentPrice);

  // 0. Initialize with "0" on initial mount as requested
  useEffect(() => {
    setAmountIn("0");
    setAmountOut("0");
  }, []);

  // 1. Price Recovery: If price is missing (after reset), re-fetch from storage.
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const storedPrice = await AsyncStorage.getItem("currentPrice");
        if (storedPrice !== null) setCurrentPrice(storedPrice);
      } catch (e) {
        console.error("useSwapCalculator: Price fetch error", e);
      }
    };

    if (!currentPrice) {
      fetchPrice();
    }
  }, [currentPrice, setCurrentPrice]);

  // 3. Calculation: Pay -> Receive
  const handlePayAmountChange = useCallback(
    (val: string) => {
      // Strip leading zero if typing a non-decimal number (e.g., "01" -> "1")
      let cleaned = val;
      if (val.length > 1 && val.startsWith("0") && val[1] !== ".") {
        cleaned = val.substring(1);
      }

      setAmountIn(cleaned);

      if (cleaned === "" || cleaned === "." || parseFloat(cleaned) === 0) {
        setAmountOut("");
        return;
      }

      const price = parseFloat(currentPrice || "0");
      const amount = parseFloat(cleaned);

      if (!isNaN(amount) && price > 0) {
        const calculated = amount * price;
        // USDC typically 6 decimals
        setAmountOut(calculated.toFixed(6).replace(/\.?0+$/, ""));
      } else {
        setAmountOut("");
      }
    },
    [setAmountIn, setAmountOut, currentPrice],
  );

  // 4. Calculation: Receive -> Pay
  const handleReceiveAmountChange = useCallback(
    (val: string) => {
      // Strip leading zero if typing a non-decimal number (e.g., "01" -> "1")
      let cleaned = val;
      if (val.length > 1 && val.startsWith("0") && val[1] !== ".") {
        cleaned = val.substring(1);
      }

      setAmountOut(cleaned);

      if (cleaned === "" || cleaned === "." || parseFloat(cleaned) === 0) {
        setAmountIn("");
        return;
      }

      const price = parseFloat(currentPrice || "0");
      const amount = parseFloat(cleaned);

      if (!isNaN(amount) && price > 0) {
        const calculated = amount / price;
        // SOL typically 9 decimals
        setAmountIn(calculated.toFixed(9).replace(/\.?0+$/, ""));
      } else {
        setAmountIn("");
      }
    },
    [setAmountIn, setAmountOut, currentPrice],
  );

  // Validation
  const canSwap = parseFloat(amountIn) > 0 && parseFloat(amountOut) > 0;

  return {
    payAmount: amountIn,
    receiveAmount: amountOut,
    currentPrice,
    canSwap,
    handlePayAmountChange,
    handleReceiveAmountChange,
  };
};
