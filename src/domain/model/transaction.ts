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
  sol_amount: number;
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
  category_id?: string | number | null;
}

export interface TransactionCategory {
  id: number;
  name: string;
}

export interface TransactionOnChainInfo {
  tx_hash: string;
  signature: string;
}

export interface TransactionOffChainInfo {
  prompt_pay_id: string;
  slip_url: string;
}

export interface TransactionHistoryItem {
  id: number;
  transaction_uuid: string;
  account_id: number;
  transaction_type: string;
  status: string;
  category: TransactionCategory;
  thb_amount: number;
  usdt_amount: number;
  fee: number;
  transaction_on_chain?: TransactionOnChainInfo;
  transaction_off_chain?: TransactionOffChainInfo;
  created_at: string;
  updated_at: string;
}

export interface PaginatedTransactionResponse {
  items: TransactionHistoryItem[];
  page: number;
  pageSize: number;
  total: number;
}
