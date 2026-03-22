import { HttpHelper } from "@/lib/http";
import { BalanceRepositoryImpl } from "@/src/infrastructure/balance.repository";
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config/config";
import { BalanceServiceImpl } from "../core/services/balance.service";
import { BalanceModel } from "../domain/model/balance";
import { useAuthStore } from "../store/auth.store";

export const useBalance = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const loadTokens = useAuthStore((state) => state.loadTokens);
  const [balance, setBalance] = useState<BalanceModel | null>(null);

  const balanceService = useMemo(() => {
    const httpHelper = new HttpHelper(API_URL);
    const balanceRepo = new BalanceRepositoryImpl(httpHelper);
    return new BalanceServiceImpl(balanceRepo);
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      await loadTokens();
      if (accessToken) {
        try {
          const balance = await balanceService.GetBalance(accessToken);
          setBalance(balance);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      } else {
        setBalance(null);
      }
    };
    void fetchBalance();
  }, [accessToken, balanceService, loadTokens]);

  return { balance };
};
