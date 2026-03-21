import { AuthModel } from "@/src/domain/model/auth";

export interface IAccountRepository {
  AuthenticateWallet(address: string): Promise<AuthModel>;
}
