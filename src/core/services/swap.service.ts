import {
  SwapQuote,
  SwapQuoteRequest,
  BuildSwapTransactionRequest,
  SwapTrasnsaction,
  ExecuteSwap,
} from "@/src/domain/model/swap";
import { TransactionResponse } from "@/src/domain/model/transaction";
import { SwapRepository } from "../port/swap.repository";

export interface SwapService {
  GetSwapQuote(req: SwapQuoteRequest): Promise<SwapQuote | null>;
  BuildSwapTransaction(
    req: BuildSwapTransactionRequest,
    access_token: string,
  ): Promise<SwapTrasnsaction | null>;
  ExecuteSwap(
    req: ExecuteSwap,
    access_token: string,
  ): Promise<TransactionResponse | null>;
}

export class SwapService implements SwapService {
  constructor(private readonly swapRepository: SwapRepository) {}

  async GetSwapQuote(req: SwapQuoteRequest): Promise<SwapQuote | null> {
    try {
      return await this.swapRepository.GetSwapQuote(req);
    } catch (error) {
      console.error("Failed to get swap quote:", error);
      return null;
    }
  }

  async BuildSwapTransaction(
    req: BuildSwapTransactionRequest,
    access_token: string,
  ): Promise<SwapTrasnsaction | null> {
    try {
      return await this.swapRepository.BuildSwapTransaction(req, access_token);
    } catch (error) {
      console.error("Failed to build swap transaction:", error);
      return null;
    }
  }

  async ExecuteSwap(
    req: ExecuteSwap,
    access_token: string,
  ): Promise<TransactionResponse | null> {
    try {
      return await this.swapRepository.ExecuteSwap(req, access_token);
    } catch (error) {
      console.error("Failed to execute swap:", error);
      return null;
    }
  }
}
