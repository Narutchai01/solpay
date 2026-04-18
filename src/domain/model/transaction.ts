export interface TransactionResponse {
  transaction_uuid: string;
  ID: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
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
  tx_hash?: string;
}
