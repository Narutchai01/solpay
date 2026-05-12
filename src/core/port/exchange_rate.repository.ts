import { ExchangeRateModel } from "../../domain/model/exchange_rate";

export interface ExchangeRateRepository {
  getExchangeRate(symbol: string): Promise<ExchangeRateModel>;
}
