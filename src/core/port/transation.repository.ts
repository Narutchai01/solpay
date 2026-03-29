import {
  ConfirmTopUp,
  TransactionResponse,
} from "@/src/domain/model/transaction";

export interface ITransactionRepository {
  ConFirmTopUpTransaction(
    tx: ConfirmTopUp,
    access_token: string,
  ): Promise<TransactionResponse>;
}
