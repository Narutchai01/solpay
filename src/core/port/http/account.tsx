import { AccountModel, CreateAccountRequest } from "../../domain/account";

export interface IAccountRepository {
  createAccount(data: CreateAccountRequest): Promise<AccountModel | null>;
}
