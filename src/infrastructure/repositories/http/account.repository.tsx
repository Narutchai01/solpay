import { HttpHelper } from "@/lib/http";
import { AccountModel, CreateAccountRequest } from "@/src/core/domain/account";
import { IAccountRepository } from "@/src/core/port/http/account";
import { BackendErrorResponse } from "@/src/type/api-error.type";
import { isAxiosError } from "axios";

export class AccountRepository implements IAccountRepository {
  constructor(private readonly httpHelper: HttpHelper) {}
  async createAccount(
    data: CreateAccountRequest,
  ): Promise<AccountModel | null> {
    try {
      const response = await this.httpHelper.post<AccountModel>(
        "/api/v1/accounts",
        data,
      );
      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 404:
            return null;
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }
}
