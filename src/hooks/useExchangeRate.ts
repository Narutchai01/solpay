import { HttpHelper } from "@/lib/http";
import { ExchangeRateRepositoryImpl } from "@/src/infrastructure/exchange_rate.repository";
import { useCallback, useMemo } from "react";
import { API_URL } from "../config/config";
import { ExchangeServiceImpl } from "../core/services/exchange.service";
import { useExchangeRateStore } from "../store/exchangeRate.store";

export const useExchangeRate = () => {
  const { rate, loading, error, setRate, setLoading, setError } =
    useExchangeRateStore();

  const exchangeService = useMemo(() => {
    const httpHelper = new HttpHelper(API_URL);
    const repository = new ExchangeRateRepositoryImpl(httpHelper);
    return new ExchangeServiceImpl(repository);
  }, []);

  const fetchExchangeRate = useCallback(
    async (symbol: string) => {
      // Return cached rate if it matches the requested symbol to avoid redundant fetches
      if (rate && rate.symbol === symbol) {
        return rate;
      }

      setLoading(true);
      setError(null);
      try {
        const exchangeRate = await exchangeService.getExchangeRate(symbol);
        setRate(exchangeRate);
        return exchangeRate;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch exchange rate";
        setError(errorMessage);
        console.error("Failed to fetch exchange rate:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [exchangeService, rate, setRate, setLoading, setError],
  );

  return { rate, loading, error, fetchExchangeRate };
};
