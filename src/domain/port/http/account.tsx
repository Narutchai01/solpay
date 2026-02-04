import { AccountModel, CreateAccountRequest } from "../../model/account";

export interface IAccountRepository {
  createAccount(data: CreateAccountRequest): Promise<AccountModel | null>;
}
