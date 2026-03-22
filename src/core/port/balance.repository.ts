import { BalanceModel } from "@/src/domain/model/balance";

export interface IBalanceRepository {
  GetBalanceByAccessToken(access_token: string): Promise<BalanceModel>;
}
