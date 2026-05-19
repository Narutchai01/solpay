import { create } from "zustand";
import { ExchangeRateModel } from "../domain/model/exchange_rate";

interface ExchangeRateState {
  rate: ExchangeRateModel | null;
  loading: boolean;
  error: string | null;
  setRate: (rate: ExchangeRateModel | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useExchangeRateStore = create<ExchangeRateState>((set) => ({
  rate: null,
  loading: false,
  error: null,
  setRate: (rate) => set({ rate }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
