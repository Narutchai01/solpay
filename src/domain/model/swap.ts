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
  inputMint: string;
  outputMint: string;
  amountIn: string;
}

export interface BuildSwapTransactionRequest {
  inputMint: string;
  outputMint: string;
  amountIn: string;
  slippage: number;
}

export interface SwapTrasnsaction {
  transaction: string;
}

export interface ExecuteSwap {
  usdt_amount: string;
  sol_amount: string;
  tx_hash: string;
}
