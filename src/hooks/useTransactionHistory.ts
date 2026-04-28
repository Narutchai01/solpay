import { HttpHelper } from "@/lib/http";
import {
    PaginatedTransactionResponse,
    TransactionHistoryItem,
} from "@/src/domain/model/transaction";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_URL } from "../config/config";
import { TransactionServiceImpl } from "../core/services/transaction.service";
import { TransactionRepositoryImpl } from "../infrastructure/transaction.repository";
import { useAuthStore } from "../store/auth.store";

export const useTransactionHistory = () => {
  const [historyData, setHistoryData] = useState<TransactionHistoryItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const fetchHistory = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      if (!accessToken) return;

      setIsLoading(true);
      setError(null);

      try {
        const result: PaginatedTransactionResponse =
          await transactionService.GetTransactionHistory(
            page,
            pageSize,
            accessToken,
          );

        setHistoryData((prev) =>
          page === 1 ? result.items : [...prev, ...result.items],
        );
        setPagination({
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
        });
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch history",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, transactionService],
  );

  return {
    historyData,
    pagination,
    isLoading,
    error,
    fetchHistory,
  };
};
