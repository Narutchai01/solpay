import { IAccountRepository } from "@/src/core/port/account.repository";
import { AuthModel } from "@/src/domain/model/auth";

export interface AccountService {
  AuthenticateWallet(address: string): Promise<AuthModel>;
}

export class AccountService implements AccountService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async AuthenticateWallet(address: string): Promise<AuthModel> {
    return this.accountRepository.AuthenticateWallet(address);
  }
}
