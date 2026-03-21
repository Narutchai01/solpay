import { BackendErrorResponse } from "@/src/core/type/api-error.type";
import { isAxiosError } from "axios";
import { HttpHelper } from "../../lib/http";
import { IAccountRepository } from "../core/port/account.repository";
import { BaseModel } from "../domain/model";
import { AccountModel, CreateAccountRequest } from "../domain/model/account";
import { AuthModel } from "../domain/model/auth";

export class AccountRepositoryImpl implements IAccountRepository {
  constructor(private readonly httpHelper: HttpHelper) {}
  async AuthenticateWallet(address: string): Promise<AuthModel> {
    try {
      const req: CreateAccountRequest = {
        public_address: address,
      };
      const response = await this.httpHelper.post<BaseModel<AuthModel>>(
        "/api/v1/accounts",
        req,
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 404:
            throw new Error("Account not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }

  async GetProfile(access_token: string): Promise<AccountModel> {
    try {
      const response = await this.httpHelper.get<BaseModel<AccountModel>>(
        "/api/v1/accounts/me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 404:
            throw new Error("Profile not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    } finally {
      this.httpHelper.clearAuthorization();
    }
  }
}
