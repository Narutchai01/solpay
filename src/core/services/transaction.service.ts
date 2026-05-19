import {
  ConfirmTransaction,
  PaginatedTransactionResponse,
  TransactionResponse,
} from "@/src/domain/model/transaction";
import { ITransactionRepository } from "../port/transation.repository";

export interface TransactionService {
  confirmTopUpTransaction(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse>;
  confirmOffChainTransaction(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse>;
  confirmOnChainTransaction(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse>;

  GetTransactionByID(
    txUUID: string,
    access_token: string,
  ): Promise<TransactionResponse>;
}

export class TransactionServiceImpl implements TransactionService {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async confirmTopUpTransaction(
    tx: ConfirmTransaction,
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

  async confirmOffChainTransaction(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse> {
    try {
      const resp = await this.transactionRepository.ConfirmOffChain(
        tx,
        access_token,
      );
      return resp;
    } catch (error) {
      console.error("Failed to confirm off-chain transaction:", error);
      throw error;
    }
  }

  async confirmOnChainTransaction(
    tx: ConfirmTransaction,
    access_token: string,
  ): Promise<TransactionResponse> {
    try {
      const resp = await this.transactionRepository.ConfirmOnChain(
        tx,
        access_token,
      );
      return resp;
    } catch (error) {
      console.error("Failed to confirm on-chain transaction:", error);
      throw error;
    }
  }

  async GetTransactionByID(
    txUUID: string,
    access_token: string,
  ): Promise<TransactionResponse> {
    try {
      const resp = await this.transactionRepository.GetTransactionByID(
        txUUID,
        access_token,
      );
      return resp;
    } catch (error) {
      console.error("Failed to get transaction by ID:", error);
      throw error;
    }
  }

  async GetTransactionHistory(
    page: number,
    pageSize: number,
    txTypes: string[],
    access_token: string,
  ): Promise<PaginatedTransactionResponse> {
    try {
      const resp = await this.transactionRepository.GetTransactionHistory(
        page,
        pageSize,
        txTypes,
        access_token,
      );
      return resp;
    } catch (error) {
      console.error("Failed to get transaction history:", error);
      throw error;
    }
  }
}
