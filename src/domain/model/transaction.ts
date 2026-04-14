export interface TransactionResponse {
  transaction_uuid: string;
  ID: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: null;
  account_id: number;
  category_id: string;
  transaction_type: string;
  status: string;
  thb_amount: number;
  usdt_amount: number;
  fee: number;
}

export interface ConfirmTopUp {
  quoteID: string;
  tx_hash: string;
  max_slippage: number;
}

export interface ConfirmTransaction {
  quoteID: string;
  tx_hash: string;
  max_slippage: number;
}
