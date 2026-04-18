import { HttpHelper } from "@/lib/http";
import {
  ConfirmTransaction,
  TransactionResponse,
} from "@/src/domain/model/transaction";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_URL } from "../config/config";
import { TransactionServiceImpl } from "../core/services/transaction.service";
import { TransactionRepositoryImpl } from "../infrastructure/transaction.repository";
import { useAuthStore } from "../store/auth.store";

export const useTransaction = () => {
  const [transaction, setTransaction] = useState<TransactionResponse | null>(
    null,
  );

  const accessToken = useAuthStore((state) => state.accessToken);
  const loadTokens = useAuthStore((state) => state.loadTokens);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const transactionService = useMemo(() => {
    const httpHelper = new HttpHelper(API_URL);
    const transactionRepository = new TransactionRepositoryImpl(httpHelper);
    return new TransactionServiceImpl(transactionRepository);
  }, []);

  const CreateTransactionOffchain = useCallback(
    async (reqTx: ConfirmTransaction) => {
      try {
        if (!accessToken) return null;
        const result = await transactionService.confirmOffChainTransaction(
          reqTx,
          accessToken,
        );
        setTransaction(result);
        return result;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [accessToken, transactionService],
  );

  const CreateTransactionOnchain = useCallback(
    async (reqTx: ConfirmTransaction) => {
      try {
        if (!accessToken || !reqTx.tx_hash) return null;
        const result = await transactionService.confirmOnChainTransaction(
          reqTx,
          accessToken,
        );
        setTransaction(result);
        return result;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [accessToken, transactionService],
  );

  const ConfirmTopup = useCallback(
    async ({
      quoteId,
      tx_hash,
      max_slippage: _maxSlippage,
    }: {
      quoteId: string;
      tx_hash: string;
      max_slippage: number;
    }) => {
      void _maxSlippage;
      try {
        if (!accessToken) return null;
        const result = await transactionService.confirmTopUpTransaction(
          {
            quoteID: quoteId,
            tx_hash,
          },
          accessToken,
        );

        setTransaction(result);
        return result;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [accessToken, transactionService],
  );

  const GetTransactionByID = useCallback(
    async (txUUID: string) => {
      const normalizedTxUUID = txUUID.trim();

      try {
        if (!accessToken || !normalizedTxUUID) return null;
        const result = await transactionService.GetTransactionByID(
          normalizedTxUUID,
          accessToken,
        );
        setTransaction(result);
        return result;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [accessToken, transactionService],
  );

  return {
    CreateTransactionOffchain,
    CreateTransactionOnchain,
    ConfirmTopup,
    GetTransactionByID,
    transaction,
  };
};
