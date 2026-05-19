import { ExchangeRateRepository } from "@/src/core/port/exchange_rate.repository";
import HttpClient from "@/lib/http";
import { BaseModel } from "../domain/model";
import { ExchangeRateModel } from "../domain/model/exchange_rate";

export class ExchangeRateRepositoryImpl implements ExchangeRateRepository {
  constructor(private httpClient: HttpClient) {}

  async getExchangeRate(symbol: string): Promise<ExchangeRateModel> {
    const response = await this.httpClient.get<BaseModel<ExchangeRateModel>>(
      `/api/v1/exchange-rates?sym=${symbol}`,
    );
    const data = response.data;
    return data;
  }
}
