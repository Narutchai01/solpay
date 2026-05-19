import { ExchangeRateModel } from "@/src/domain/model/exchange_rate";
import { ExchangeRateRepository } from "@/src/core/port/exchange_rate.repository";

export interface ExchangeService {
  getExchangeRate(symbol: string): Promise<ExchangeRateModel>;
}

export class ExchangeServiceImpl implements ExchangeService {
  constructor(private exchangeRateRepository: ExchangeRateRepository) {}

  async getExchangeRate(symbol: string): Promise<ExchangeRateModel> {
    const exchangeRate =
      await this.exchangeRateRepository.getExchangeRate(symbol);
    return exchangeRate;
  }
}
