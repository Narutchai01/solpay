import { HttpHelper } from "@/lib/http";
import { VersionedTransaction } from "@solana/web3.js";
import {
  fromUint8Array,
  toUint8Array,
  useMobileWallet,
} from "@wallet-ui/react-native-web3js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_URL } from "../config/config";
import { QuoteService } from "../core/services/quote.service";
import { CreateQuoteRequest, Quote } from "../domain/model/quote";
import { QuoteRepositoryImpl } from "../infrastructure/quote.repository";
import { useAuthStore } from "../store/auth.store";

export const useQuote = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [unsignTx, setUnsignTx] = useState<string | null>(null);
  const [signTx, setSignTx] = useState<string | null>(null);

  const { account, connect, signTransactions } = useMobileWallet();

  const accessToken = useAuthStore((state) => state.accessToken);
  const loadTokens = useAuthStore((state) => state.loadTokens);

  const quoteService = useMemo(() => {
    const httpHelper = new HttpHelper(API_URL);
    const quoteRepo = new QuoteRepositoryImpl(httpHelper);
    return new QuoteService(quoteRepo);
  }, []);

  useEffect(() => {
    void loadTokens();
  }, [loadTokens]);

  const createQuote = useCallback(
    async (quoteRequest: CreateQuoteRequest) => {
      try {
        if (!accessToken) {
          throw new Error("Access token is required to create a quote");
        }

        const newQuote = await quoteService.CreateQuote(
          quoteRequest,
          accessToken,
        );

        if (!newQuote) {
          throw new Error("Failed to create quote");
        }
        setQuote(newQuote);
        return newQuote;
      } catch (error) {
        console.error("Failed to create quote:", error);
        throw error;
      }
    },
    [accessToken, quoteService],
  );

  const GetQuoteByID = useCallback(
    async (id: string) => {
      try {
        if (!accessToken) {
          throw new Error("Access token is required to fetch quote");
        }

        const fetchedQuote = await quoteService.GetQuoteByID(id, accessToken);
        setQuote(fetchedQuote);
        return fetchedQuote;
      } catch (error) {
        console.error("Failed to fetch quote:", error);
        throw error;
      }
    },
    [accessToken, quoteService],
  );

  const ensureConnectedAccount = useCallback(async () => {
    if (account) {
      return account;
    }

    const connectedAccount = await connect();
    if (!connectedAccount) {
      throw new Error("Please connect wallet before signing transaction");
    }

    return connectedAccount;
  }, [account, connect]);

  const SignQuoteTransaction = useCallback(
    async (rawUnsignTx: string) => {
      try {
        console.log("👉 Sign Step 1.1: Start ensureConnectedAccount");
        await ensureConnectedAccount();

        console.log("👉 Sign Step 1.2: Deserializing transaction");
        const serializedTx = toUint8Array(rawUnsignTx);
        const tx = VersionedTransaction.deserialize(serializedTx);

        console.log(
          "👉 Sign Step 1.3: Calling signTransactions with Timeout...",
        );

        // 🛡️ สร้างระบบ Timeout ตัดจบถ้า Wallet ไม่ตอบสนองภายใน 30 วินาที
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  "Wallet request timed out. Please try opening your Wallet app directly.",
                ),
              ),
            30000,
          ),
        );

        // แข่งกันว่าใครเสร็จก่อน ระหว่างการ Sign กับ Timeout
        const [signedTx] = await Promise.race([
          signTransactions([tx]),
          timeoutPromise,
        ]);

        console.log(
          "👉 Sign Step 1.4: Successfully signed! Converting to Base64",
        );
        const signedTxBase64 = fromUint8Array(signedTx.serialize());

        setSignTx(signedTxBase64);
        return signedTxBase64;
      } catch (err) {
        console.error("🚨 Error inside SignQuoteTransaction:", err);
        throw err;
      }
    },
    [ensureConnectedAccount, signTransactions],
  );
  const ConfirmQuote = useCallback(
    async (id: string) => {
      try {
        if (!accessToken) {
          throw new Error("Access token is required to confirm quote");
        }

        setSignTx(null);

        const unSignTx = await quoteService.ConfirmQuote(id, accessToken);
        setUnsignTx(unSignTx);

        if (unSignTx) {
          const signedTxBase64 = await SignQuoteTransaction(unSignTx);
          return signedTxBase64;
        }
      } catch (error) {
        console.error("Failed to confirm quote:", error);
        throw error;
      }
    },
    [SignQuoteTransaction, accessToken, quoteService],
  );

  return {
    quote,
    createQuote,
    GetQuoteByID,
    ConfirmQuote,
    SignQuoteTransaction,
    unsignTx,
    signTx,
  };
};
