import { BackendErrorResponse } from "@/src/core/type/api-error.type";
import { isAxiosError } from "axios";
import { HttpHelper } from "../../lib/http";
import { IBalanceRepository } from "../core/port/balance.repository";
import { BaseModel } from "../domain/model";
import { BalanceModel } from "../domain/model/balance";

export class BalanceRepositoryImpl implements IBalanceRepository {
  constructor(private readonly httpHelper: HttpHelper) {}
  async GetBalanceByAccessToken(access_token: string): Promise<BalanceModel> {
    try {
      const resp = await this.httpHelper.get<BaseModel<BalanceModel>>(
        "/api/v1/balances/me",
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
            throw new Error("Balance not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }
}
