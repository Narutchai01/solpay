import { BackendErrorResponse } from "@/src/core/type/api-error.type";
import { isAxiosError } from "axios";
import { HttpHelper } from "../../lib/http";
import { ITransactionRepository } from "../core/port/transation.repository";
import { BaseModel } from "../domain/model";
import {
  ConfirmTopUp,
  ConfirmTransaction,
  TransactionResponse,
} from "../domain/model/transaction";

export class TransactionRepositoryImpl implements ITransactionRepository {
  constructor(private readonly httpHelper: HttpHelper) {}

  async ConFirmTopUpTransaction(
    tx: ConfirmTopUp,
    access_token: string,
  ): Promise<TransactionResponse> {
    try {
      const resp = await this.httpHelper.post<BaseModel<TransactionResponse>>(
        "/api/v1/topup/confirm",
        tx,
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
          case 404:
            throw new Error("Transaction not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }

  async ConfirmOffChain(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse> {
    try {
      const resp = await this.httpHelper.post<BaseModel<TransactionResponse>>(
        "/api/v1/offchain/confirm",
        tx,
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
          case 404:
            throw new Error("Transaction not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }

  async ConfirmOnChain(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse> {
    try {
      const resp = await this.httpHelper.post<BaseModel<TransactionResponse>>(
        "/api/v1/onchain/confirm",
        tx,
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
          case 404:
            throw new Error("Transaction not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }

  async GetTransactionByID(txUUID: string): Promise<TransactionResponse> {
    try {
      const resp = await this.httpHelper.get<BaseModel<TransactionResponse>>(
        `/api/v1/transaction/${txUUID}`,
      );
      return resp.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 404:
            throw new Error("Transaction not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }
}
