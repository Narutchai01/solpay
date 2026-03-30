import {
  ConfirmTopUp,
  TransactionResponse,
} from "@/src/domain/model/transaction";
import { ITransactionRepository } from "../port/transation.repository";

export interface TransactionService {
  confirmTopUpTransaction(
    tx: ConfirmTopUp,
    access_token: string,
  ): Promise<TransactionResponse>;
}

export class TransactionServiceImpl implements TransactionService {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async confirmTopUpTransaction(
    tx: ConfirmTopUp,
    access_token: string,
  ): Promise<TransactionResponse> {
    try {
      const resp = await this.transactionRepository.ConFirmTopUpTransaction(
        tx,
        access_token,
      );
      return resp;
    } catch (error) {
      console.error("Failed to confirm top-up transaction:", error);
      throw error;
    }
  }
}
