import {
  ConfirmTopUp,
  ConfirmTransaction,
  TransactionResponse,
} from "@/src/domain/model/transaction";

export interface ITransactionRepository {
  ConFirmTopUpTransaction(
    tx: ConfirmTopUp,
    access_token: string,
  ): Promise<TransactionResponse>;

  ConfirmOffChain(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse>;
}
