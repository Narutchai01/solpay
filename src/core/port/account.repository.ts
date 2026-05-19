import { AccountModel } from "@/src/domain/model/account";
import { AuthModel } from "@/src/domain/model/auth";

export interface IAccountRepository {
  AuthenticateWallet(address: string): Promise<AuthModel>;
  GetProfile(access_token: string): Promise<AccountModel>;
}
