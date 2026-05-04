import {
  SwapQuote,
  SwapQuoteRequest,
  BuildSwapTransactionRequest,
  SwapTrasnsaction,
  ExecuteSwap,
} from "../../domain/model/swap";
import { TransactionResponse } from "@/src/domain/model/transaction";

export interface SwapRepository {
  GetSwapQuote(req: SwapQuoteRequest): Promise<SwapQuote>;
  BuildSwapTransaction(
    req: BuildSwapTransactionRequest,
    access_token: string,
  ): Promise<SwapTrasnsaction>;
  ExecuteSwap(
    req: ExecuteSwap,
    access_token: string,
  ): Promise<TransactionResponse>;
}
