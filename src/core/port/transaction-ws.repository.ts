import { TransactionResponse } from "@/src/domain/model/transaction";
export interface ITransactionWebSocketPort {
  connect(transactionId: string): void;
  disconnect(): void;
  onMessage(callback: (msg: TransactionResponse) => void): void;
  onError(callback: (error: Error) => void): void;
}
