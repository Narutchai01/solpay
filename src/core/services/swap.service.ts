import { SwapQuote, SwapQuoteRequest } from "@/src/domain/model/swap";
import { SwapRepository } from "../port/swap.repository";

export interface SwapService {
  GetSwapQuote(req: SwapQuoteRequest): Promise<SwapQuote | null>;
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
}
