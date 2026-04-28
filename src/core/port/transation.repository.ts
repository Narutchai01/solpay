import {
  ConfirmTransaction,
  PaginatedTransactionResponse,
  TransactionResponse,
} from "@/src/domain/model/transaction";

export interface ITransactionRepository {
  ConFirmTopUpTransaction(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse>;

  ConfirmOffChain(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse>;

  ConfirmOnChain(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse>;

  GetTransactionByID(
    txUUID: string,
    access_token: string,
  ): Promise<TransactionResponse>;

  GetTransactionHistory(
    page: number,
    pageSize: number,
    access_token: string,
  ): Promise<PaginatedTransactionResponse>;
}
