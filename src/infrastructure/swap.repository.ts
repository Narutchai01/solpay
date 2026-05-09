import { BackendErrorResponse } from "@/src/core/type/api-error.type";
import { isAxiosError } from "axios";
import { HttpHelper } from "../../lib/http";
import { SwapRepository } from "../core/port/swap.repository";
import { BaseModel } from "../domain/model";
import {
  BuildSwapTransactionRequest,
  ExecuteSwap,
  SwapQuote,
  SwapQuoteRequest,
  SwapTrasnsaction,
  SwapInstructionsResponse,
} from "../domain/model/swap";
import { TransactionResponse } from "../domain/model/transaction";

export class SwapRepositoryImpl implements SwapRepository {
  constructor(private readonly httpHelper: HttpHelper) {}

  async GetSwapQuote(req: SwapQuoteRequest): Promise<SwapQuote> {
    try {
      const resp = await this.httpHelper.get<BaseModel<SwapQuote>>(
        "/api/v1/swaps/quote",
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

  async BuildSwapTransaction(
    req: BuildSwapTransactionRequest,
    access_token: string,
  ): Promise<SwapTrasnsaction> {
    try {
      const resp = await this.httpHelper.post<BaseModel<SwapTrasnsaction>>(
        "/api/v1/swaps/swap",
        req,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      return resp.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 400:
            throw new Error("Bad Request: Invalid swap parameters");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }
  async ExecuteSwap(
    req: ExecuteSwap,
    access_token: string,
  ): Promise<TransactionResponse> {
    try {
      const resp = await this.httpHelper.post<BaseModel<TransactionResponse>>(
        "/api/v1/swaps/execute",
        req,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return resp.data;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          // มี response จาก server (4xx, 5xx)
          const status = error.response.status;
          const resp = error.response.data as BackendErrorResponse;
          switch (status) {
            case 400:
              throw new Error("Bad Request: Invalid swap parameters");
            case 500:
              throw new Error(resp.message || "Internal Server Error");
            default:
              throw new Error(`Unexpected error: ${status}`);
          }
        } else if (error.request) {
          // Request ถูกส่งไปแล้ว แต่ไม่ได้รับ response = HTTP 0
          throw new Error("Network error: Unable to reach server");
        } else {
          // ตั้ง request ไม่สำเร็จเลย (เช่น config ผิด)
          throw new Error(`Request setup error: ${error.message}`);
        }
      }
      throw error;
    }
  }

  async BuildInstruction(
    req: BuildSwapTransactionRequest,
    access_token: string,
  ): Promise<SwapInstructionsResponse> {
    try {
      const resp = await this.httpHelper.post<
        BaseModel<SwapInstructionsResponse>
      >("/api/v1/swaps/instruction", req, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return resp.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 400:
            throw new Error("Bad Request: Invalid swap parameters");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }
}
