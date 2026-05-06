import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useCallback } from "react";
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

  // 0. Force "0" on initial mount of the screen
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

  // 2. Default "0" Maintenance: If amounts become empty (after reset), restore to "0".
  useEffect(() => {
    if (amountIn === "") setAmountIn("0");
    if (amountOut === "") setAmountOut("0");
  }, [amountIn, amountOut, setAmountIn, setAmountOut]);

  // 3. Calculation: Pay -> Receive
  const handlePayAmountChange = useCallback(
    (val: string) => {
      // Strip leading zeros (e.g., "01" -> "1"), but allow "0."
      let cleaned = val.replace(/^0+(?=\d)/, "");
      if (cleaned === "") cleaned = "0";

      setAmountIn(cleaned);

      const price = parseFloat(currentPrice || "0");
      const amount = parseFloat(cleaned);

      if (!isNaN(amount) && price > 0) {
        const calculated = amount * price;
        setAmountOut(calculated.toFixed(6).replace(/\.?0+$/, ""));
      } else {
        setAmountOut("0");
      }
    },
    [setAmountIn, setAmountOut, currentPrice],
  );

  // 4. Calculation: Receive -> Pay
  const handleReceiveAmountChange = useCallback(
    (val: string) => {
      let cleaned = val.replace(/^0+(?=\d)/, "");
      if (cleaned === "") cleaned = "0";

      setAmountOut(cleaned);

      const price = parseFloat(currentPrice || "0");
      const amount = parseFloat(cleaned);

      if (!isNaN(amount) && price > 0) {
        const calculated = amount / price;
        setAmountIn(calculated.toFixed(6).replace(/\.?0+$/, ""));
      } else {
        setAmountIn("0");
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
