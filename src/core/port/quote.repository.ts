import {
  ConFirmQuoteResponse,
  CreateQuoteRequest,
  Quote,
} from "../../domain/model/quote";

export interface IQuoteRepository {
  CreateQuote(quote: CreateQuoteRequest, access_token: string): Promise<Quote>;
  GetQuoteByID(id: string, access_token: string): Promise<Quote>;
  ConfirmQuote(id: string, access_token: string): Promise<ConFirmQuoteResponse>;
}
