import { HttpHelper } from "@/lib/http";
import {
  ConfirmTransaction,
  TransactionResponse,
} from "@/src/domain/model/transaction";
import { useEffect, useMemo, useState } from "react";
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

  const CreateTransactionOffchain = async (reqTx: ConfirmTransaction) => {
    try {
      if (!accessToken) return;
      const result = await transactionService.confirmOffChainTransaction(
        reqTx,
        accessToken,
      );
      setTransaction(result);
    } catch (error) {
      console.error(error);
    }
  };

  const CreateTransactionOnchain = async (reqTx: ConfirmTransaction) => {
    try {
      if (!accessToken || !reqTx.tx_hash) return;
      const result = await transactionService.confirmOnChainTransaction(
        reqTx,
        accessToken,
      );
      setTransaction(result);
    } catch (error) {
      console.error(error);
    }
  };

  const ConfirmTopup = async ({
    quoteId,
    tx_hash,
    max_slippage,
  }: {
    quoteId: string;
    tx_hash: string;
    max_slippage: number;
  }) => {
    try {
      if (!accessToken) return;
      const result = await transactionService.confirmTopUpTransaction(
        {
          quoteID: quoteId,
          tx_hash,
          max_slippage: 0,
        },
        accessToken,
      );
      setTransaction(result);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    CreateTransactionOffchain,
    CreateTransactionOnchain,
    ConfirmTopup,
    transaction,
  };
};
