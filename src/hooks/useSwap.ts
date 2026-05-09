import { HttpHelper } from "@/lib/http";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_URL } from "../config/config";
import { SwapService } from "../core/services/swap.service";
import {
  BuildSwapTransactionRequest,
  SwapQuoteRequest,
  ExecuteSwap,
} from "../domain/model/swap";
import { SwapRepositoryImpl } from "../infrastructure/swap.repository";
import { useSwapStore } from "../store/swap.store";
import { useAuthStore } from "../store/auth.store";
import { useMobileWallet } from "@wallet-ui/react-native-web3js";
import { Connection } from "@solana/web3.js";
import { useQuote } from "./useQuote";

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

  const accessToken = useAuthStore((state) => state.accessToken);
  const loadTokens = useAuthStore((state) => state.loadTokens);

  const { account } = useMobileWallet();
  const { SignQuoteTransaction } = useQuote();

  const [loading, setLoading] = useState<boolean>(false);

  const swapService = useMemo(() => {
    const httpHelper = new HttpHelper(API_URL);
    const swapRepo = new SwapRepositoryImpl(httpHelper);
    return new SwapService(swapRepo);
  }, []);

  const connection = useMemo(
    () => new Connection("https://api.devnet.solana.com", "finalized"),
    [],
  );

  const buildSwapTransactionByInstruction = useCallback(
    async (req: BuildSwapTransactionRequest) => {
      if (!accessToken) {
        console.error("useSwap: No access token available");
        return null;
      }
      setLoading(true);
      try {
        if (!account?.publicKey) {
          throw new Error("Wallet not connected");
        }

        // 1. Get instructions from backend
        const instructionResponse = await swapService.BuildInstruction(
          req,
          accessToken,
        );
        if (!instructionResponse || !instructionResponse.instructions) {
          throw new Error("Failed to get swap instructions");
        }

        // 2. Get the latest blockhash (Use finalized for better cross-node recognition)
        console.log("[useSwap] Fetching fresh finalized blockhash...");
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash("finalized");
        console.log(
          `[useSwap] Finalized Blockhash: ${blockhash} (valid until height: ${lastValidBlockHeight})`,
        );

        // 3. Create unsigned transaction base64
        const unsignedTxBase64 = swapService.CreateUnsignedTransaction(
          instructionResponse.instructions,
          account.publicKey.toBase58(),
          blockhash,
        );

        console.log("Unsigned Transaction (Base64):", unsignedTxBase64);

        // 4. Let user sign on wallet
        const signedTxBase64 = await SignQuoteTransaction(unsignedTxBase64);
        return signedTxBase64;
      } catch (error) {
        console.error("useSwap: Failed to build and sign transaction", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [swapService, connection, accessToken, account, SignQuoteTransaction],
  );

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
    async (req: BuildSwapTransactionRequest) => {
      if (!accessToken) {
        console.error("useSwap: No access token available");
        return null;
      }
      setLoading(true);
      try {
        const result = await swapService.BuildSwapTransaction(req, accessToken);
        return result;
      } catch (error) {
        console.error("useSwap: Failed to build swap transaction", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [swapService, accessToken],
  );

  useEffect(() => {
    if (!accessToken) {
      loadTokens();
    }
  }, [accessToken, loadTokens]);

  const executeSwap = useCallback(
    async (req: ExecuteSwap) => {
      if (!accessToken) {
        console.error("useSwap: No access token available");
        return null;
      }
      setLoading(true);
      try {
        const result = await swapService.ExecuteSwap(req, accessToken);
        return result;
      } catch (error) {
        console.error("useSwap: Failed to execute swap", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [swapService, accessToken],
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
    buildSwapTransactionByInstruction,
    executeSwap,
  };
};
