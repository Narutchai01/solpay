import { API_URL } from "../config/config";
import { useMemo, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { TransactionRepositoryImpl } from "../infrastructure/transaction.repository";
import { TransactionServiceImpl } from "../core/services/transaction.service";
import HttpHelper from "@/lib/http";
import {
  TransactionResponse,
  ConfirmTransaction,
} from "@/src/domain/model/transaction";
import { useEffect } from "react";

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
  }, [accessToken]);

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

  return { CreateTransactionOffchain, transaction };
};
