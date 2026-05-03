import { create } from "zustand";
import { TokenAsset } from "../screen/swap/tokenSelectModal.component";

interface SwapState {
  fromToken: TokenAsset | null;
  toToken: TokenAsset | null;
  amountIn: string;
  amountOut: string;
  slippage: string;
  currentPrice: string | null;

  setFromToken: (token: TokenAsset | null) => void;
  setToToken: (token: TokenAsset | null) => void;
  setAmountIn: (amount: string) => void;
  setAmountOut: (amount: string) => void;
  setSlippage: (slippage: string) => void;
  setCurrentPrice: (price: string | null) => void;
  reset: () => void;
}

export const useSwapStore = create<SwapState>((set) => ({
  fromToken: null,
  toToken: null,
  amountIn: "",
  amountOut: "",
  slippage: "0.50",
  currentPrice: null,

  setFromToken: (token) => set({ fromToken: token }),
  setToToken: (token) => set({ toToken: token }),
  setAmountIn: (amount) => set({ amountIn: amount }),
  setAmountOut: (amount) => set({ amountOut: amount }),
  setSlippage: (slippage) => set({ slippage }),
  setCurrentPrice: (price) => set({ currentPrice: price }),
  reset: () =>
    set({
      fromToken: null,
      toToken: null,
      amountIn: "",
      amountOut: "",
      slippage: "0.50",
      currentPrice: null,
    }),
}));
