export interface SwapQuote {
  poolId: string;
  inputMint: string;
  outputMint: string;
  slippage: number;
  amountInRequested: string;
  currentPrice: string;
  executionPrice: string;
  priceImpact: string;
  executionPriceX64: string;
  remainingAccounts: string[];
  realAmountIn: AmountOut;
  amountOut: AmountOut;
  minAmountOut: AmountOut;
  fee: AmountOut;
}

export interface AmountOut {
  rawAmount: string;
  decimalAmount: string;
}

export interface SwapQuoteRequest {
  slippage: number;
  amountIn: string;
}
