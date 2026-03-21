import { IAccountRepository } from "@/src/core/port/account.repository";
import { AccountModel } from "@/src/domain/model/account";
import { AuthModel } from "@/src/domain/model/auth";

export interface AccountService {
  AuthenticateWallet(address: string): Promise<AuthModel>;
  GetProfile(access_token: string): Promise<AccountModel>;
}

export class AccountService implements AccountService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async AuthenticateWallet(address: string): Promise<AuthModel> {
    const resp = await this.accountRepository.AuthenticateWallet(address);
    return resp;
  }

  async GetProfile(access_token: string): Promise<AccountModel> {
    const resp = await this.accountRepository.GetProfile(access_token);
    return resp;
  }
}
