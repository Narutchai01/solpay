import { HttpHelper } from "@/lib/http";
import { useCallback, useMemo, useState } from "react";
import { API_URL } from "../config/config";
import { SwapService } from "../core/services/swap.service";
import {
  BuildSwapTransactionRequest,
  SwapQuoteRequest,
  ExecuteSwap,
} from "../domain/model/swap";
import { SwapRepositoryImpl } from "../infrastructure/swap.repository";
import { useSwapStore } from "../store/swap.store";

export const useSwap = () => {
  const {
    fromToken,
    toToken,
    amountIn,
    amountOut,
    slippage,
    currentPrice,
    setFromToken,
    setToToken,
    setAmountIn,
    setAmountOut,
    setSlippage,
    setCurrentPrice,
    reset,
  } = useSwapStore();

  const [loading, setLoading] = useState<boolean>(false);

  const swapService = useMemo(() => {
    const httpHelper = new HttpHelper(API_URL);
    const swapRepo = new SwapRepositoryImpl(httpHelper);
    return new SwapService(swapRepo);
  }, []);

  const getSwapQuote = useCallback(
    async (req: SwapQuoteRequest) => {
      setLoading(true);
      try {
        const result = await swapService.GetSwapQuote(req);
        if (result) {
          setCurrentPrice(result.currentPrice);
          setAmountIn(result.realAmountIn.decimalAmount);
          setAmountOut(result.amountOut.decimalAmount);
        }
        return result;
      } catch (error) {
        console.error("useSwap: Failed to get swap quote", error);
        setCurrentPrice(null);
        setAmountOut("");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [swapService, setCurrentPrice, setAmountIn, setAmountOut],
  );

  const buildSwapTransaction = useCallback(
    async (req: BuildSwapTransactionRequest, access_token: string) => {
      setLoading(true);
      try {
        const result = await swapService.BuildSwapTransaction(
          req,
          access_token,
        );
        return result;
      } catch (error) {
        console.error("useSwap: Failed to build swap transaction", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [swapService],
  );

  const executeSwap = useCallback(
    async (req: ExecuteSwap, access_token: string) => {
      setLoading(true);
      try {
        const result = await swapService.ExecuteSwap(req, access_token);
        return result;
      } catch (error) {
        console.error("useSwap: Failed to execute swap", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [swapService],
  );

  return {
    // State from store
    fromToken,
    toToken,
    amountIn,
    amountOut,
    slippage,
    currentPrice,
    // Setters from store
    setFromToken,
    setToToken,
    setAmountIn,
    setAmountOut,
    setSlippage,
    setCurrentPrice,
    reset,
    // Hook local state/actions
    loading,
    getSwapQuote,
    buildSwapTransaction,
    executeSwap,
  };
};
