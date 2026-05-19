import { CreateQuoteRequest, Quote } from "@/src/domain/model/quote";
import { IQuoteRepository } from "../port/quote.repository";

export interface QuoteService {
  CreateQuote(
    quote: CreateQuoteRequest,
    access_token: string,
  ): Promise<Quote | null>;
  GetQuoteByID(id: string, access_token: string): Promise<Quote | null>;
  ConfirmQuote(id: string, access_token: string): Promise<string | null>;
}

export class QuoteService implements QuoteService {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async CreateQuote(
    quote: CreateQuoteRequest,
    access_token: string,
  ): Promise<Quote | null> {
    try {
      const resp = await this.quoteRepository.CreateQuote(quote, access_token);
      return resp;
    } catch (error) {
      console.error("Failed to create quote:", error);
      return null;
    }
  }

  async GetQuoteByID(id: string, access_token: string): Promise<Quote | null> {
    try {
      const resp = await this.quoteRepository.GetQuoteByID(id, access_token);
      return resp;
    } catch (error) {
      console.error("Failed to get quote by ID:", error);
      return null;
    }
  }

  async ConfirmQuote(id: string, access_token: string): Promise<string | null> {
    try {
      const resp = await this.quoteRepository.ConfirmQuote(id, access_token);

      if (!resp) {
        throw new Error("Failed to confirm quote");
      }

      return resp.tx_hash;
    } catch (error) {
      console.error("Failed to confirm quote:", error);
      return null;
    }
  }
}
