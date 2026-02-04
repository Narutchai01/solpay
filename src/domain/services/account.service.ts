import { AccountModel, CreateAccountRequest } from "../model/account";
import { IAccountRepository } from "../port/http/account";

interface AccountService {
  createAccount(data: CreateAccountRequest): Promise<AccountModel | null>;
}

export class AccountServiceImpl implements AccountService {
  constructor(private readonly accountRepository: IAccountRepository) {}
  createAccount(data: CreateAccountRequest): Promise<AccountModel | null> {
    return this.accountRepository.createAccount(data);
  }
}
