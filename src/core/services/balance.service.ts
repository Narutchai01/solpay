import { BalanceModel } from "@/src/domain/model/balance";
import { IBalanceRepository } from "../port/balance.repository";

export interface BalanceService {
  GetBalance(access_token: string): Promise<BalanceModel>;
}

export class BalanceServiceImpl implements BalanceService {
  constructor(private readonly balanceRepo: IBalanceRepository) {}

  async GetBalance(access_token: string): Promise<BalanceModel> {
    const resp = await this.balanceRepo.GetBalanceByAccessToken(access_token);
    return resp;
  }
}
