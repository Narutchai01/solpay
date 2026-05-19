import { useCallback, useEffect } from "react";
import { useSwapStore } from "../store/swap.store";
import { useSwap } from "./useSwap";

export const useSwapCalculator = () => {
  const amountIn = useSwapStore((state) => state.amountIn);
  const amountOut = useSwapStore((state) => state.amountOut);
  const currentPrice = useSwapStore((state) => state.currentPrice);
  const setAmountIn = useSwapStore((state) => state.setAmountIn);
  const setAmountOut = useSwapStore((state) => state.setAmountOut);

  const { getSwapQuote, fromToken } = useSwap();

  // 0. Initialize with empty string on mount to show placeholder
  useEffect(() => {
    setAmountIn("");
    setAmountOut("");
  }, [setAmountIn, setAmountOut]);
  // 1. Fetch live quote to get accurate currentPrice
  useEffect(() => {
    const fetchInitialPrice = async () => {
      // Use a default small amount to get the rate
      const mint =
        fromToken?.mint || "So11111111111111111111111111111111111111112";
      await getSwapQuote(
        {
          inputMint: mint,
          outputMint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          amountIn: "1000000", // 1 SOL or equivalent token base amount
          slippage: 0.5,
        },
        false,
      );
    };

    if (!currentPrice) {
      void fetchInitialPrice();
    }
  }, [currentPrice, fromToken, getSwapQuote]);

  // 3. Calculation: Pay -> Receive
  const handlePayAmountChange = useCallback(
    (val: string) => {
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
        setAmountIn(calculated.toFixed(9).replace(/\.?0+$/, ""));
      } else {
        setAmountIn("");
      }
    },
    [setAmountIn, setAmountOut, currentPrice],
  );

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
