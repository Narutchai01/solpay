import { SwapQuote, SwapQuoteRequest } from "../../domain/model/swap";

export interface SwapRepository {
  GetSwapQuote(req: SwapQuoteRequest): Promise<SwapQuote>;
}
