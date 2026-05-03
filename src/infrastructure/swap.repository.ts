import { BackendErrorResponse } from "@/src/core/type/api-error.type";
import { isAxiosError } from "axios";
import { HttpHelper } from "../../lib/http";
import { SwapRepository } from "../core/port/swap.repository";
import { BaseModel } from "../domain/model";
import { SwapQuote, SwapQuoteRequest } from "../domain/model/swap";

export class SwapRepositoryImpl implements SwapRepository {
  constructor(private readonly httpHelper: HttpHelper) {}

  async GetSwapQuote(req: SwapQuoteRequest): Promise<SwapQuote> {
    try {
      const resp = await this.httpHelper.get<BaseModel<SwapQuote>>(
        "/api/v1/swap/quote",
        {
          params: req,
        },
      );
      return resp.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 404:
            throw new Error("Swap quote not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }
}
